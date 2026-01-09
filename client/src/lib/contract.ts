import { CONTRACT_ADDRESS, USDT_ADDRESS } from "@shared/schema";

const CONTRACT_ABI = [
  "function registerUser(address _upline, string _name, string _email, string _phone)",
  "function invest(uint256 _packageId)",
  "function isUserRegistered(address _user) view returns (bool)",
  "function getUser(address _user) view returns (tuple(address walletAddress, address upline, uint256 totalInvestment, uint256 directReferralsCount, uint256 registrationDate, bool isActive, tuple(string name, string email, string phone) profile))",
  "function getUserProfile(address _user) view returns (string name, string email, string phone, address upline, uint256 totalInvestment, uint256 directReferralsCount, uint256 registrationDate, bool isActive)",
  "function getDashboardData(address _user) view returns (uint256 totalInvestment, uint256 totalEarnings, uint256 unclaimedEarnings, uint256 directReferralsCount, uint256 levelIncome, bool isActive)",
  "function getUserEarnings(address _user) view returns (tuple(uint256 id, address user, uint256 amount, address fromUser, uint256 level, uint256 date, bool isClaimed)[])",
  "function getDirectReferralsWithDetails(address _user) view returns (tuple(address referralAddress, string name, uint256 registrationDate, uint256 totalInvestment, bool isActive)[])",
  "function getAllPackages() view returns (tuple(uint256 id, string name, uint256 amount)[3])",
];

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
];

function encodeCall(signature: string, params: string[]): string {
  const funcSig = signature.split("(")[0];
  const funcHash = keccak256(signature).slice(0, 10);
  
  let encoded = funcHash;
  params.forEach(param => {
    if (param.startsWith("0x")) {
      encoded += param.slice(2).padStart(64, "0");
    } else {
      const hex = Buffer.from(param).toString("hex");
      const len = (hex.length / 2).toString(16).padStart(64, "0");
      const paddedHex = hex.padEnd(Math.ceil(hex.length / 64) * 64, "0");
      encoded += len + paddedHex;
    }
  });
  
  return encoded;
}

function keccak256(str: string): string {
  const funcMap: Record<string, string> = {
    "isUserRegistered(address)": "0x59c36d58",
    "registerUser(address,string,string,string)": "0x8a4068dd",
    "invest(uint256)": "0xe8b5e51f",
    "approve(address,uint256)": "0x095ea7b3",
    "allowance(address,address)": "0xdd62ed3e",
    "balanceOf(address)": "0x70a08231",
    "getDashboardData(address)": "0x5a9b0b89",
    "getUserEarnings(address)": "0x2d9a37d2",
    "getDirectReferralsWithDetails(address)": "0x7a3226ec",
    "getUserProfile(address)": "0x2f30cabd",
  };
  return funcMap[str] || "0x00000000";
}

export async function isUserRegistered(address: string): Promise<boolean> {
  if (!window.ethereum) return false;
  
  try {
    const data = "0x59c36d58" + address.slice(2).toLowerCase().padStart(64, "0");
    const result = await window.ethereum.request({
      method: "eth_call",
      params: [{ to: CONTRACT_ADDRESS, data }, "latest"],
    }) as string;
    
    return result !== "0x0000000000000000000000000000000000000000000000000000000000000000";
  } catch (error) {
    console.error("Error checking registration:", error);
    return false;
  }
}

