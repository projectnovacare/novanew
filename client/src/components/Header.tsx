import { Moon, Sun, Wallet, LogOut, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { useWallet, shortenAddress } from "@/lib/wallet";
import { CONTRACT_ADDRESS } from "@shared/schema";
import logoImage from "@assets/generated_images/novacare_hexagonal_n_logo.png";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { address, isConnecting, isConnected, connect, disconnect } = useWallet();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-2">
          <img src={logoImage} alt="NovaCare" className="h-8 w-8" />
          <span className="font-display text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            NovaCare
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://bscscan.com/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            data-testid="link-contract"
          >
            <span className="font-mono">{CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}</span>
            <ExternalLink className="h-3 w-3" />
          </a>

          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {isConnected ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-mono text-xs" data-testid="text-wallet-address">
                  {shortenAddress(address!)}
                </span>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={disconnect}
                data-testid="button-disconnect"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={connect}
              disabled={isConnecting}
              className="bg-gradient-to-r from-primary to-accent text-white rounded-full px-4"
              data-testid="button-connect-wallet"
            >
              <Wallet className="mr-2 h-4 w-4" />
              {isConnecting ? "Connecting..." : "Connect"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
