import { useState } from "react";
import { Gamepad2, Pencil, Users, Cloud, HardDrive, ChevronDown, UserSquare2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const tabs = ["常规", "AI", "密钥", "Stripe", "通知"];
const access = ["任何拥有链接的人", "仅限我", "仅限团队成员"];

export function GameSettings({ initialName }: { initialName: string }) {
  const [tab, setTab] = useState("常规");
  const [name, setName] = useState(initialName);
  const [editing, setEditing] = useState(false);
  const [who, setWho] = useState(access[0]!);
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const card = "rounded-2xl border border-border bg-card/60 p-5";
  return <div className="flex-1 overflow-y-auto px-4 pb-10 sm:px-6">
    <nav className="sticky top-0 z-10 flex gap-7 border-b border-border bg-background pt-4">{tabs.map(t => <button key={t} onClick={() => setTab(t)} className={`-mb-px border-b-2 pb-3 text-base font-semibold transition-colors ${tab === t ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{t}</button>)}</nav>
    {tab !== "常规" ? <p className="py-24 text-center text-sm text-muted-foreground">{tab} 设置尚未开放（示例）。</p> : <div className="mx-auto max-w-[960px]">
      <div className="flex items-center gap-3 py-8">
        <Gamepad2 className="size-10" />
        {editing ? <Input autoFocus aria-label="游戏名称" value={name} onChange={e => setName(e.target.value)} onBlur={() => setEditing(false)} onKeyDown={e => e.key === "Enter" && setEditing(false)} className="h-10 max-w-sm text-lg font-semibold" />
          : <><h2 className="text-xl font-semibold">{name || "未命名游戏"}</h2><button aria-label="编辑游戏名称" onClick={() => setEditing(true)} className="text-muted-foreground hover:text-foreground"><Pencil className="size-4" /></button></>}
      </div>
      <section className={card}>
        <div className="flex items-start justify-between gap-4"><h3 className="text-base font-semibold">启用更多功能</h3><Button size="sm" onClick={() => setNotice("示例：尚未接入云端功能。")}>启用更多功能</Button></div>
        <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
          <li className="flex items-center gap-2.5"><Users className="size-4" />通过玩家账号跨设备保存个人资料</li>
          <li className="flex items-center gap-2.5"><Cloud className="size-4" />通过云存档和排行榜保存进度、记录高分</li>
          <li className="flex items-center gap-2.5"><HardDrive className="size-4" />通过文件存储保存头像和玩家创作的内容</li>
        </ul>
      </section>
      <section className={`${card} mt-4`}>
        <h3 className="border-b border-border pb-4 text-base font-semibold">发布与访问</h3>
        <div className="flex items-center justify-between py-5"><span className="text-sm text-muted-foreground">常规访问权限</span>
          <Popover open={open} onOpenChange={setOpen}><PopoverTrigger asChild><button className="flex items-center gap-2 text-sm">{who}<ChevronDown className="size-4 text-muted-foreground" /></button></PopoverTrigger>
            <PopoverContent align="end" className="w-52 p-1">{access.map(a => <button key={a} onClick={() => { setWho(a); setOpen(false); }} className="flex h-9 w-full items-center justify-between rounded-md px-3 text-sm hover:bg-accent">{a}{a === who && <Check className="size-4" />}</button>)}</PopoverContent>
          </Popover>
        </div>
        <div className="rounded-xl bg-secondary/60 p-4">
          <div className="flex flex-wrap items-center gap-4"><span className="grid size-12 place-items-center rounded-lg bg-secondary"><UserSquare2 className="size-6 text-muted-foreground" /></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">玩家登录</p><p className="text-sm text-muted-foreground">让玩家登录账号，在不同设备间保存个人资料、游戏进度和记录。</p></div><Button size="sm" onClick={() => setNotice("示例：在对话中继续设置，为游戏接入登录功能。")}>添加玩家登录功能</Button></div>
          <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">在对话中继续设置，为游戏接入登录功能。</p>
        </div>
        <div className="flex items-center justify-between py-5"><span className="flex items-center gap-2 text-sm"><span className="size-1.5 rounded-full bg-muted-foreground" />未发布</span><Button size="sm" variant="secondary" disabled>发布</Button></div>
        <p className="text-sm text-muted-foreground">域名</p>
        <p className="mt-3 text-sm text-muted-foreground">发布游戏后，即可管理域名和分享图片。</p>
      </section>
      <section className={`${card} mt-4`}>
        <h3 className="border-b border-border pb-4 text-base font-semibold">在多个任务中编辑</h3>
        <div className="flex items-center justify-between pt-4"><span className="text-sm">开启新任务，并行编辑此游戏</span><Button size="sm" variant="outline" onClick={() => setNotice("示例：新任务功能尚未接入。")}>在新任务中编辑</Button></div>
      </section>
      <section className={`${card} mt-4`}>
        <h3 className="border-b border-border pb-4 text-base font-semibold">高级</h3>
        <div className="flex items-center justify-between pt-4"><span className="text-sm text-muted-foreground">删除此游戏及其所有资产</span><Button size="sm" variant="outline" className="text-destructive" onClick={() => setNotice("示例：删除功能未启用。")}>删除游戏</Button></div>
      </section>
      {notice && <p role="status" className="mt-4 text-center text-sm text-muted-foreground">{notice}</p>}
    </div>}
  </div>;
}
