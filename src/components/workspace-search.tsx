import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, Folder, Gamepad2, Home, LayoutGrid, Plus, Puzzle, Search, Settings, Clapperboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { projects, canvasNames } from "@/lib/project-catalog";
import { works } from "@/lib/works";

export function WorkspaceSearch({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [shortcut, setShortcut] = useState("Ctrl");
  useEffect(() => {
    setShortcut(/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl");
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(value => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const changeOpen = (value: boolean) => { setOpen(value); if (!value) setQuery(""); };
  const select = (action: () => void) => { changeOpen(false); action(); };
  const links = [
    { title: "首页", icon: Home, keywords: ["home", "创作"], action: () => void navigate({ to: "/" }) },
    { title: "构建网站、应用和游戏", icon: Plus, keywords: ["build", "新建项目"], action: () => void navigate({ to: "/build", search: { mode: "build" } }) },
    { title: "互动影游", icon: Clapperboard, keywords: ["story", "故事"], action: () => void navigate({ to: "/build", search: { mode: "story" } }) },
    { title: "游戏工作区", icon: Gamepad2, keywords: ["game", "设计", "代码", "试玩"], action: () => void navigate({ to: "/game", search: { tab: "canvas", prompt: "", project: "" } }) },
    { title: "插件", icon: Puzzle, keywords: ["plugins", "连接器"], action: () => void navigate({ to: "/plugins" }) },
    { title: "设置", icon: Settings, keywords: ["settings", "云电脑"], action: () => void navigate({ to: "/settings" }) },
  ];
  const rowClass = "group min-h-12 cursor-pointer gap-3 rounded-md px-3 py-2.5 text-[15px] [&_svg]:size-[18px]";
  return <>
    <Button variant="ghost" size={compact ? "icon" : "default"} aria-label="搜索" title={`搜索 (${shortcut}+K)`} onClick={() => changeOpen(true)} className={compact ? "size-9 text-muted-foreground" : "h-10 w-full justify-start gap-2.5 rounded-lg px-2.5 font-normal text-sidebar-foreground hover:bg-sidebar-accent"}>
      <Search className="size-[18px] shrink-0" />
      {!compact && <><span className="text-[15px]">搜索</span><span aria-hidden className="ml-auto flex gap-1 text-xs text-muted-foreground"><kbd className="rounded border border-sidebar-border px-1.5 py-0.5">{shortcut}</kbd><kbd className="rounded border border-sidebar-border px-1.5 py-0.5">K</kbd></span></>}
    </Button>
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogContent className="top-[12vh] w-[calc(100%-32px)] max-w-[680px] translate-y-0 gap-0 overflow-hidden rounded-lg border-border bg-popover p-0 shadow-lg [&>button]:top-5">
        <DialogTitle className="sr-only">搜索 ArTrail</DialogTitle>
        <DialogDescription className="sr-only">搜索创作入口、项目、画布和精选作品</DialogDescription>
        <Command className="rounded-none" loop>
          <CommandInput aria-label="搜索项目、画布和作品" placeholder="搜索项目、画布、作品或设置…" value={query} onValueChange={setQuery} className="h-16 pr-8 text-base" />
          <CommandList className="max-h-[min(60vh,560px)] px-2 pb-3 pt-2">
            <CommandEmpty><Search className="mx-auto mb-3 size-6 text-muted-foreground" /><p>未找到相关内容</p><p className="mt-1 text-xs text-muted-foreground">试试其他项目名称或关键词</p></CommandEmpty>
            <CommandGroup heading="前往">
              {links.map(item => <CommandItem key={item.title} value={item.title} keywords={item.keywords} className={rowClass} onSelect={() => select(item.action)}><item.icon className="text-muted-foreground" /><span className="min-w-0 flex-1 truncate">{item.title}</span><ArrowUpRight className="text-muted-foreground opacity-0 group-data-[selected=true]:opacity-100" /></CommandItem>)}
            </CommandGroup>
            <CommandGroup heading="项目">
              {Object.entries(projects).map(([id, name]) => <CommandItem key={id} value={`项目 ${name}`} className={rowClass} onSelect={() => select(() => void navigate({ to: "/projects/$projectId", params: { projectId: id }, search: { q: "" } }))}><Folder className="text-muted-foreground" /><span className="flex-1 truncate">{name}</span><span className="text-xs text-muted-foreground">项目</span></CommandItem>)}
            </CommandGroup>
            {query.trim() && <CommandGroup heading="画布">
              {Object.entries(projects).flatMap(([id, name]) => canvasNames.map(title => <CommandItem key={`${id}-${title}`} value={`画布 ${name} ${title}`} className={rowClass} onSelect={() => select(() => void navigate({ to: "/projects/$projectId", params: { projectId: id }, search: { q: title } }))}><LayoutGrid className="text-muted-foreground" /><span className="min-w-0 flex-1 truncate">{title}</span><span className="shrink-0 text-xs text-muted-foreground">{name}</span></CommandItem>))}
            </CommandGroup>}
            <CommandGroup heading="精选作品">
              {works.map(work => <CommandItem key={work.id} value={work.title} keywords={[work.author, ...work.tags]} className={rowClass} onSelect={() => select(() => void navigate({ to: "/works/$workId", params: { workId: work.id } }))}><img src={work.images[0]} alt="" className="size-8 shrink-0 rounded object-cover" /><span className="min-w-0 flex-1 truncate">{work.title}</span><span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">{work.author}</span></CommandItem>)}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  </>;
}