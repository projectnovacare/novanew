import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  referralCode: string | null;
  isRegistered: boolean;
  setIsRegistered: (value: boolean) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const WALLET_STORAGE_KEY = "novacare_wallet_address";

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

function getReferralFromURL(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("ref") || params.get("referral") || null;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const ref = getReferralFromURL();
    if (ref) {
      setReferralCode(ref);
      localStorage.setItem("novacare_referral", ref);
    } else {
      const savedRef = localStorage.getItem("novacare_referral");
      if (savedRef) setReferralCode(savedRef);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(WALLET_STORAGE_KEY);
    if (saved) {
      setAddress(saved);
    }
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: unknown) => {
      const accs = accounts as string[];
      if (accs.length === 0) {
        setAddress(null);
        localStorage.removeItem(WALLET_STORAGE_KEY);
      } else {
        setAddress(accs[0]);
        localStorage.setItem(WALLET_STORAGE_KEY, accs[0]);
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      }) as string[];
      
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        localStorage.setItem(WALLET_STORAGE_KEY, accounts[0]);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setIsRegistered(false);
    localStorage.removeItem(WALLET_STORAGE_KEY);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        isConnecting,
        connect,
        disconnect,
        referralCode,
        isRegistered,
        setIsRegistered,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
