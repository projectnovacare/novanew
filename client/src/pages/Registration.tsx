import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { UserPlus, Wallet, ArrowRight, CheckCircle, Mail, Phone, User, Users, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWallet, shortenAddress } from "@/lib/wallet";
import { registerUser, approveUSDT, invest, getUserCount, getUserProfile, isValidAddress } from "@/lib/contract";
import { PACKAGES } from "@shared/schema";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

export default function Registration() {
  const { address, referralCode, setIsRegistered } = useWallet();
  const [, setLocation] = useLocation();
  const [isRegistering, setIsRegistering] = useState(false);
  const [step, setStep] = useState<"form" | "package">("form");
  const [selectedPackage, setSelectedPackage] = useState(1);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    referralAddress: referralCode || "",
  });

  const [referralStatus, setReferralStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle");
  const [referralName, setReferralName] = useState("");
  const [userCount, setUserCount] = useState<number | null>(null);
  const [isFirstUser, setIsFirstUser] = useState(false);

  // Check user count on mount
  useEffect(() => {
    const checkUserCount = async () => {
      const count = await getUserCount();
      setUserCount(count);
      if (count === 0) {
        setIsFirstUser(true);
      }
    };
    checkUserCount();
  }, []);

  // Pre-fill referral from URL
  useEffect(() => {
    if (referralCode && referralCode !== formData.referralAddress) {
      setFormData(prev => ({ ...prev, referralAddress: referralCode }));
      validateReferral(referralCode);
    }
  }, [referralCode]);

  const validateReferral = async (address: string) => {
    if (!address || address.trim() === "") {
      setReferralStatus("idle");
      setReferralName("");
      return;
    }

    if (!isValidAddress(address)) {
      setReferralStatus("invalid");
      setReferralName("");
      return;
    }

    setReferralStatus("checking");
    try {
      const profile = await getUserProfile(address);
      if (profile && profile.isRegistered) {
        setReferralStatus("valid");
        setReferralName(profile.name || "User");
      } else {
        setReferralStatus("invalid");
        setReferralName("");
      }
    } catch {
      setReferralStatus("invalid");
      setReferralName("");
    }
  };

  const handleReferralChange = (value: string) => {
    setFormData({ ...formData, referralAddress: value });
    if (value.length === 42) {
      validateReferral(value);
    } else {
      setReferralStatus("idle");
      setReferralName("");
    }
  };

  const handleFirstUserClick = () => {
    setIsFirstUser(true);
    setFormData({ ...formData, referralAddress: "" });
    setReferralStatus("idle");
    setReferralName("");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    
    // Check referral requirement (unless first user)
    if (!isFirstUser && userCount !== 0 && referralStatus !== "valid") {
      toast({ title: "Please enter a valid referral address", variant: "destructive" });
      return;
    }
    
    setStep("package");
  };

  const handleRegister = async () => {
    if (!address) return;

    setIsRegistering(true);
    try {
      const upline = isFirstUser ? "0x0000000000000000000000000000000000000000" : formData.referralAddress;
      
      toast({ title: "Step 1/3: Registering..." });
      await registerUser(upline, formData.name, formData.email, formData.phone, address);

      const pkg = PACKAGES.find(p => p.id === selectedPackage)!;
      
      toast({ title: "Step 2/3: Approving USDT..." });
      await approveUSDT(pkg.amountWei, address);

      toast({ title: "Step 3/3: Investing..." });
      await invest(selectedPackage, address);

      localStorage.setItem(`novacare_registered_${address}`, "true");
      setIsRegistered(true);
      toast({ title: "Registration successful!", variant: "default" });
      setLocation("/");
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Registration failed:", err);
      toast({ title: "Transaction failed", description: err.message, variant: "destructive" });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-12">
        <Card className="border-border/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="font-display text-2xl">Join NovaCare</CardTitle>
            <CardDescription>
              {step === "form" ? "Complete your profile to get started" : "Select your investment package"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Your Wallet</span>
              </div>
              <span className="font-mono text-sm font-medium" data-testid="text-registration-wallet">
                {address ? shortenAddress(address) : "Not connected"}
              </span>
            </div>

            {step === "form" ? (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Referral Address Field */}
                <div className="space-y-2">
                  <Label htmlFor="referral">Referral Address {!isFirstUser && userCount !== 0 && "*"}</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="referral"
                      placeholder="0x..."
                      value={formData.referralAddress}
                      onChange={(e) => handleReferralChange(e.target.value)}
                      className={`pl-10 pr-10 font-mono text-sm ${
                        referralStatus === "valid" ? "border-green-500 bg-green-500/5" :
                        referralStatus === "invalid" ? "border-red-500 bg-red-500/5" : ""
                      }`}
                      disabled={isFirstUser}
                      data-testid="input-referral"
                    />
                    {referralStatus === "checking" && (
                      <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                    )}
                    {referralStatus === "valid" && (
                      <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                    )}
                    {referralStatus === "invalid" && (
                      <XCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                    )}
                  </div>
                  
                  {/* Show referral name when valid */}
                  {referralStatus === "valid" && referralName && (
                    <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600 dark:text-green-400">
                        Sponsor: <strong>{referralName}</strong>
                      </span>
                    </div>
                  )}
                  
                  {referralStatus === "invalid" && (
                    <p className="text-xs text-red-500">This address is not registered in NovaCare</p>
                  )}
                  
                  {/* First user button */}
                  {userCount === 0 && !isFirstUser && (
                    <button
                      type="button"
                      onClick={handleFirstUserClick}
                      className="w-full rounded-lg border border-dashed border-primary/50 bg-primary/5 p-3 text-sm text-primary hover:bg-primary/10 transition-colors"
                      data-testid="button-first-user"
                    >
                      <Users className="inline h-4 w-4 mr-2" />
                      No referrals? Click here if you're the first user
                    </button>
                  )}
                  
                  {isFirstUser && (
                    <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm text-primary">Registering as the first user (no referral needed)</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10"
                      required
                      data-testid="input-name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      required
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10"
                      data-testid="input-phone"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" data-testid="button-next">
                  Next: Select Package
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                {/* Show selected referral */}
                {formData.referralAddress && referralStatus === "valid" && (
                  <div className="flex items-center justify-between rounded-lg bg-green-500/10 p-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600 dark:text-green-400">Sponsor: {referralName}</span>
                    </div>
                    <span className="font-mono text-xs text-green-600 dark:text-green-400">
                      {shortenAddress(formData.referralAddress)}
                    </span>
                  </div>
                )}
                
                {isFirstUser && (
                  <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm text-primary">First user registration</span>
                  </div>
                )}

                <div className="grid gap-3">
                  {PACKAGES.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`w-full rounded-lg border p-4 text-left transition-all ${
                        selectedPackage === pkg.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                      data-testid={`button-package-${pkg.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-display font-semibold">{pkg.name}</h3>
                          <p className="text-sm text-muted-foreground">Package {pkg.id}</p>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          ${pkg.amount} USDT
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep("form")} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={handleRegister}
                    disabled={isRegistering || !address}
                    className="flex-1 bg-gradient-to-r from-primary to-accent text-white"
                    data-testid="button-register"
                  >
                    {isRegistering ? "Processing..." : "Register & Invest"}
                  </Button>
                </div>
              </div>
            )}

            <p className="text-center text-xs text-muted-foreground">
              By registering, you agree to interact with the smart contract on Binance Smart Chain using USDT.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
