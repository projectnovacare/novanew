import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Dashboard } from "@/components/Dashboard";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { useWallet } from "@/lib/wallet";

export default function Home() {
  const { isConnected } = useWallet();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {!isConnected && <Hero />}
        {isConnected && <Dashboard />}
        {!isConnected && <HowItWorks />}
      </main>
      <Footer />
    </div>
  );
}
