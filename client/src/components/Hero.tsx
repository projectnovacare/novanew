import { Wallet, Shield, ArrowRight, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/lib/wallet";
import { CONTRACT_ADDRESS, PACKAGES } from "@shared/schema";

export function Hero() {
  const { isConnected, connect, isConnecting } = useWallet();

  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl opacity-30" />
      
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-6">
            <Shield className="h-3.5 w-3.5" />
            <span>Verified Smart Contract on BSC</span>
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Earn Level Income
            </span>
            <br />
            <span className="text-foreground">with NovaCare</span>
          </h1>
          
          <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-lg mx-auto">
            Join the decentralized MLM platform. Earn up to 35% level income from your network across 16 levels.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            {!isConnected && (
              <Button
                size="lg"
                onClick={connect}
                disabled={isConnecting}
                className="bg-gradient-to-r from-primary to-accent text-white rounded-full px-8 shadow-lg shadow-primary/25"
                data-testid="button-hero-connect"
              >
                <Wallet className="mr-2 h-5 w-5" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
            <a
              href={`https://bscscan.com/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="rounded-full px-6" data-testid="button-view-contract">
                View Contract
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
            {PACKAGES.map((pkg) => (
              <div key={pkg.id} className="rounded-xl bg-card border border-border/50 p-4 text-center">
                <DollarSign className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ${pkg.amount}
                </p>
                <p className="text-xs text-muted-foreground">{pkg.name}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Contract Verified</span>
            </div>
            <span className="text-border">|</span>
            <span>16 Levels</span>
            <span className="text-border">|</span>
            <span>USDT Payments</span>
          </div>
        </div>
      </div>
    </section>
  );
}
