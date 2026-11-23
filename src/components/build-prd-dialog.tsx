import { useMemo } from "react";
import { FileText } from "lucide-react";
import { marked } from "marked";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import prdMarkdown from "@/lib/build-prd.md?raw";

export function BuildPrdDialog() {
  const html = useMemo(() => marked.parse(prdMarkdown, { async: false }), []);
  return <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" size="sm" className="ml-auto gap-1.5 text-xs"><FileText className="size-3.5" aria-hidden="true" />产品需求文档</Button>
    </DialogTrigger>
    <DialogContent className="flex h-[85dvh] max-w-[860px] flex-col gap-0 overflow-hidden p-0" aria-describedby={undefined}>
      <DialogHeader className="shrink-0 border-b border-border/50 px-6 py-4">
        <DialogTitle className="flex items-center gap-2 text-sm font-medium">
          <FileText className="size-4 text-project-mint" aria-hidden="true" />产品需求文档
          <span className="text-xs font-normal text-muted-foreground">/build · v1.2</span>
        </DialogTitle>
      </DialogHeader>
      <article className="prd-doc min-h-0 flex-1 overflow-y-auto px-6 pb-16 pt-6 sm:px-8" dangerouslySetInnerHTML={{ __html: html }} />
    </DialogContent>
  </Dialog>;
}
