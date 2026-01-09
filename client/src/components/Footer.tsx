import { ExternalLink } from "lucide-react";
import { CONTRACT_ADDRESS } from "@shared/schema";
import logoImage from "@assets/generated_images/novacare_hexagonal_n_logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/20 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="NovaCare" className="h-6 w-6" />
            <span className="font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              NovaCare
            </span>
            <span className="text-sm text-muted-foreground">
              Decentralized Level Income
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a
              href={`https://bscscan.com/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
              data-testid="link-footer-contract"
            >
              <span className="font-mono text-xs">{CONTRACT_ADDRESS.slice(0, 10)}...</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border/40 text-center text-xs text-muted-foreground">
          <p>Smart contract verified on BSCScan. Always verify contract addresses before interacting.</p>
        </div>
      </div>
    </footer>
  );
}
