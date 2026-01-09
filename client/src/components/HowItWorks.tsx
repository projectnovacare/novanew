import { Wallet, UserPlus, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: Wallet,
    title: "Connect Wallet",
    description: "Connect your MetaMask or any Web3 wallet to get started",
  },
  {
    icon: UserPlus,
    title: "Join Network",
    description: "Register with the smart contract and activate your first level",
  },
  {
    icon: TrendingUp,
    title: "Earn Level Income",
    description: "Receive income from your network across all active levels",
  },
];

export function HowItWorks() {
  return (
    <section className="py-12 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">How It Works</h2>
          <p className="text-muted-foreground">Get started in three simple steps</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={index} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white font-bold shadow-lg shadow-primary/20">
                    {index + 1}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                      <step.icon className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
