import { useState } from "react";
import { ArrowUpRight, Building2, CalendarDays, ChartLine, CircleHelp, File, FlaskConical, Globe, ListChecks, LockKeyhole, Minus, Monitor, Plus, RotateCw, ShieldCheck, Sparkles, Users, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { dailyCredits, personalPlans, teamCreditsPerSeat, teamPricePerSeat, teamTotals, type BillingPeriod } from "@/lib/subscription";

const fmt = (value: number) => value.toLocaleString("en-US");
const featureIcons = [RotateCw, Sparkles, Monitor, WalletCards, LockKeyhole, Globe, FlaskConical, ListChecks, CalendarDays];
const teamFeatures = [
  { icon: Sparkles, text: "共享团队池：每位成员每月 4,000 积分", help: true },
  { icon: File, text: "生产就绪的成果：研究、幻灯片、网站、图像、视频和图表" },
  { icon: Users, text: "在团队内部共享项目、技能和指令" },
  { icon: ChartLine, text: "带有使用追踪和访问控制的管理员仪表板" },
  { icon: LockKeyhole, text: "单点登录集成和细化的共享权限" },
  { icon: ShieldCheck, text: "审计日志及企业级合规性（SOC 2 第 II 类, ISO 27001）" },
];

export function SubscriptionDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [view, setView] = useState<"personal" | "team">("personal");
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const [teamPeriod, setTeamPeriod] = useState<BillingPeriod>("monthly");
  const [seats, setSeats] = useState(10);
  const [notice, setNotice] = useState("");
  const totals = teamTotals(seats, teamPeriod);
  const unavailable = () => setNotice("暂未接入订阅支付，不会扣款。套餐价格与权益为参考展示。");
  const info = (message: string) => setNotice(message);

  return <Dialog open={open} onOpenChange={next => { onOpenChange(next); if (!next) { setView("personal"); setNotice(""); } }}>
    <DialogContent className={`subscription-dialog block max-h-[94dvh] w-[calc(100%-24px)] overflow-y-auto rounded-2xl border-border bg-sidebar p-5 sm:p-6 ${view === "team" ? "max-w-[710px]" : "max-w-[900px]"}`}>
      <DialogTitle className={view === "personal" ? "pt-1 text-center font-brand text-[27px] font-normal leading-snug" : "pb-5 text-[26px] font-semibold"}>{view === "personal" ? "升级到 ArTrail Pro" : "团队"}</DialogTitle>
      <DialogDescription className="sr-only">选择个人套餐或团队订阅；当前仅展示参考套餐，未连接支付。</DialogDescription>
      {view === "personal" ? <>
        <div className="mx-auto mb-4 mt-4 flex w-fit rounded-md border border-border bg-surface-deep p-0.5">
          <Button variant="ghost" size="sm" aria-pressed={period === "monthly"} onClick={() => { setPeriod("monthly"); setNotice(""); }} className={`h-6 px-3 ${period === "monthly" ? "bg-accent" : "text-muted-foreground"}`}>月付</Button>
          <Button variant="ghost" size="sm" aria-pressed={period === "annual"} onClick={() => setPeriod("annual")} className={`h-6 px-3 ${period === "annual" ? "bg-accent" : "text-muted-foreground"}`}>年付 · 节省 17%</Button>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {personalPlans.map((plan, index) => {
            const features = [
              `${dailyCredits} 每日刷新积分`, `${fmt(plan.credits)} 月度积分`,
              ["日常任务的深度研究", "自定义用量的深度研究", "大规模任务的深度研究"][index],
              ["专业网站的标准输出", "应对变化需求的专业网站", "具备数据分析的专业网站"][index],
              ["常规内容的分析型幻灯片", "稳定创作的分析型幻灯片", "批量制作的分析型幻灯片"][index],
              ["任务扩展支持 Wide Research", "根据您选择计划的广泛研究", "持续高负荷的广泛研究"][index],
              "抢先体验 Beta 功能", "20 个并发任务", "20 个定时任务",
            ];
            return <article key={plan.price} className="min-h-[470px] rounded-xl border border-border bg-card px-3 py-4">
              <div className="h-16 px-1">{period === "monthly" ? <><span className="text-[28px] font-semibold leading-none">${plan.price}</span><span className="ml-1 text-xs text-muted-foreground">/ 月</span></> : <span className="text-xl font-semibold">年付价格待确认</span>}</div>
              <p className="mb-3 px-1 text-xs font-semibold">{plan.description}</p>
              <Button className="h-8 w-full rounded-full" onClick={unavailable}>升级</Button>
              {index > 0 && <select aria-label={`${plan.price} 美元套餐积分`} className="mt-2 h-8 w-full rounded-lg border border-input bg-card px-3 text-xs text-foreground"><option>{fmt(plan.credits)} 积分 / 每月</option></select>}
              <ul className="mt-5 space-y-3 px-0.5">
                {features.map((feature, n) => { const Icon = featureIcons[n]; return <li key={feature} className="flex items-center gap-2 text-xs leading-4">{Icon && <Icon className="size-3.5 shrink-0" />}<span>{feature}</span>{n < 2 && <CircleHelp className="size-3 shrink-0 text-muted-foreground" aria-label="积分说明" />}</li>; })}
              </ul>
            </article>;
          })}
        </div>
        <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-border bg-card px-2.5 py-2">
          <span className="grid size-8 shrink-0 place-items-center rounded-md bg-accent"><Building2 className="size-4" /></span>
          <div className="min-w-0 flex-1"><p className="font-brand text-xs font-semibold">ArTrail 团队与企业计划</p><p className="mt-0.5 text-[11px] text-muted-foreground">为任何规模的团队提供灵活计划——从初创公司到企业。</p></div>
          <Button variant="outline" size="sm" className="shrink-0 bg-card" onClick={() => { setView("team"); setNotice(""); }}>获取团队版</Button>
        </div>
        <div className="mt-1.5 flex items-center gap-2.5 rounded-xl border border-border bg-card px-2.5 py-2">
          <div className="flex shrink-0 gap-1"><span className="grid size-8 place-content-center rounded-md border border-border text-center text-[6px] leading-tight">AICPA<br />SOC 2<br />TYPE II</span><span className="grid size-8 place-content-center rounded-md border border-border text-center text-[6px] leading-tight">ISO<br />27001</span></div>
          <div className="flex-1"><p className="text-xs font-semibold">安全与合规</p><p className="mt-0.5 text-[11px] text-muted-foreground">企业级安全和行业标准认证。</p></div>
          <Button variant="outline" size="sm" className="shrink-0 bg-card" onClick={() => info("认证标识为参考图展示，ArTrail 的安全与合规信息尚未提供。")}>了解更多<ArrowUpRight /></Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground"><span>遇到问题了吗？ <Button variant="link" className="h-auto p-0 text-[11px] text-muted-foreground underline" onClick={() => info("帮助中心尚未接入，请在此说明您遇到的问题。")}>前往帮助中心</Button>。</span><Button variant="ghost" className="h-auto p-0 text-[11px]" onClick={() => info("账单管理尚未接入，当前没有可编辑的订阅账单。")}>编辑账单 <span aria-hidden>›</span></Button></div>
      </> : <>
        <div className="grid grid-cols-2 gap-4">
          {(["monthly", "annual"] as const).map(value => <Button key={value} variant="ghost" aria-pressed={teamPeriod === value} onClick={() => { setTeamPeriod(value); setNotice(""); }} className={`relative h-[160px] flex-col items-start justify-between overflow-hidden rounded-2xl border p-5 text-left ${teamPeriod === value ? "border-link bg-link/10 hover:bg-link/10" : "border-input bg-card hover:bg-accent"}`}>
            <span className={`grid size-6 place-items-center rounded-full border ${teamPeriod === value ? "border-link bg-link" : "border-muted-foreground/60"}`}>{teamPeriod === value && <span className="size-2.5 rounded-full bg-sidebar" />}</span>
            {value === "annual" && <span className="absolute right-0 top-0 rounded-bl-xl bg-link/10 px-3 py-1 text-sm text-link">节省 17%</span>}
            <span><span className="block text-[25px] font-semibold">US${teamPricePerSeat[value]}</span><span className="mt-2 block text-base text-muted-foreground">每席位 / {value === "monthly" ? "月" : "年"}</span></span>
          </Button>)}
        </div>
        <section className="mt-4 rounded-2xl border border-input bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3"><label htmlFor="team-seats" className="text-lg font-medium">团队总席位数</label><div className="flex items-center gap-1.5"><Button aria-label="减少席位" variant="outline" size="icon" className="size-11 rounded-xl bg-card" disabled={seats <= 1} onClick={() => setSeats(value => Math.max(1, value - 1))}><Minus /></Button><input id="team-seats" type="number" min={1} value={seats} onChange={event => setSeats(teamTotals(Number(event.target.value), teamPeriod).seats)} className="h-11 w-[112px] rounded-xl bg-accent text-center text-lg font-semibold outline-none focus-visible:ring-1 focus-visible:ring-link" /><Button aria-label="增加席位" variant="outline" size="icon" className="size-11 rounded-xl bg-card" onClick={() => setSeats(value => value + 1)}><Plus /></Button></div></div>
          <select aria-label="每席位积分" className="mt-3 h-[50px] w-full rounded-xl bg-accent px-4 text-lg"><option>{fmt(teamCreditsPerSeat)} 积分 / 席位 / 月</option></select>
          <div className="mt-5 flex items-center justify-between gap-3"><div><p className="text-lg">总积分</p><p className="text-base text-muted-foreground">由所有团队成员共享</p></div><p className="text-xl font-semibold" aria-label="团队总积分">{fmt(totals.credits)}<span className="ml-1 text-base font-normal text-muted-foreground">/ 月</span></p></div>
          <div className="mt-5 flex items-center justify-between border-t border-input pt-5"><span className="text-xl font-semibold">总价</span><p className="text-xl font-semibold" aria-label="团队总价">${fmt(totals.price)}<span className="ml-1 text-base font-normal text-muted-foreground">/ {teamPeriod === "monthly" ? "月" : "年"}</span></p></div>
        </section>
        <ul className="my-5 space-y-2">{teamFeatures.map(({ icon: Icon, text, help }) => <li key={text} className="flex items-start gap-2.5 text-base leading-6 text-sidebar-foreground"><Icon className="mt-0.5 size-5 shrink-0" /><span>{text}{help && <CircleHelp className="ml-2 inline size-4 text-muted-foreground" />}</span></li>)}</ul>
        <div className="flex flex-wrap justify-end gap-3"><Button variant="outline" className="h-11 rounded-xl bg-sidebar px-4 text-base" onClick={() => info("销售联系方式尚未提供，暂时无法联系销售团队。")}>联系我们的销售团队</Button><Button className="h-11 rounded-xl px-4 text-base" onClick={unavailable}>升级为团队版</Button></div>
        {teamPeriod === "annual" && <p className="mt-3 text-right text-xs text-muted-foreground">年付一次性收取全年费用，积分按月提供。</p>}
      </>}
      {notice && <p role="status" className="mt-3 rounded-lg border border-border bg-accent px-3 py-2 text-sm text-muted-foreground">{notice}</p>}
    </DialogContent>
  </Dialog>;
}