export async function registerUser(
  upline: string,
  name: string,
  email: string,
  phone: string,
  from: string
): Promise<string> {
  if (!window.ethereum) throw new Error("No wallet connected");

  const uplineParam = (upline || "0x0000000000000000000000000000000000000000").slice(2).padStart(64, "0");
  const offset1 = "0000000000000000000000000000000000000000000000000000000000000080";
  const offset2 = (128 + Math.ceil(name.length / 32) * 32).toString(16).padStart(64, "0");
  const offset3 = (128 + Math.ceil(name.length / 32) * 32 + 32 + Math.ceil(email.length / 32) * 32).toString(16).padStart(64, "0");

  const encodeString = (str: string) => {
    const len = str.length.toString(16).padStart(64, "0");
    const hex = Buffer.from(str).toString("hex").padEnd(Math.ceil(str.length / 32) * 64, "0");
    return len + hex;
  };

  const data = "0x8a4068dd" + 
    uplineParam +
    offset1 +
    offset2 +
    offset3 +
    encodeString(name) +
    encodeString(email) +
    encodeString(phone);

  const txHash = await window.ethereum.request({
    method: "eth_sendTransaction",
    params: [{
      from,
      to: CONTRACT_ADDRESS,
      data,
      gas: "0x50000",
    }],
  }) as string;

  return txHash;
}

export async function approveUSDT(amount: string, from: string): Promise<string> {
  if (!window.ethereum) throw new Error("No wallet connected");

  const spender = CONTRACT_ADDRESS.slice(2).padStart(64, "0");
  const amountHex = BigInt(amount).toString(16).padStart(64, "0");
  const data = "0x095ea7b3" + spender + amountHex;

  const txHash = await window.ethereum.request({
    method: "eth_sendTransaction",
    params: [{
      from,
      to: USDT_ADDRESS,
      data,
      gas: "0x20000",
    }],
  }) as string;

  return txHash;
}

export async function invest(packageId: number, from: string): Promise<string> {
  if (!window.ethereum) throw new Error("No wallet connected");

  const packageIdHex = packageId.toString(16).padStart(64, "0");
  const data = "0xe8b5e51f" + packageIdHex;

  const txHash = await window.ethereum.request({
    method: "eth_sendTransaction",
    params: [{
      from,
      to: CONTRACT_ADDRESS,
      data,
      gas: "0x100000",
    }],
  }) as string;

  return txHash;
}

export async function getUSDTBalance(address: string): Promise<string> {
  if (!window.ethereum) return "0";

  try {
    const data = "0x70a08231" + address.slice(2).toLowerCase().padStart(64, "0");
    const result = await window.ethereum.request({
      method: "eth_call",
      params: [{ to: USDT_ADDRESS, data }, "latest"],
    }) as string;

    return (BigInt(result) / BigInt(10 ** 18)).toString();
  } catch {
    return "0";
  }
}

export function formatUSDT(weiAmount: string): string {
  const amount = BigInt(weiAmount) / BigInt(10 ** 18);
  return amount.toString();
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export async function getUserCount(): Promise<number> {
  if (!window.ethereum) return 0;

  try {
    // Call userCount() function - selector 0x07973ccf
    const data = "0x07973ccf";
    const result = await window.ethereum.request({
      method: "eth_call",
      params: [{ to: CONTRACT_ADDRESS, data }, "latest"],
    }) as string;

    return parseInt(result, 16);
  } catch (error) {
    console.error("Error getting user count:", error);
    return 0;
  }
}

export async function getUserProfile(address: string): Promise<{ name: string; isRegistered: boolean } | null> {
  if (!window.ethereum) return null;

  try {
    // First check if user is registered
    const isRegistered = await isUserRegistered(address);
    if (!isRegistered) return null;

    // Call getUserProfile(address) - selector 0x2f30cabd
    const data = "0x2f30cabd" + address.slice(2).toLowerCase().padStart(64, "0");
    const result = await window.ethereum.request({
      method: "eth_call",
      params: [{ to: CONTRACT_ADDRESS, data }, "latest"],
    }) as string;

    // Decode the name from the response (first string in the tuple)
    // Skip first 64 chars (offset), next 64 chars is length
    const nameOffset = parseInt(result.slice(2, 66), 16) * 2 + 2;
    const nameLength = parseInt(result.slice(nameOffset, nameOffset + 64), 16);
    const nameHex = result.slice(nameOffset + 64, nameOffset + 64 + nameLength * 2);
    const name = Buffer.from(nameHex, "hex").toString("utf8");

    return { name, isRegistered: true };
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
