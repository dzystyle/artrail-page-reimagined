import { useRef, useState } from "react";
import { createParser } from "eventsource-parser";

export type VoiceState = "idle" | "recording" | "transcribing";

function encodeWav(chunks: readonly Float32Array[], sampleRate: number): Blob {
  const length = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const bytes = new ArrayBuffer(44 + length * 2);
  const view = new DataView(bytes);
  const tag = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i));
  };
  tag(0, "RIFF");
  view.setUint32(4, 36 + length * 2, true);
  tag(8, "WAVE");
  tag(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  tag(36, "data");
  view.setUint32(40, length * 2, true);
  let offset = 44;
  for (const chunk of chunks)
    for (const value of chunk) {
      const sample = Math.max(-1, Math.min(1, value));
      view.setInt16(offset, sample * (sample < 0 ? 32768 : 32767), true);
      offset += 2;
    }
  return new Blob([bytes], { type: "audio/wav" });
}

async function recordWav(): Promise<{ stop: () => Promise<File> }> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  let context: AudioContext | undefined;
  try {
    context = new AudioContext();
    await context.resume();
    const audioContext = context;
    const source = audioContext.createMediaStreamSource(stream);
    const node = audioContext.createScriptProcessor(4096, 1, 1);
    const chunks: Float32Array[] = [];
    node.onaudioprocess = (event) => chunks.push(new Float32Array(event.inputBuffer.getChannelData(0)));
    source.connect(node);
    node.connect(audioContext.destination);
    let stopped = false;
    return {
      async stop() {
        if (stopped) throw new Error("录音已停止");
        stopped = true;
        stream.getTracks().forEach((track) => track.stop());
        node.disconnect();
        source.disconnect();
        node.onaudioprocess = null;
        const blob = encodeWav(chunks, audioContext.sampleRate);
        await audioContext.close();
        if (blob.size < 2048) throw new Error("录音太短，请按住说话后重试。");
        return new File([blob], "recording.wav", { type: "audio/wav" });
      },
    };
  } catch (error) {
    stream.getTracks().forEach((track) => track.stop());
    await context?.close();
    throw error;
  }
}

async function transcribeFile(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file, file.name);
  const response = await fetch("/api/public/transcribe", { method: "POST", body: form });
  if (!response.ok || !response.body) {
    const payload = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(payload.message ?? `语音转文字失败（${response.status}）。`);
  }
  let transcript = "";
  const parser = createParser({
    onEvent(event) {
      if (event.event === "transcript.text.delta") {
        try { transcript += (JSON.parse(event.data) as { delta?: string }).delta ?? ""; } catch { /* ignore malformed chunk */ }
      } else if (event.event === "transcript.text.done") {
        try { transcript = (JSON.parse(event.data) as { text?: string }).text ?? transcript; } catch { /* keep deltas */ }
      }
    },
  });
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    parser.feed(decoder.decode(value, { stream: true }));
  }
  if (!transcript.trim()) throw new Error("没有识别到语音内容，请再试一次。");
  return transcript.trim();
}

/** Records microphone audio as WAV and streams back a transcript. Browser-only; call toggle() from a click handler. */
export function useVoiceInput(onText: (text: string) => void) {
  const [state, setState] = useState<VoiceState>("idle");
  const [error, setError] = useState("");
  const recorder = useRef<{ stop: () => Promise<File> } | null>(null);

  const toggle = async () => {
    setError("");
    if (state === "transcribing") return;
    if (state === "recording" && recorder.current) {
      const active = recorder.current;
      recorder.current = null;
      setState("transcribing");
      try {
        const file = await active.stop();
        const text = await transcribeFile(file);
        onText(text);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "语音转文字失败，请重试。");
      } finally {
        setState("idle");
      }
      return;
    }
    try {
      recorder.current = await recordWav();
      setState("recording");
    } catch {
      setError("无法使用麦克风，请在浏览器中允许麦克风权限。");
    }
  };

  return { state, error, toggle };
}
