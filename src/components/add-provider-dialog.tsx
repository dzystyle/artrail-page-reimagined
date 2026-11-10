import { useState } from "react";
import { ChevronDown, Eye, EyeOff, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export type ProviderDraft = {
  name: string;
  endpoint: string;
  protocol: string;
  authentication: string;
  models: { id: string; name: string; enabled: boolean }[];
};

const protocols = ["OpenAI聊天完成", "OpenAI Responses", "Anthropic Messages", "Google Gemini"];
const authenticationMethods = ["API密钥", "Bearer令牌", "无需验证"];

export function AddProviderDialog({ initial, onClose, onSave }: {
  initial?: Partial<ProviderDraft>;
  onClose: () => void;
  onSave: (draft: ProviderDraft) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [endpoint, setEndpoint] = useState(initial?.endpoint ?? "");
  const [protocol, setProtocol] = useState(initial?.protocol ?? protocols[0] ?? "OpenAI聊天完成");
  const [authentication, setAuthentication] = useState(initial?.authentication ?? "API密钥");
  const [credential, setCredential] = useState("");
  const [showCredential, setShowCredential] = useState(false);
  const [models, setModels] = useState<ProviderDraft["models"]>(initial?.models ?? []);
  const [manualOpen, setManualOpen] = useState(false);
  const [modelId, setModelId] = useState("");
  const [modelName, setModelName] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function addModel() {
    const id = modelId.trim();
    if (!id) { setError("请输入模型 ID。"); return; }
    if (models.some(model => model.id === id)) { setError("这个模型已添加。"); return; }
    setModels(list => [...list, { id, name: modelName.trim() || id, enabled: true }]);
    setModelId(""); setModelName(""); setError("");
  }

  return <Dialog open onOpenChange={value => { if (!value) onClose(); }}>
    <DialogContent className="max-h-[90dvh] w-[calc(100%-32px)] max-w-[936px] gap-0 overflow-hidden rounded-lg border-border bg-background p-0">
      <form className="flex min-h-0 flex-col overflow-hidden" onSubmit={event => {
        event.preventDefault();
        if (!name.trim()) { setError("请输入显示名称。"); return; }
        let url: URL;
        try { url = new URL(endpoint.trim()); } catch { setError("请输入有效的基本 URL。"); return; }
        if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) { setError("请使用不含账号或密码的 HTTP 或 HTTPS 地址。"); return; }
        setCredential("");
        onSave({ name: name.trim(), endpoint: endpoint.trim(), protocol, authentication, models });
      }}>
        <header className="px-5 pb-5 pt-6 sm:px-6">
          <DialogTitle className="pr-8 leading-6 tracking-normal">{initial?.endpoint ? "配置提供商" : "添加提供商"}</DialogTitle>
          <DialogDescription className="mt-1.5">一项与 OpenAI、Anthropic 或 Google API 兼容的服务。</DialogDescription>
        </header>
        <div className="min-h-0 space-y-5 overflow-y-auto px-5 pb-6 sm:px-6">
          <label className="block space-y-2 text-sm text-muted-foreground"><span>显示名称</span><Input autoFocus aria-label="显示名称" placeholder="我的服务提供商" value={name} onChange={e => setName(e.target.value)} className="h-10 text-foreground" required /></label>
          <div className="space-y-2"><label className="block space-y-2 text-sm text-muted-foreground"><span>基本 URL</span><Input aria-label="基本 URL" type="url" placeholder="https://api.example.com/v1" value={endpoint} onChange={e => setEndpoint(e.target.value)} className="h-10 text-foreground" required /></label><p className="text-xs text-muted-foreground">使用 API 端点，如果您的服务需要，请包含 /v1。</p></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><label id="provider-protocol" className="text-sm text-muted-foreground">默认语言协议</label><Select value={protocol} onValueChange={setProtocol}><SelectTrigger aria-labelledby="provider-protocol" className="h-10"><SelectValue /></SelectTrigger><SelectContent>{protocols.map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><label id="provider-authentication" className="text-sm text-muted-foreground">验证</label><Select value={authentication} onValueChange={value => { setAuthentication(value); setCredential(""); }}><SelectTrigger aria-labelledby="provider-authentication" className="h-10"><SelectValue /></SelectTrigger><SelectContent>{authenticationMethods.map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>
          </div>
          {authentication !== "无需验证" && <div className="space-y-2"><label htmlFor="provider-credential" className="text-sm text-muted-foreground">{authentication === "API密钥" ? "API密钥" : "Bearer令牌"}</label><div className="relative"><Input id="provider-credential" autoComplete="off" type={showCredential ? "text" : "password"} placeholder={authentication === "API密钥" ? "粘贴您的 API 密钥" : "粘贴您的 Bearer 令牌"} value={credential} onChange={e => setCredential(e.target.value)} className="h-10 pr-10" /><Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 size-8" aria-label={showCredential ? "隐藏密钥" : "显示密钥"} title={showCredential ? "隐藏密钥" : "显示密钥"} onClick={() => setShowCredential(value => !value)}>{showCredential ? <EyeOff /> : <Eye />}</Button></div></div>}
          <section className="space-y-3 border-t border-border pt-5">
            <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-medium">已启用模型 <span>{models.filter(model => model.enabled).length}</span></h3><Button variant="secondary" size="sm" type="button" onClick={() => setNotice("尚未连接提供商，暂时无法获取模型列表；可手动添加模型。 ")}><RefreshCw />获取</Button></div>
            {models.length === 0 ? <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">暂无模型添加。</div> : <div className="divide-y divide-border rounded-md border border-border">{models.map(model => <div key={model.id} className="flex items-center gap-3 px-3 py-2"><div className="min-w-0 flex-1"><p className="break-words text-sm">{model.name}</p><p className="break-all text-xs text-muted-foreground">{model.id}</p></div><Switch aria-label={`启用模型 ${model.id}`} checked={model.enabled} onCheckedChange={enabled => setModels(list => list.map(item => item.id === model.id ? { ...item, enabled } : item))} /><Button type="button" variant="ghost" size="icon" aria-label={`删除模型 ${model.id}`} title="删除模型" onClick={() => setModels(list => list.filter(item => item.id !== model.id))}><Trash2 /></Button></div>)}</div>}
            <div className="border-t border-border pt-2"><Button type="button" variant="ghost" className="w-full justify-start px-0 font-normal" aria-expanded={manualOpen} onClick={() => setManualOpen(value => !value)}><Plus className="text-muted-foreground" />手动添加模型<ChevronDown className={`ml-auto text-muted-foreground transition-transform ${manualOpen ? "rotate-180" : ""}`} /></Button>
              {manualOpen && <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"><Input aria-label="模型 ID" placeholder="模型 ID，例如 gpt-4.1" value={modelId} onChange={e => setModelId(e.target.value)} /><Input aria-label="模型显示名称" placeholder="显示名称（可选）" value={modelName} onChange={e => setModelName(e.target.value)} /><Button type="button" variant="secondary" onClick={addModel}><Plus />添加模型</Button></div>}
            </div>
          </section>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          {notice && <p role="status" className="text-sm text-muted-foreground">{notice}</p>}
        </div>
        <footer className="flex shrink-0 justify-end gap-2 border-t border-border px-5 py-4 sm:px-6"><Button type="button" variant="secondary" onClick={onClose}>取消</Button><Button type="submit">{initial?.endpoint ? "保存" : "添加提供商"}</Button></footer>
      </form>
    </DialogContent>
  </Dialog>;
}