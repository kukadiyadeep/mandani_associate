import { createClient } from "@supabase/supabase-js";
import { Home as HomeIcon, Settings, Briefcase, Building2, Wallet, GraduationCap } from "lucide-react";

// --- Design Tokens ---
export const NAVY = "#0B1F3A";
export const TEAL = "#E2C16B";
export const TEAL_DARK = "#B8862C";
export const GOLD = "#B8842E";
export const GOLD_LIGHT = "#E2C16B";
export const GOLD_DARK = "#B8862C";

export const STATUS_BADGE_STYLES = {
  Submitted: { bg: "#EAF2FF", fg: "#1D4E89" },
  "Under Review": { bg: "#FFF6E5", fg: "#946200" },
  "Documents Required": { bg: "#FFF0E5", fg: "#9A4B10" },
  Approved: { bg: "#FEF3C7", fg: "#B8862C" },
  Rejected: { bg: "#FDEAEA", fg: "#B3261E" },
  Disbursed: { bg: "#EAF7EA", fg: "#2E7D32" },
};

// --- Utilities ---
export const fmtINR = (n) => "₹" + Math.round(n || 0).toLocaleString("en-IN");
export function calcEMI(p, r, y) {
  const rate = r / 12 / 100;
  const n = y * 12;
  return rate === 0 ? p / n : (p * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
}
export const refNumber = () => "MA" + Date.now().toString().slice(-8);

// --- Supabase Client ---
const sbUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const sbKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "placeholder";
export const supabase = createClient(sbUrl, sbKey);

// --- Mock Data ---
export const LOAN_CATEGORIES = [
  {
    id: "home",
    name: "Home Loan",
    type: "Secured",
    icon: HomeIcon,
    rate: "7% – 10%",
    img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
    points: ["Property-backed", "Long tenure", "Low interest"],
    eligibility: ["Age: 21-65 years"]
  },
  {
    id: "lap",
    name: "Loan Against Property",
    type: "Secured",
    icon: Building2,
    rate: "7.5% – 14%",
    img: "/morgage.png",
    points: ["Use property as collateral", "High loan amount", "Flexible use"],
    eligibility: ["Ownership of property"]
  },
  {
    id: "machinery",
    name: "Machinery Loan",
    type: "Secured",
    icon: Settings,
    rate: "7% – 13%",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    points: ["Asset-backed", "Business growth", "Tax benefits"],
    eligibility: ["Business age: 3+ years"]
  },
  {
    id: "personal",
    name: "Personal Loan",
    type: "Unsecured",
    icon: Wallet,
    rate: "10.5% – 18%",
    img: "https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&w=800&q=80",
    points: ["No collateral needed", "Quick approval", "Any purpose"],
    eligibility: ["Salaried/Self-employed", "Good CIBIL"]
  },
  {
    id: "business",
    name: "Business Loan",
    type: "Unsecured",
    icon: Briefcase,
    rate: "8% – 17%",
    img: "/buissness.png",
    points: ["Working capital", "Unsecured limits", "Fast disbursement"],
    eligibility: ["Min. turnover: ₹20L"]
  },
  {
    id: "education",
    name: "Education Loan",
    type: "Unsecured",
    icon: GraduationCap,
    rate: "6% – 10%",
    img: "/edu.jpg",
    points: ["Study in India/Abroad", "Moratorium period", "Co-applicant based"],
    eligibility: ["Confirmed admission"]
  },
];

export const SEED_APPLICATIONS = [
  { id: "MA10023456", name: "Demo User", mobile: "9876543210", loanType: "Home Loan", amount: 1000000, status: "Under Review", consultant: "S. Rao", date: "2026-08-12" }
];

export const REQUIRED_DOCS = [
  { key: "pan", label: "PAN Card" }, { key: "id", label: "Aadhaar Proof" }, { key: "address", label: "Address Proof" },
  { key: "salary", label: "Salary Slips" }, { key: "bank", label: "Bank Statement" }, { key: "itr", label: "ITR" },
];
