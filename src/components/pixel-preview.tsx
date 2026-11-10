import { useEffect, useRef } from "react";
export function PixelPreview({ src, resolution, label }: { src: string; resolution: number; label: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      const canvas = ref.current;
      if (!canvas) return;
      canvas.width = resolution; canvas.height = resolution;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.imageSmoothingEnabled = false;
      context.drawImage(image, 0, 0, resolution, resolution);
    };
    image.src = src;
    return () => { image.onload = null; };
  }, [src, resolution]);
  return <canvas ref={ref} role="img" aria-label={label} className="aspect-square w-full rounded-md bg-secondary [image-rendering:pixelated]" />;
}