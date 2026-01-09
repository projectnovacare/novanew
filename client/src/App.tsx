import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme";
import { WalletProvider, useWallet } from "@/lib/wallet";
import Home from "@/pages/Home";
import Registration from "@/pages/Registration";
import NotFound from "@/pages/not-found";

function AppRoutes() {
  const { isConnected, isRegistered, setIsRegistered, address } = useWallet();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isConnected) return;

    const checkRegistration = async () => {
      const registered = localStorage.getItem(`novacare_registered_${address}`);
      if (registered === "true") {
        setIsRegistered(true);
      }
    };

    checkRegistration();
  }, [isConnected, address, setIsRegistered]);

  useEffect(() => {
    if (isConnected && !isRegistered && location === "/") {
      setLocation("/register");
    }
    if (isConnected && isRegistered && location === "/register") {
      setLocation("/");
    }
  }, [isConnected, isRegistered, location, setLocation]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/register" component={Registration} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <WalletProvider>
        <TooltipProvider>
          <Toaster />
          <AppRoutes />
        </TooltipProvider>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;
