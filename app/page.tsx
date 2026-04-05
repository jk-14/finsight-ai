import Link from "next/link";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import {
  Sparkles,
  BarChart3,
  PieChart,
  ShieldCheck,
  Zap,
  ArrowRight,
  GitBranch,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FEATURES = [
  {
    icon: TrendingUp,
    title: "Live Stock Quotes",
    description:
      "Real-time prices via Finnhub (60 req/min free tier) with Redis caching — fast responses and no daily quota concerns.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    description:
      "Claude analyzes your holdings and delivers a concise 3-paragraph portfolio assessment on demand.",
  },
  {
    icon: BarChart3,
    title: "P&L Tracking",
    description:
      "Instant unrealized gain/loss per position and across your entire portfolio, updated every 60 seconds.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Multi-Tenancy",
    description:
      "Stateless JWT auth — every request is verified, every portfolio is user-scoped. No session state.",
  },
  {
    icon: Zap,
    title: "Serverless-Ready",
    description:
      "Deployed on Vercel with Neon Postgres and Upstash Redis. Zero cold-start penalty on data reads.",
  },
  {
    icon: PieChart,
    title: "Interactive Charts",
    description:
      "Allocation pie chart and 30-day area performance chart built with Recharts — fully responsive.",
  },
];

const STACK = [
  {
    label: "Next.js 16",
    note: "App Router + API routes",
    logo: "/logos/nextjs.svg",
    href: "https://nextjs.org",
  },
  {
    label: "Neon Postgres",
    note: "Serverless Postgres with Vercel-native integration",
    logo: "/logos/neon.svg",
    href: "https://neon.tech",
  },
  {
    label: "Drizzle ORM",
    note: "Type-safe, lightweight ORM for serverless",
    logo: "/logos/drizzle.svg",
    href: "https://orm.drizzle.team",
  },
  {
    label: "Upstash Redis",
    note: "Fresh + stale quote cache",
    logo: "/logos/upstash.svg",
    href: "https://upstash.com",
  },
  {
    label: "Finnhub API",
    note: "Real-time stock quotes with Redis caching",
    logo: "/logos/finnhub.svg",
    href: "https://finnhub.io",
  },
  {
    label: "React Query",
    note: "Auto-refreshing server state with smart caching",
    logo: "/logos/tanstack.svg",
    href: "https://tanstack.com/query",
  },
  {
    label: "Claude API",
    note: "AI-generated portfolio insights on demand",
    logo: "/logos/anthropic.svg",
    href: "https://anthropic.com",
  },
  {
    label: "shadcn/ui",
    note: "Beautiful, customizable UI components",
    logo: "/logos/shadcn.svg",
    href: "https://ui.shadcn.com",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="border-b border-border sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-base">
            <img
              src="/icons/finsight-mark-24.svg"
              alt="FinSight AI"
              width={24}
              height={24}
            />
            FinSight AI
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              render={<Link href="/login" />}
              nativeButton={false}
            >
              Sign in
            </Button>
            <Button size="sm" render={<Link href="/register" />} nativeButton={false}>
              Get started
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
          {/* <Badge variant="secondary" className="mb-6 text-xs font-medium">
            Portfolio project · Senior Full Stack
          </Badge> */}
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Your portfolio dashboard,{" "}
            <span className="bg-gradient-to-r from-primary to-blue-300 bg-clip-text text-transparent">
              powered by AI
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Track stock holdings with live quotes, visualize allocation, and get
            Claude&apos;s AI commentary on your portfolio health — all in one minimal,
            fast dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              render={<Link href="/login" />}
              nativeButton={false}
              className="gap-2"
            >
              Try the demo <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={
                <a
                  href="https://github.com/jk-14/finsight-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              nativeButton={false}
              className="gap-2"
            >
              <GitBranch className="h-4 w-4" /> View source
            </Button>
          </div>

          {/* Demo credentials callout */}
          <div className="mt-8 inline-flex items-center gap-3 bg-muted/50 border border-border rounded-lg px-5 py-3 text-sm">
            <span className="text-muted-foreground">Demo login:</span>
            <code className="font-mono text-foreground">demo@finsight.ai</code>
            <span className="text-muted-foreground">/</span>
            <code className="font-mono text-foreground">Demo1234!</code>
          </div>

          {/* Dashboard preview */}
          <div className="mt-14 px-2">
            <DashboardPreview />
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border bg-card/30">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <h2 className="text-2xl font-bold text-center mb-2">What&apos;s inside</h2>
            <p className="text-muted-foreground text-center mb-12 text-sm">
              Every feature is a deliberate architectural decision.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <Card
                  key={title}
                  className="bg-card hover:ring-primary/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-200"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <CardTitle className="text-sm font-semibold">{title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Tech stack */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-bold text-center mb-2">Tech stack</h2>
          <p className="text-muted-foreground text-center mb-12 text-sm">
            Chosen for production-relevance, not just familiarity.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STACK.map(({ label, note, logo, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-border rounded-lg p-4 bg-card hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <img
                    src={logo}
                    alt={label}
                    className="w-6 h-6 object-contain shrink-0"
                  />
                  <p className="font-semibold text-sm leading-tight">{label}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{note}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Architecture at a glance */}
        <section className="border-t border-border bg-card/30">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <h2 className="text-2xl font-bold text-center mb-2">
              Architecture at a glance
            </h2>
            <p className="text-muted-foreground text-center mb-12 text-sm">
              Every decision has a reason.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Redis quote cache",
                  detail:
                    "Stock prices are cached in Upstash Redis with a 60 s TTL. Finnhub is only hit on a cold read — keeping latency low and free-tier quota headroom high.",
                },
                {
                  title: "Stateless JWT auth",
                  detail:
                    "Sessions live entirely in a signed JWT (jose). No session table, no sticky sessions — any Vercel edge node can verify a request independently.",
                },
                {
                  title: "AI insights in DB",
                  detail:
                    "Claude-generated commentary is persisted in Postgres rather than re-generated on every load. Regeneration is an explicit user action — balancing freshness and API cost.",
                },
                {
                  title: "React Query for freshness",
                  detail:
                    "Quotes refetch every 60 s via React Query's refetchInterval. The stale-while-revalidate pattern keeps the UI responsive while background fetches run.",
                },
              ].map(({ title, detail }) => (
                <div
                  key={title}
                  className="border border-border rounded-lg p-5 bg-background hover:border-primary/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-200"
                >
                  <p className="font-semibold text-sm mb-2">{title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {detail}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA row */}
            <div className="mt-14 text-center">
              <h3 className="text-xl font-bold mb-3">See it in action</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                A pre-seeded demo portfolio with AAPL, MSFT, NVDA and TSLA is ready to
                explore — live quotes and AI insights included.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  render={<Link href="/login" />}
                  nativeButton={false}
                  className="gap-2"
                >
                  Open demo dashboard <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  render={
                    <a
                      href="https://github.com/jk-14/finsight-ai"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  nativeButton={false}
                  className="gap-2"
                >
                  <GitBranch className="h-4 w-4" /> View source
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <img
              src="/icons/finsight-mark-16.svg"
              alt="FinSight AI"
              width={16}
              height={16}
            />
            FinSight AI — portfolio project by Jatin
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/jk-14/finsight-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <Link href="/login" className="hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link href="/register" className="hover:text-foreground transition-colors">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
