import { useState, useEffect } from "react";
import { 
  Users, 
  TrendingUp, 
  Copy, 
  Check, 
  ArrowUpRight,
  Layers,
  Clock,
  RefreshCw,
  DollarSign
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallet, shortenAddress } from "@/lib/wallet";
import { PACKAGES, LEVEL_PERCENTAGES, type Earning, type DashboardData } from "@shared/schema";
import { formatUSDT } from "@/lib/contract";

function StatCard({ icon: Icon, label, value, subValue }: { 
  icon: React.ElementType; 
  label: string; 
  value: string | number;
  subValue?: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-semibold tabular-nums" data-testid={`stat-${label.toLowerCase().replace(/\s/g, '-')}`}>{value}</p>
            {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
          </div>
          <div className="rounded-lg bg-primary/10 p-2">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ earning }: { earning: Earning }) {
  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() / 1000 - timestamp));
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-3">
        <div className="rounded-lg p-2 bg-green-500/10 text-green-600 dark:text-green-400">
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
        <div>
          <p className="text-sm font-medium">
            Level {earning.level} Income
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            From {shortenAddress(earning.fromUser)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-green-600 dark:text-green-400">
          +${formatUSDT(earning.amount)} USDT
        </p>
        <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
          <Clock className="h-3 w-3" />
          {timeAgo(earning.date)}
        </p>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-6xl px-4 space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-2 w-full" />
            </CardContent>
          </Card>
          <div className="space-y-4">
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        </div>
      </div>
    </section>
  );
}

export function Dashboard() {
  const { address } = useWallet();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [earnings, setEarnings] = useState<Earning[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // In production, this would call the contract
      // For now, show demo data
      setDashboardData({
        totalInvestment: "50000000000000000000",
        totalEarnings: "17500000000000000000",
        unclaimedEarnings: "0",
        directReferralsCount: 5,
        levelIncome: "17500000000000000000",
        isActive: true,
      });
      setEarnings([
        { id: 1, user: address || "", amount: "17500000000000000000", fromUser: "0xabcdef1234567890abcdef1234567890abcdef12", level: 1, date: Math.floor(Date.now() / 1000) - 3600, isClaimed: true },
        { id: 2, user: address || "", amount: "6000000000000000000", fromUser: "0x1234567890abcdef1234567890abcdef12345678", level: 2, date: Math.floor(Date.now() / 1000) - 7200, isClaimed: true },
      ]);
      setIsLoading(false);
    };
    loadData();
  }, [address]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const referralLink = `${window.location.origin}/?ref=${address}`;
  
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading || !dashboardData) {
    return <DashboardSkeleton />;
  }

  const totalEarningsUSD = formatUSDT(dashboardData.totalEarnings);
  const totalInvestmentUSD = formatUSDT(dashboardData.totalInvestment);

  return (
    <section className="py-8">
      <div className="mx-auto max-w-6xl px-4 space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            <CardHeader className="relative pb-2">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white font-bold text-lg shadow-lg shadow-primary/30">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Level Income</p>
                    <p className="text-xs text-muted-foreground">Your Earnings</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    data-testid="button-refresh"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </Button>
                  <Badge variant="secondary" className={`${dashboardData.isActive ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-600'}`}>
                    {dashboardData.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Level Income</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold tabular-nums bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" data-testid="text-total-income">
                    ${totalEarningsUSD}
                  </span>
                  <span className="text-lg text-muted-foreground">USDT</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Total Invested</p>
                  <p className="text-lg font-semibold">${totalInvestmentUSD}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Unclaimed</p>
                  <p className="text-lg font-semibold">${formatUSDT(dashboardData.unclaimedEarnings)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <StatCard 
              icon={Users} 
              label="Direct Referrals" 
              value={dashboardData.directReferralsCount}
              subValue="Active members"
            />
            <StatCard 
              icon={Layers} 
              label="Level Income" 
              value={`$${totalEarningsUSD}`}
              subValue="From 16 levels"
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Recent Earnings
                </h3>
                <Button variant="ghost" size="sm" className="text-xs" data-testid="button-view-all">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {earnings.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {earnings.slice(0, 5).map((earning) => (
                    <ActivityItem key={earning.id} earning={earning} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No earnings yet. Invite others to start earning!
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Referral Link
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Share your referral link to grow your network and earn level income from 16 levels.
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-lg bg-muted/50 px-3 py-2 text-sm font-mono text-muted-foreground truncate">
                  {referralLink}
                </div>
                <Button 
                  size="icon" 
                  variant="outline" 
                  onClick={copyReferralLink}
                  data-testid="button-copy-referral"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                {PACKAGES.map((pkg) => (
                  <Card key={pkg.id} className="bg-muted/30">
                    <CardContent className="p-3 text-center">
                      <p className="text-lg font-bold text-primary">${pkg.amount}</p>
                      <p className="text-xs text-muted-foreground">{pkg.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <h3 className="font-semibold">16 Level Income Structure</h3>
            <p className="text-sm text-muted-foreground">Earn from investments made by your network up to 16 levels deep</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {LEVEL_PERCENTAGES.map((percentage, index) => (
                <div 
                  key={index}
                  className="rounded-lg p-2 text-center border bg-muted/30 border-border"
                >
                  <div className="text-sm font-bold text-primary">
                    L{index + 1}
                  </div>
                  <div className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {percentage}%
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Total distribution: {LEVEL_PERCENTAGES.reduce((a, b) => a + b, 0)}% across all 16 levels
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
