import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "./lib/supabase";
import {
  Menu, X, ChevronDown, ChevronRight, Check, CheckCircle2, Upload, Phone, Mail,
  MapPin, Clock, Star, Wallet, Home as HomeIcon, Briefcase, GraduationCap, Car,
  Building2, Calculator, Shield, Users, FileCheck, Clock3, HeartHandshake,
  ArrowRight, TrendingUp, Search, LayoutDashboard, Bell, LogOut, FileText,
  User, Settings, HelpCircle, BarChart3, SlidersHorizontal, Landmark,
  MessageCircle, ArrowLeft, UploadCloud, AlertTriangle, ChevronUp, Layers, Hourglass, ChevronLeft,
  Facebook, Instagram, Send, IndianRupee, Share2, Zap, Scale
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";

/* ----------------------------- Design tokens ----------------------------- */
const NAVY = "#0B1F3A";      // primary navy
const NAVY_2 = "#122A4D";    // secondary navy
const TEAL = "#E2C16B";      // gold light (replaces teal)
const TEAL_DARK = "#B8862C"; // gold dark (replaces teal dark)
const GOLD = "#B8842E";      // disclaimer accent
const MIST = "#F4F7FA";

const GOLD_LIGHT = "#E2C16B";
const GOLD_DARK = "#B8862C";
const LUXURY_TEXT = "#D9D9D6";
const fmtINR = (n) => {
  if (n === null || n === undefined || isNaN(n)) return "₹0";
  return "₹" + Math.round(n).toLocaleString("en-IN");
};

/* ------------------------------- Mock data -------------------------------- */
const LOAN_CATEGORIES = [
  { id: "home", name: "Home Loan", icon: HomeIcon, rate: "7% – 10%",
    points: ["Home purchase", "Home construction", "Home renovation"],
    eligibility: ["Age: 21-65 years", "Salaried/Self-employed", "Min. income: ₹25k/mo", "Stable work history"] },
  { id: "machinery", name: "Machinery Loan", icon: Settings, rate: "7% – 13%",
    points: ["Industrial equipment", "Medical machinery", "Manufacturing tools"],
    eligibility: ["Business age: 3+ years", "Profitable for last 2 yrs", "Good credit score", "MSME registration preferred"] },
  { id: "business", name: "Business Loan", icon: Briefcase, rate: "8% – 17%",
    points: ["Business expansion", "Working capital", "Equipment financing"],
    eligibility: ["Min. turnover: ₹20L", "Business age: 2+ years", "ITR for last 2 yrs", "Office ownership proof"] },
  { id: "lap", name: "Mortgage Loan / Loan Against Property", icon: Building2, rate: "7.5% – 14%",
    points: ["Property-backed financing", "Business/personal requirements"],
    eligibility: ["Ownership of property", "Clear property titles", "Age: 21-70 years", "Repayment capacity"] },
  { id: "personal", name: "CC / OD", icon: Wallet, rate: "7.5% – 15%",
    points: [  "Working capital facility","Flexible cash withdrawal","Business cash-flow support"],
    eligibility: ["Business age: 2+ years", "GST registration", "Regular bank conduct", "Min. turnover criteria"] },
  { id: "education", name: "Education Loan", icon: GraduationCap, rate: "6% – 10%",
    points: ["Higher education", "Domestic & international studies"],
    eligibility: ["Indian nationality", "Confirmed admission", "Co-applicant required", "Valid course details"] },
];

const PROVIDERS = [
  { id: 1, name: "Apex Finance", type: "CC / OD", rate: 10.5, maxAmount: "₹25,00,000", tenure: "1 – 5 yrs", fee: "Up to 2%" },
  { id: 2, name: "Northbridge Bank", type: "Home Loan", rate: 8.4, maxAmount: "₹5,00,00,000", tenure: "Up to 30 yrs", fee: "0.5%" },
  { id: 3, name: "Horizon NBFC", type: "Business Loan", rate: 12.0, maxAmount: "₹1,00,00,000", tenure: "1 – 7 yrs", fee: "Up to 2.5%" },
  { id: 4, name: "Meridian Capital", type: "Education Loan", rate: 9.25, maxAmount: "₹75,00,000", tenure: "Up to 15 yrs", fee: "Nil – 1%" },
  { id: 5, name: "Coastal Credit", type: "Machinery Loan", rate: 11.5, maxAmount: "₹50,00,000", tenure: "1 – 8 yrs", fee: "Up to 1%" },
  { id: 6, name: "Summit Trust", type: "Mortgage Loan / Loan Against Property", rate: 9.5, maxAmount: "₹3,00,00,000", tenure: "Up to 15 yrs", fee: "Up to 1.5%" },
  { id: 7, name: "Apex Finance", type: "Home Loan", rate: 8.6, maxAmount: "₹4,00,00,000", tenure: "Up to 25 yrs", fee: "0.5% – 1%" },
  { id: 8, name: "Northbridge Bank", type: "CC / OD", rate: 11.25, maxAmount: "₹20,00,000", tenure: "1 – 5 yrs", fee: "Up to 2%" },
];

const TESTIMONIALS = [
  { name: "Rahul Patel", text: "MANDANI ASSOCIATE helped me understand different personal loan options and guided me through the documentation process." },
  { name: "Priya Shah", text: "The EMI calculator was very useful and the consultant explained the process clearly." },
  { name: "Ankit Mehta", text: "I liked how transparent the team was about fees and timelines. No pressure, just clear guidance." },
];

const FAQS = [
  { q: "Is the consultation really free?", a: "Yes. Comparing lenders, explaining your options, and helping with paperwork costs you nothing — we're compensated by the bank once your loan is disbursed, not by you." },
  { q: "How many banks do you actually compare?", a: "We work with 30+ nationalized banks, private banks, and NBFCs across India, so you see real options side by side instead of just one branch's offer." },
  { q: "Do I need to visit your office in person?", a: "Not necessarily. Most of the process — from initial discussion to document collection — can be handled over call, WhatsApp, and email. Visit our Surat office only if you prefer to." },
  { q: "How long does loan approval usually take?", a: "It depends on the loan type, lender, and how quickly documents are ready — but because we pre-check your file before submission, most applications move faster than going directly to a bank." },
  { q: "What if my CIBIL score isn't great?", a: "We still recommend talking to us. Different lenders have different eligibility criteria, and in many cases we can guide you on what to fix first or match you with a lender suited to your profile." },
  { q: "Which areas do you serve?", a: "Based in Surat, we provide physical consulting here and serve clients across Gujarat remotely — including Vadodara, Ahmedabad, Rajkot, and other cities." },
];

const WHY_US = [
  { icon: Users, title: "Expert Guidance", text: "Experienced loan consultants help you understand the options available to you." },
  { icon: SlidersHorizontal, title: "Multiple Loan Options", text: "Explore personal, home, business, education, vehicle and property-backed loans in one place." },
  { icon: Shield, title: "Transparent Process", text: "We clearly explain fees, eligibility criteria, and documentation before you proceed." },
  { icon: Clock3, title: "Fast Assistance", text: "Get a prompt response from our loan consultants on your enquiry." },
  { icon: FileCheck, title: "Secure Documents", text: "Your information and uploaded documents are handled with strict confidentiality." },
  { icon: HeartHandshake, title: "Personalized Support", text: "Guidance tailored to your income, goals, and repayment comfort." },
];

const PROCESS_STEPS = [
  { n: "01", title: "Tell Us Your Requirement", text: "Share what you need the loan for and how much you're looking to borrow." },
  { n: "02", title: "Check Your Options", text: "Compare indicative rates and explore loan types suited to your profile." },
  { n: "03", title: "Submit Your Application", text: "Fill out the application and upload the required documents securely." },
  { n: "04", title: "Get Assistance Through the Process", text: "A consultant guides you from submission through to disbursement." },
];

const STATUS_FLOW = ["Submitted", "Documents Under Review", "Eligibility Verification", "Lender Review", "Approved", "Disbursed"];

const STATUS_BADGE_STYLES = {
  Submitted: { bg: "#EAF2FF", fg: "#1D4E89" },
  "Under Review": { bg: "#FFF6E5", fg: "#946200" },
  "Documents Required": { bg: "#FFF0E5", fg: "#9A4B10" },
  Approved: { bg: "#FEF3C7", fg: "#B8862C" },
  Rejected: { bg: "#FDEAEA", fg: "#B3261E" },
  Disbursed: { bg: "#EAF7EA", fg: "#2E7D32" },
};

const SEED_APPLICATIONS = [
  { id: "MA10023456", name: "Demo Applicant", mobile: "9876543210", loanType: "Personal Loan", amount: 500000, status: "Under Review", consultant: "S. Rao", date: "2026-08-02" },
  { id: "MA10023199", name: "Sample User", mobile: "9123456780", loanType: "Home Loan", amount: 3500000, status: "Documents Required", consultant: "A. Nair", date: "2026-07-28" },
];

const REQUIRED_DOCS = [
  { key: "pan", label: "PAN Card" },
  { key: "id", label: "Aadhaar / ID Proof" },
  { key: "address", label: "Address Proof" },
  { key: "salary", label: "Salary Slips" },
  { key: "bank", label: "Bank Statement" },
  { key: "itr", label: "ITR" },
];

const BANK_PARTNERS = [
  // Government Banks
  { name: "SBI", color: "#28AAE1", bg: "#F0F9FF", type: "Government Banks", logo:"/sbi.png" },
  { name: "Bank of Baroda", color: "#F04E23", bg: "#FFF1F1", type: "Government Banks", logo: "https://www.pngkit.com/png/detail/263-2633230_svg-symbol-logo-of-bank-of-baroda.png?utm_source=chatgpt.com"},
  { name: "PNB", color: "#F04E23", bg: "#FFF1F1", type: "Government Banks", logo: "/pnbbank.png"},
  { name: "Canara Bank", color: "#00539C", bg: "#F0F7FF", type: "Government Banks", logo: "/canarabank.png" },
  { name: "Central Bank of India", color: "#005BA1", bg: "#F0F6FB", type: "Government Banks", logo: "/centralbank.png" },
  { name: "Union Bank", color: "#005191", bg: "#F0F4FF", type: "Government Banks", logo: "https://www.nicepng.com/png/detail/250-2508669_union-bank-of-india-logo-png-transparent-union.png?utm_source=chatgpt.com" },
  { name: "Bank of India", color: "#F04E23", bg: "#FFF1F1", type: "Government Banks", logo: "https://www.nicepng.com/png/detail/1005-10051968_bank-of-india-logo-png-stc-kolkata-bank.png?utm_source=chatgpt.com" },
  { name: "UCO BANK", color: "#0067A5", bg: "#F0F7FF", type: "Government Banks", logo: "https://www.nicepng.com/png/detail/963-9639949_uco-bank-logo-uco-bank-logo-png.png?utm_source=chatgpt.com" },
  { name: "Surat District Bank", color: "#00833E", bg: "#F0FFF4", type: "Government Banks", logo: "/suratdistrictbank.png" },

  // Private Banks
  { name: "HDFC Bank", color: "#1C3F94", bg: "#F0F4FF", type: "Private Banks", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/HDFC_Bank_Logo.svg/1280px-HDFC_Bank_Logo.svg.png" },
  { name: "ICICI Bank", color: "#F58220", bg: "#FFF7ED", type: "Private Banks", logo: "https://www.kindpng.com/picc/m/328-3281737_icici-bank-logo-png-transparent-png.png"},
  { name: "Axis Bank", color: "#97144D", bg: "#FDF2F7", type: "Private Banks", logo: "https://www.pngkey.com/png/detail/241-2413596_axis-bank-logo-png.png?utm_source=chatgpt.com" },
  { name: "Kotak Bank", color: "#EE1C25", bg: "#FEF2F2", type: "Private Banks", logo: "/kotak.png"},
  { name: "IDFC First", color: "#922724", bg: "#FDF2F2", type: "Private Banks", logo: "/idfc.png" },
  { name: "Yes Bank", color: "#005EB8", bg: "#EFF6FF", type: "Private Banks", logo: "https://www.pngkey.com/png/detail/88-884312_file-yesbanklogo-yes-bank.png" },
  { name: "RBL Bank", color: "#005596", bg: "#F0F6FB", type: "Private Banks", logo: "https://www.pngkit.com/png/detail/223-2238067_rbl-bank-logo-png.png" },
  { name: "Bandhan Bank", color: "#0072BB", bg: "#F0F7FF", type: "Private Banks", logo: "/download.png" },
  { name: "IndusInd Bank", color: "#741618", bg: "#FDF2F2", type: "Private Banks", logo: "/indusald.png" },
  { name: "Surat People's Bank", color: "#005BA1", bg: "#EBF5FF", type: "Private Banks", logo: "/peoplebank.png" },
  { name: "Varachha Bank", color: "#E31E24", bg: "#FFF1F1", type: "Private Banks", logo: "/varacha.png" },

  // NBFCs
  { name: "Tata Capital", color: "#00A9E0", bg: "#F0FBFF", type: "NBFCs", logo: "/tatacapital.png" },
  { name: "Aditya Birla Capital", color: "#C61D23", bg: "#FFF2F2", type: "NBFCs", logo: "/adityabirla.png" },
  { name: "Bajaj Finserv", color: "#0072BB", bg: "#F0F7FF", type: "NBFCs", logo: "/bajaj.png" },
  { name: "AU Small Finance", color: "#652D90", bg: "#F7F2FF", type: "NBFCs", logo: "/ausmall.png" },
  { name: "Cholamandalam", color: "#005596", bg: "#F0F6FB", type: "NBFCs", logo: "/chola.png" },
  { name: "Muthoot Finance", color: "#E31E24", bg: "#FFF1F1", type: "NBFCs", logo: "/muthoot.png" },
  { name: "L&T Finance", color: "#00539C", bg: "#F0F7FF", type: "NBFCs", logo: "/l&t.png" },
];

const LEGAL_CONTENT = {
  privacy: {
    title: "Privacy Policy",
    body: "MANDANI ASSOCIATE collects only the information needed to assess your loan enquiry and connect you with suitable lending partners, such as your contact details, income information, and supporting documents. We do not sell your personal data. Information is shared with lenders only with your consent, for the purpose of processing your enquiry. You may request access to, correction of, or deletion of your data at any time by contacting our support team."
  },
  terms: {
    title: "Terms & Conditions",
    body: "MANDANI ASSOCIATE is a loan consultancy and lead-generation platform, not a bank or lender. By using this website you agree that any interest rates, eligibility estimates, or approval likelihoods shown are indicative only. Final loan terms are decided solely by the lender after their own verification. MANDANI ASSOCIATE does not guarantee approval, disbursement, or any specific interest rate."
  },
  disclaimer: {
    title: "Disclaimer",
    body: "All interest rates, processing fees, tenures, and eligibility results displayed on this website are indicative and subject to change without notice. MANDANI ASSOCIATE is not a lender and does not guarantee loan approval, disbursement, or the accuracy of third-party lender information. Please verify all terms directly with the lender before accepting any offer."
  },
  cookie: {
    title: "Cookie Policy",
    body: "This website may use cookies to remember your preferences and improve your browsing experience. Cookies do not store sensitive financial information. You can control cookie preferences through your browser settings."
  },
  consent: {
    title: "Consent & Communication Policy",
    body: "By submitting an enquiry or application, you consent to being contacted by MANDANI ASSOCIATE consultants and, where relevant, our lending partners via phone, email, SMS, or WhatsApp regarding your enquiry. You may withdraw consent at any time by contacting our support team."
  },
};

/* ------------------------------- Utilities -------------------------------- */
function calcEMI(principal, annualRate, years) {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  if (r === 0) return principal / n;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return emi;
}

function refNumber() {
  return "MA" + Date.now().toString().slice(-8);
}

/* ------------------------------ Small pieces ------------------------------ */
function Badge({ status }) {
  const s = STATUS_BADGE_STYLES[status] || { bg: "#EEE", fg: "#333" };
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: s.bg, color: s.fg }}>
      {status}
    </span>
  );
}

function CountUp({ end, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [end, duration, isVisible]);

  return <span ref={countRef}>{count.toLocaleString()}{suffix}</span>;
}

function SectionEyebrow({ children }) {
  return (
    <div className="inline-flex items-center gap-2 mb-3">
      <span className="h-px w-8" style={{ backgroundColor: TEAL }} />
      <span className="text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: TEAL_DARK }}>{children}</span>
    </div>
  );
}

function DisclaimerNote({ children, compact }) {
  return (
    <div className={`flex items-start gap-2 rounded-xl border-2 ${compact ? "p-3" : "p-4"}`}
      style={{ borderColor: "#EAD9B8", backgroundColor: "rgba(252, 247, 236, 0.85)" }}>
      <AlertTriangle size={16} style={{ color: GOLD, marginTop: 2, flexShrink: 0 }} />
      <p className="text-xs leading-relaxed" style={{ color: "#7A5A1E" }}>{children}</p>
    </div>
  );
}

function PrimaryButton({ children, onClick, className = "", type = "button", full, disabled }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${full ? "w-full" : ""} inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0 ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      style={{ backgroundColor: TEAL, boxShadow: "0 8px 20px -8px rgba(14,154,135,0.55)" }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = TEAL_DARK}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = TEAL}>
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, className = "" }) {
  return (
    <button onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 transition-colors duration-150 ${className}`}
      style={{ borderColor: NAVY, color: NAVY }}
      onMouseEnter={e => { e.currentTarget.style.backgroundColor = NAVY; e.currentTarget.style.color = "#fff"; }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = NAVY; }}>
      {children}
    </button>
  );
}

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold mb-1.5" style={{ color: NAVY }}>{label}</span>
      {children}
      {hint && <span className="block text-xs mt-1 text-slate-400">{hint}</span>}
    </label>
  );
}

const inputCls = "w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-amber-500 bg-white";

/* ================================ APP ==================================== */
export default function App() {
  const [view, setView] = useState("home");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [applications, setApplications] = useState(SEED_APPLICATIONS);
  const [legalType, setLegalType] = useState("privacy");
  const [applyPrefill, setApplyPrefill] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" }); }, [view]);

  const goHomeAndScroll = (id) => {
    setView("home");
    setMobileNavOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  const navTo = (v) => { setView(v); setMobileNavOpen(false); };

  const startApplication = (loanType) => {
    setApplyPrefill(loanType || null);
    setView("apply");
  };

  const addApplication = (app) => setApplications(prev => [app, ...prev]);
  const updateApplicationStatus = (id, status) =>
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));

  return (
    <div className="font-body min-h-screen bg-white text-slate-700" style={{ "--navy": NAVY }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');
        .font-display{ font-family:'Fraunces', Georgia, serif; }
        .font-body{ font-family:'Inter', system-ui, sans-serif; }
        input[type=range]{ -webkit-appearance:none; appearance:none; height:6px; border-radius:999px; background:#E2E8F0; }
        input[type=range]::-webkit-slider-thumb{ -webkit-appearance:none; appearance:none; width:18px; height:18px; border-radius:999px; background:${TEAL}; border:3px solid white; box-shadow:0 1px 4px rgba(0,0,0,0.35); cursor:pointer; margin-top:-6px; }
        input[type=range]::-moz-range-thumb{ width:18px; height:18px; border-radius:999px; background:${TEAL}; border:3px solid white; box-shadow:0 1px 4px rgba(0,0,0,0.35); cursor:pointer; }
        .card-hover{ transition: transform .2s ease, box-shadow .2s ease; }
        .card-hover:hover{ transform: translateY(-4px); box-shadow: 0 20px 30px -18px rgba(11,31,58,0.25); }
        @keyframes fadeUp{ from{opacity:0; transform:translateY(14px);} to{opacity:1; transform:translateY(0);} }
        /* ===== SMOOTH SCROLL REVEAL ===== */

        .scroll-reveal {
          opacity: 0;
          transform: translateY(70px);
          transition:
            opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: opacity, transform;
        }

        .scroll-reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .scroll-left {
          opacity: 0;
          transform: translateX(-100px);
          transition:
            opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: opacity, transform;
        }

        .scroll-left.is-visible {
          opacity: 1;
          transform: translateX(0);
        }

        .scroll-right {
          opacity: 0;
          transform: translateX(100px);
          transition:
            opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: opacity, transform;
        }

        .scroll-right.is-visible {
          opacity: 1;
          transform: translateX(0);
        }

        @media (max-width: 768px) {
          .scroll-left,
          .scroll-right {
            transform: translateY(50px);
          }

          .scroll-left.is-visible,
          .scroll-right.is-visible {
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-reveal,
          .scroll-left,
          .scroll-right {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 10s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        @keyframes bounceSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-subtle {
          animation: bounceSubtle 3s ease-in-out infinite;
        }
        @keyframes bounceSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-subtle {
          animation: bounceSubtle 3s ease-in-out infinite;
        }
      `}</style>

      <div className={`print:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0B1F3A]/95 shadow-xl" : ""}`}>
        <TopStrip />
        <Header scrolled={scrolled} view={view} navTo={navTo} goHomeAndScroll={goHomeAndScroll} startApplication={startApplication}
          mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />
      </div>

      <FloatingContactBar />

      <main>
        {view === "home" && <HomeView navTo={navTo} startApplication={startApplication} goHomeAndScroll={goHomeAndScroll} />}
        {view === "emi" && <EMICalculatorView startApplication={startApplication} goHomeAndScroll={goHomeAndScroll} />}
        {view === "eligibility" && <EligibilityView navTo={navTo} startApplication={startApplication} goHomeAndScroll={goHomeAndScroll} />}
        {view === "apply" && <ApplyView prefill={applyPrefill} addApplication={addApplication} navTo={navTo} />}
        {view === "about" && <AboutView navTo={navTo} goHomeAndScroll={goHomeAndScroll} />}
        {view === "documents" && <DocumentsView navTo={navTo} goHomeAndScroll={goHomeAndScroll} />}
        {view === "cibil" && <CibilScoreView navTo={navTo} startApplication={startApplication} goHomeAndScroll={goHomeAndScroll} />}
        {view === "legal" && <LegalView type={legalType} setType={setLegalType} />}
      </main>

      <div className="print:hidden">
        <Footer navTo={navTo} goHomeAndScroll={goHomeAndScroll} setLegalType={setLegalType} />
      </div>
    </div>
  );
}

/* ------------------------------- Top strip -------------------------------- */
function FloatingContactBar() {
  const [isOpen, setIsOpen] = useState(false);
  const actions = [
    { icon: Phone, href: "tel:+916352243073", color: "bg-blue-600", label: "Call Us" },
    { icon: MessageCircle, href: "https://wa.me/916352243073", color: "bg-green-500", label: "WhatsApp" },
    { icon: Instagram, href: "https://www.instagram.com/mandani_associate/", color: "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500", label: "Instagram" },
    { icon: Facebook, href: "https://www.instagram.com/mandani_associate/", color: "bg-[#1877F2]", label: "Facebook" },
  ];

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className="fixed right-4 bottom-8 z-[100] flex flex-col gap-2.5 items-center"
    >
      {isOpen && actions.map((a, i) => (
        <motion.a
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          key={i}
          href={a.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${a.color} w-9 h-9 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all group relative`}
        >
          <a.icon size={16} fill={a.icon === Facebook ? "currentColor" : "none"} />
          <div className="absolute right-full mr-4 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest border border-white/10 shadow-2xl">
            {a.label}
          </div>
        </motion.a>
      ))}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'bg-slate-900 shadow-inner' : 'bg-[#0B1F3A] shadow-2xl'} w-11 h-11 rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all relative border-4 border-white/10`}
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={20} fill="currentColor" />}
        {!isOpen && (
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
        )}
      </button>
    </div>
  );
}

function TopStrip() {
  return (
    <div className="hidden sm:flex items-center justify-end px-6 lg:px-10 py-2 text-xs text-white bg-black/20 backdrop-blur-sm">
      <div className="flex items-center gap-5 opacity-90">
        <span className="inline-flex items-center gap-1.5"><Phone size={12} /> +91 6352243073, +91 99790 43073</span>
        <span className="inline-flex items-center gap-1.5"><Mail size={12} /> loan.mandaniassociate@gmail.com</span>
      </div>
    </div>
  );
}

/* --------------------------------- Header ---------------------------------- */
function Header({ scrolled, view, navTo, goHomeAndScroll, startApplication, mobileNavOpen, setMobileNavOpen }) {
  const links = [
    { id: 'home', label: "Home", action: () => { window.scrollTo({ top: 0, behavior: "smooth" }); navTo("home"); } },
    { id: 'loans', label: "Loans", action: () => goHomeAndScroll("loans") },
    { id: 'emi', label: "EMI Calculator", action: () => navTo("emi") },
    { id: 'cibil', label: "CIBIL", action: () => navTo("cibil") },
    { id: 'about', label: "About Us", action: () => navTo("about") },
    { id: 'documents', label: "Documents", action: () => navTo("documents") },
    { id: 'contact', label: "Contact", action: () => goHomeAndScroll("contact") },
  ];

  return (
    <header className={`relative z-50 transition-all duration-300 border-b ${scrolled ? 'bg-[#0B1F3A]/95 border-white/10' : 'bg-[#0B1F3A]/80 backdrop-blur-lg border-white/20'}`}>
      <div className="px-6 lg:px-10 h-20 flex items-center justify-between max-w-[1440px] mx-auto">
        <button onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); navTo("home"); }} className="flex items-center gap-4 group">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-2xl border border-white/20 overflow-hidden">
            <img
              src="/mandanilogo.png"
              alt="MANDANI"
              className="w-full h-full object-contain p-1.5"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden flex-col items-center justify-center text-[#B8842E]">
               <HomeIcon size={24} strokeWidth={2.5} />
               <div className="text-[5px] font-bold">MA</div>
            </div>
          </div>
          <div className="text-left">
            <h1 className="block font-display font-bold text-xl sm:text-2xl tracking-tight leading-none" style={{ color: GOLD_LIGHT }}>
              MANDANI
            </h1>
            <p className="block text-[8px] sm:text-[10px] font-black tracking-[0.28em] uppercase mt-1 text-white">
              Associate
            </p>
         </div>
         </button>
        <nav className="hidden lg:flex items-center gap-1">
          {links.slice(0, 5).map(l => (
            <button
              key={l.id}
              onClick={l.action}
              className={`px-4 py-2 text-sm font-bold transition-all rounded-xl ${view === l.id ? 'bg-white/10 text-[#E2C16B]' : 'hover:bg-white/5 text-white'}`}
            >
              {l.label}
            </button>
          ))}

          <div className="w-px h-6 bg-white/20 mx-4" />

          {links.slice(5).map(l => (
            <button
              key={l.id}
              onClick={l.action}
              className={`px-4 py-2 text-sm font-bold transition-all rounded-xl ${view === l.id ? 'bg-white/10 text-[#E2C16B]' : 'hover:bg-white/5 text-white'}`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={() => startApplication(null)}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl shadow-amber-500/50"
            style={{ backgroundColor: GOLD_LIGHT }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = GOLD_DARK}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = GOLD_LIGHT}
          >
            Apply Now <ArrowRight size={18} />
          </button>
        </div>

        <div className="lg:hidden flex items-center gap-3">
          <button
            onClick={() => setMobileNavOpen(v => !v)}
            className={`p-3 rounded-2xl border transition-all ${mobileNavOpen ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
          >
            {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bottom-0 bg-white z-50 p-6 flex flex-col animate-fade-in overflow-y-auto">
          <div className="space-y-2 flex-grow">
            {links.map(l => (
              <button
                key={l.id}
                onClick={l.action}
                className={`w-full text-left p-5 text-lg font-bold rounded-2xl transition-all ${view === l.id ? 'bg-amber-50 text-amber-600' : 'text-slate-900 active:bg-slate-100'}`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div className="pt-8 border-t border-slate-100">
            <PrimaryButton onClick={() => startApplication(null)} full className="!py-5 !text-lg !rounded-3xl shadow-2xl">
              Get Started Now <ArrowRight size={20} />
            </PrimaryButton>
          </div>
        </div>
      )}
    </header>
  );
}
function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className = ""
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Use a very low threshold and no negative margin to ensure it triggers on mobile/short screens
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.01,
        rootMargin: "0px"
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const animationClass =
    direction === "left"
      ? "scroll-left"
      : direction === "right"
      ? "scroll-right"
      : "scroll-reveal";

  return (
    <div
      ref={ref}
      className={`${animationClass} ${
        visible ? "is-visible" : ""
      } ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
/* --------------------------------- HOME ------------------------------------ */
function HomeView({ navTo, startApplication, goHomeAndScroll }) {
  return (
    <>
      <ScrollReveal direction="up">
        <Hero
          navTo={navTo}
          goHomeAndScroll={goHomeAndScroll}
        />
      </ScrollReveal>

      <ScrollReveal direction="left">
        <BankPartnersSection />
      </ScrollReveal>

      {/* KEEP EXISTING HORIZONTAL SCROLL */}
      <LoanCategoriesSection
        startApplication={startApplication}
      />

      <ScrollReveal direction="right">
        <HappyCustomersSection />
      </ScrollReveal>

      <ScrollReveal direction="left">
        <ProcessingStrengthSection
          goHomeAndScroll={goHomeAndScroll}
        />
      </ScrollReveal>

      <ScrollReveal direction="right">
        <WhyChooseUsSection
          goHomeAndScroll={goHomeAndScroll}
        />
      </ScrollReveal>

      <ScrollReveal direction="left">
        <EMITeaserStrip navTo={navTo} />
      </ScrollReveal>

      <ScrollReveal direction="right">
        <HowItWorksSection />
      </ScrollReveal>

      <ScrollReveal direction="left">
        <FAQSection />
      </ScrollReveal>

      <ScrollReveal direction="right">
        <ContactSection />
      </ScrollReveal>

      <ScrollReveal direction="up">
        <MapSection />
      </ScrollReveal>
    </>
  );
}
function MapSection() {
  return (
    <section className="relative h-[550px] w-full overflow-hidden bg-slate-100">
      {/* Map Embed - Native pin handles zooming/panning automatically */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.0123!2d72.85303277503668!3d21.21172158048386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f6caaaaaaab%3A0x6739670000000000!2sD-2008%2C%202nd%20Floor%2C%20Central%20Bazar%2C%20Minibazar%2C%20Varachha%20Main%20Road%2C%20Surat-395006!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="MANDANI ASSOCIATE Office"
        className="grayscale-[0.4] contrast-[1.1] hover:grayscale-0 transition-all duration-700"
      ></iframe>

      {/* Red Location Marker (Pin) - Floating Emoji Style */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center -translate-y-8">
           <div className="bg-white px-2 py-1 rounded shadow-lg text-[10px] font-bold mb-1 border border-slate-100">MANDANI Associate</div>
           <div className="text-4xl filter drop-shadow-lg">📍</div>
        </div>
      </div>

      {/* Zoom Overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="mt-44 bg-black/30 backdrop-blur-sm text-white px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
          Use ctrl + scroll to zoom the map
        </div>
      </div>

      {/* Floating Info Card */}
      <div className="absolute top-6 left-6 z-10 hidden sm:block text-left">
        <div className="bg-white rounded-lg shadow-2xl p-5 w-[280px] border border-slate-100">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm leading-tight">MANDANI Associate</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Loan Consultancy</p>
            </div>
            <div className="flex gap-2">
              <a
                href="https://www.google.com/maps/dir//D-2008%2C+2nd+Floor,+Central+Bazar,+Minibazar,+Varachha+Main+Road,+Surat-395006"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#1A73E8] flex items-center justify-center text-white shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform"
                title="Get Directions"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rotate-45">
                  <path d="m5 12 14-7-7 14-2-7-7-2Z" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin size={16} className="text-[#1A73E8]" />
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                D-2008, 2nd Floor, Central Bazar, Minibazar, Varachha Main Road, Surat-395006.
              </p>
            </div>

            <div className="flex items-center gap-1.5 pt-2 border-t border-slate-50">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} size={10} fill={i <= 4 ? "#F59E0B" : "none"} color={i <= 4 ? "#F59E0B" : "#CBD5E1"} />)}
              </div>
              <span className="text-[10px] font-bold text-slate-700">4.8</span>
              <span className="text-[10px] text-slate-400">(128 reviews)</span>
            </div>
          </div>

          <button
            onClick={() => window.open("https://www.google.com/maps/search/?api=1&query=D-2008%2C+2nd+Floor%2C+Central+Bazar%2C+Minibazar%2C+Varachha+Main+Road%2C+Surat-395006")}
            className="w-full mt-4 py-2 bg-slate-900 text-white rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors"
          >
            View on Google Maps
          </button>
        </div>
      </div>
    </section>
  );
}

function ProcessingStrengthSection({ goHomeAndScroll }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const strengths = [
    { label: "Home Loan", val: "100%" },
    { label: "Loan Against Property", val: "97%" },
    { label: "Business & SME", val: "98%" },
    { label: "Personal Loan", val: "95%" },
    { label: "Machinery Loan", val: "99%"}
  ];

  const features = [
    "Customer First Approach",
    "No Extra Cost For Consultation",
    "Expert Banking Services",
    "Authorized by almost all Banks, NBFCs",
    "Fast Processing",
    "Save Functional Cost of Login",
    "Reduced Pain for Bank Visits",
    "Free Legal Documentation Guidance",
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-white overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(${TEAL} 1px, transparent 1px)`, backgroundSize: '30px 32px' }} />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-50 rounded-full blur-[100px] opacity-60" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-50 rounded-full blur-[80px] opacity-40" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-start">
          {/* Left: Processing Strength */}
          <div className="flex flex-col gap-8">
            <div className="bg-slate-50/60 backdrop-blur-sm rounded-[3rem] p-8 lg:p-12 border border-slate-100 shadow-2xl shadow-slate-200/40 fade-up">
              <div className="flex items-center gap-5 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm">
                  <TrendingUp size={28} />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-[#0B1F3A] mb-1">Loan processing strength</h3>
                  <p className="text-sm text-slate-500 font-medium">Our technical expertise and knowledge help us process loans faster.</p>
                </div>
              </div>

              <div className="space-y-10">
                {strengths.map(s => (
                  <div key={s.label} className="group">
                    <div className="flex justify-between text-sm font-bold mb-3 transition-colors group-hover:text-amber-600">
                      <span className="text-[#0B1F3A]">{s.label}</span>
                      <span className="text-amber-600">
                        {isVisible ? <CountUp end={parseInt(s.val)} suffix="%" /> : "0%"}
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-[1500ms] ease-out"
                        style={{ width: isVisible ? s.val : "0%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3D Effective Floating Card */}
            <div className="hidden lg:block relative perspective-1000 animate-bounce-subtle">
               <div className="bg-gradient-to-br from-[#0B1F3A] to-[#122A4D] rounded-[2.5rem] p-8 text-white shadow-[0_50px_100px_-20px_rgba(11,31,58,0.4)] border border-white/10 relative overflow-hidden group">
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-colors" />

                  <div className="relative z-10 flex items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl bg-white/5 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-2xl">
                      <Scale size={40} className="text-amber-400" />
                    </div>
                    <div className="text-left">
                       <h4 className="text-3xl font-bold mb-1 tracking-tight">Financial Balance</h4>
                       <p className="text-amber-400 font-bold uppercase tracking-widest text-[10px]">Optimized Loan Solutions</p>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                     <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Max Sanction</p>
                        <p className="text-xl font-bold">100% Value</p>
                     </div>
                     <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Min Interest</p>
                        <p className="text-xl font-bold">Starts 7%</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Right: Features Grid */}
          <div className="flex flex-col">
            <div className="mb-12">
               <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] text-amber-600 bg-amber-50 uppercase mb-4">
                 Our Edge
               </span>
               <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B1F3A] mb-6">Why Clients Trust <span className="text-amber-600">Mandani Associate</span></h2>
               <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">We provide a seamless experience by handling the complexities of loan procurement, from initial consultation to final disbursement.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-12">
              {features.map((f, i) => (
                <div key={f} className="flex items-center gap-4 p-5 bg-slate-50/80 rounded-2xl border border-slate-100/50 text-left hover:bg-white hover:shadow-xl transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-amber-500 shadow-sm border border-slate-50 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                    <CheckCircle2 size={20} />
                  </div>
                  <span className="text-[15px] font-bold text-slate-700 leading-tight">{f}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
              {[
                { label: "Free", sub: "Consultation", icon: HeartHandshake, color: "from-amber-600 to-amber-500" },
                { label: "Fast", sub: "Processing", icon: Zap, color: "from-blue-600 to-blue-500" },
                { label: "Trusted", sub: "Advisors", icon: Shield, color: "from-navy-900 to-slate-800" },
              ].map(b => (
                <div key={b.label} className="bg-[#122A4D] rounded-[2rem] p-6 text-center text-white shadow-xl hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ backgroundImage: `linear-gradient(to bottom right, white, transparent)` }} />
                  <b.icon size={24} className="mx-auto mb-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-black uppercase tracking-widest mb-1">{b.label}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{b.sub}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
               <PrimaryButton onClick={() => goHomeAndScroll("contact")} full className="!py-5 !text-lg !rounded-2xl shadow-2xl shadow-amber-500/20 active:scale-95 transition-transform flex-1">
                 Book Free Consulting <ArrowRight size={22} className="ml-2" />
               </PrimaryButton>
               <button onClick={() => goHomeAndScroll("loans")} className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-5 rounded-2xl font-bold border-2 border-slate-200 text-[#0B1F3A] hover:bg-slate-50 transition-all active:scale-95">
                 View Loan Products
               </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HappyCustomersSection() {
  const stats = [
    { icon: HeartHandshake, end: 5000, suffix: "+", label: "Happy customers", color: "amber" },
    { icon: FileCheck, end: 2500, suffix: "+", label: "Sanctioned Files", color: "blue" },
    { icon: Building2, end: 30, suffix: "+", label: "Associated banks", color: "amber" },
    { icon: Users, end: 15, suffix: "+", label: "Team size", color: "indigo" },
    { icon: Briefcase, end: 10, suffix: "+", label: "Years Experience", color: "sky" },
  ];

  return (
    <section className="py-12 relative overflow-hidden bg-slate-900">
      {/* Decorative blurred blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] translate-x-1/2 translate-y-1/2" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="text-center group">
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="absolute inset-0 bg-white/5 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500" />
                  <div className="relative w-16 h-16 bg-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/10 shadow-xl group-hover:-translate-y-1 group-hover:bg-white/20 transition-all duration-500">
                    <Icon size={28} color="white" strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                <div className="font-display text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
                  <CountUp end={s.end} suffix={s.suffix} />
                </div>
                <div className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


function BankPartnersSection() {
  const [activeTab, setActiveTab] = useState("Government Banks");
  const tabs = [
    { label: "Government Banks", icon: MessageCircle },
    { label: "Private Banks", icon: Building2 },
    { label: "NBFCs", icon: Briefcase },
  ];

  const filteredBanks = BANK_PARTNERS.filter(b => b.type === activeTab);

  return (
    <section className="py-16 overflow-hidden bg-slate-50/75 border-y border-slate-100">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="max-w-md">
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-[0.2em] mb-3 block">Network</span>
            <h2 className="text-3xl font-bold text-[#0B1F3A] mb-4">Compare Offers from 30+ Leading Partners</h2>
            <p className="text-slate-500">We work with India's most trusted banks and financial institutions to ensure you get the best deal.</p>
          </div>

          <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl">
            {tabs.map(t => {
              const Icon = t.icon;
              const active = activeTab === t.label;
              return (
                <button
                  key={t.label}
                  onClick={() => setActiveTab(t.label)}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-bold transition-all ${active ? 'bg-white text-amber-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Icon size={14} /> {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Improved Marquee */}
        <div className="relative group mt-8">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10" />

          <div className="flex gap-8 animate-scroll whitespace-nowrap w-max py-8" style={{ animationDuration: '20s' }}>
            {[...filteredBanks, ...filteredBanks, ...filteredBanks].map((bank, i) => (
              <div
                key={`${bank.name}-${i}`}
                className="inline-flex items-center justify-center px-6 py-4 rounded-[2rem] border-2 border-slate-300 shadow-2xl shadow-slate-300/40 bg-white w-[180px] h-24 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group/card overflow-hidden"
              >
                <div className="relative w-full h-12 flex items-center justify-center">
                  {bank.logo ? (
                    <img
                      src={bank.logo}
                      alt={bank.name}
                      className={`h-full w-auto object-contain transition-all duration-500 group-hover/card:scale-110 ${bank.name === 'PNB' ? 'scale-[1.5]' : 'max-w-[85%]'}`}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <span className={`${bank.logo ? 'hidden' : 'block'} font-display font-bold text-xl text-center`} style={{ color: bank.color }}>
                    {bank.name}
                  </span>
                </div>

                {/* Hover tint background */}
                <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none -z-0" style={{ backgroundColor: `${bank.color}08` }} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-slate-200" />
            Reliable & Secure Banking Partners
            <span className="h-px w-12 bg-slate-200" />
          </p>
        </div>
      </div>
    </section>
  );
}



function MiniSlider({ label, value, setValue, min, max, step, format }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold text-slate-800">{label}</span>
        <span className="text-xs font-bold" style={{ color: NAVY }}>{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => setValue(Number(e.target.value))} className="w-full" />
    </div>
  );
}

function Hero({ navTo, goHomeAndScroll }) {
  const [amt, setAmt] = useState(800000);
  const [rate, setRate] = useState(10.5);
  const [years, setYears] = useState(5);
  const emi = calcEMI(amt, rate, years);

  return (
    <section className="relative overflow-hidden min-h-[525px] flex items-center bg-[#0B1F3A] pt-32">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=1600&q=80"
          alt="Business Handshake"
          className="w-full h-full object-cover"
          style={{ opacity: 1.0 }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/90 via-[#0B1F3A]/70 to-transparent" />
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px"
        }} />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 pt-24 pb-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
        <div className="fade-up text-center lg:text-left">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">Trusted Financial Advisors</span>
          </div>

          <h1 className="font-display text-white text-4xl sm:text-6xl lg:text-[4.2rem] font-bold leading-[1.05] mb-8">
            Fast Approvals.<br />
            <span className="text-[#E2C16B]">Better Rates.</span>
          </h1>

          <p className="text-white text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-12 font-medium">
            MANDANI ASSOCIATE connects you with 30+ leading banks to find the perfect loan match. Expert guidance, zero hidden charges.
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-5 mb-16">
            <PrimaryButton onClick={() => goHomeAndScroll("loans")} className="!px-10 !py-4 text-lg">
              Explore Loans <ArrowRight size={20} />
            </PrimaryButton>
            <button onClick={() => navTo("emi")}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-bold border-2 border-white/40 text-white hover:bg-white/5 hover:border-white/60 transition-all text-lg group"
            >
              <Calculator size={20} className="text-amber-400 group-hover:scale-110 transition-transform" /> Calculate EMI
            </button>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center justify-center lg:justify-start gap-x-10 gap-y-6 border-t border-white/10 pt-10">
            {[
              { label: "Partner Banks", val: "30+" },
              { label: "Happy Clients", val: "5000+" },
              { label: "Success Rate", val: "98%" }
            ].map(s => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-white mb-1">{s.val}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating EMI Card */}
        <div className="fade-up max-w-xl mx-auto lg:mx-0 w-full" style={{ animationDelay: "0.2s" }}>
        <div className="bg-white/55 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] border border-white/25">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Quick Preview</h3>
                <p className="text-sm text-slate-700 font-bold">Indicative EMI estimate</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                <TrendingUp size={24} className="text-amber-600" />
              </div>
            </div>

            <div className="space-y-8">
              <MiniSlider label="Loan Amount" value={amt} setValue={setAmt} min={50000} max={100000000} step={50000} format={fmtINR} />
              <MiniSlider label="Interest Rate" value={rate} setValue={setRate} min={5} max={20} step={0.1} format={v => v.toFixed(1) + "%"} />
              <MiniSlider label="Tenure" value={years} setValue={setYears} min={1} max={30} step={1} format={v => v + " yrs"} />
            </div>

            <div className="mt-12 p-8 rounded-3xl bg-slate-900 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em] mb-3">Estimated Monthly EMI</div>
                <div className="font-display text-4xl font-bold text-white tracking-tight">{fmtINR(emi)}</div>
              </div>
            </div>

            <button onClick={() => navTo("emi")} className="w-full mt-8 text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center justify-center gap-2 group transition-colors">
              View Detailed Breakdown <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


function LoanCategoriesSection({ startApplication }) {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !containerRef.current) return;
      const section = sectionRef.current;
      const container = containerRef.current;

      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const stickyHeight = window.innerHeight;

      const scrollOffset = window.scrollY - sectionTop;
      const scrollRange = sectionHeight - stickyHeight;

      if (scrollOffset >= 0 && scrollOffset <= scrollRange) {
        const progress = scrollOffset / scrollRange;
        const totalWidth = container.scrollWidth;
        const viewportWidth = window.innerWidth;
        // Adjusted maxTranslate to ensure the last card stops perfectly
        const maxTranslate = Math.max(0, totalWidth - viewportWidth + 80);
        container.style.transform = `translateX(${-progress * maxTranslate}px)`;
      } else if (scrollOffset < 0) {
        container.style.transform = `translateX(0px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} id="loans" className="relative h-[450vh] bg-white overflow-visible pb-32 pt-40">
      {/* Refined sticky container to ensure full card visibility */}
      <div className="sticky top-[120px] h-[calc(100vh-120px)] flex flex-col justify-center overflow-visible">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 w-full mb-6 sm:mb-10 shrink-0 relative z-20">
          <div className="flex flex-col items-center text-center">
            <span className="inline-block px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.2em] text-amber-600 bg-amber-50 uppercase mb-2">
              Our Financial Solutions
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-semibold mb-2 max-w-2xl leading-[1.2]" style={{ color: NAVY }}>
              Tailored Loan Options for <span className="text-amber-600">Every Need</span>
            </h2>
            <div className="h-1.5 w-16 sm:w-20 bg-amber-500 rounded-full mt-2" />
          </div>
        </div>

        <div
          ref={containerRef}
          className="flex gap-6 sm:gap-10 px-6 lg:px-20 transition-transform duration-150 ease-out will-change-transform w-max pb-20 items-stretch overflow-visible"
        >
          {LOAN_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="group relative bg-white/70 backdrop-blur-sm rounded-[2.5rem] border-2 border-slate-200/80 p-5 sm:p-7 transition-all duration-500 hover:shadow-[0_40px_80px_-15px_rgba(11,31,58,0.15)] hover:-translate-y-2 hover:border-amber-500/40 overflow-hidden flex flex-col shadow-xl shadow-slate-200/10 w-[250px] sm:w-[320px] flex-shrink-0"
              >
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-slate-50 rounded-full transition-all duration-500 group-hover:scale-[2.5] group-hover:bg-amber-50/50 -z-0" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-3 transition-all duration-500 bg-slate-50 group-hover:bg-amber-500 group-hover:shadow-lg group-hover:shadow-amber-500/30">
                    <Icon size={24} className="text-slate-700 transition-colors duration-500 group-hover:text-white sm:w-7 sm:h-7" />
                  </div>

                  <h3 className="font-display text-lg sm:text-xl lg:text-2xl font-bold mb-1 transition-colors duration-500 group-hover:text-amber-700" style={{ color: NAVY }}>
                    {cat.name}
                  </h3>

                  <div className="inline-flex items-center px-3 py-1 rounded-lg bg-amber-50 text-amber-700 text-[9px] sm:text-xs font-bold mb-3 w-fit">
                    Starts from {cat.rate.split('–')[0]}
                  </div>

                  <ul className="space-y-2 sm:space-y-3 mb-5 flex-grow">
                    {cat.points.map(p => (
                      <li key={p} className="flex items-start gap-3 text-slate-500 group-hover:text-slate-600 transition-colors">
                        <div className="mt-1 w-4 h-4 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
                          <Check size={10} className="text-amber-600" />
                        </div>
                        <span className="text-xs sm:text-sm lg:text-[15px] leading-snug">{p}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => startApplication(cat.name)}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 sm:py-4 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 bg-slate-50 text-slate-700 hover:bg-[#0B1F3A] hover:text-white hover:shadow-xl mt-auto"
                  >
                    Apply Now <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
          <div className="w-[10vw] flex-shrink-0" />
        </div>
      </div>
    </section>
  );
}

function EMITeaserStrip({ navTo }) {
  return (
    <section className="py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-900" />
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500/10 to-transparent" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="bg-white/5 backdrop-blur-lg rounded-[2rem] border border-white/10 p-6 sm:p-10">
          <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-widest">
                <Calculator size={12} /> Tools & Calculators
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4 max-w-2xl leading-tight">
                Plan Your Finances With Confidence Using Our <span className="text-amber-400">Interactive Tools</span>
              </h3>
              <p className="text-slate-400 text-sm sm:text-base max-w-xl leading-relaxed">
                Take the guesswork out of borrowing. Calculate your monthly commitments,
                understand interest components, and make informed decisions instantly.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navTo("emi")}
                className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-slate-900 bg-amber-400 hover:bg-amber-300 transition-all shadow-xl shadow-amber-500/20"
              >
                Launch EMI Calculator <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUsSection({ goHomeAndScroll }) {
  const highlights = [
    { title: "Expert Guidance", desc: "Decades of collective experience in Indian banking." },
    { title: "Quick Processing", desc: "Get your files sanctioned with minimum turnaround time." },
    { title: "Lowest Rates", desc: "We compare 30+ lenders to find you the best market rates." }
  ];

  return (
    <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-32 relative">
      {/* Decorative background element */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-50 rounded-full blur-3xl opacity-50 -z-10" />

      <div className="grid lg:grid-cols-2 gap-20 items-center">
        {/* Left column: Visuals */}
        <ScrollReveal direction="left">
          <div className="relative">
          <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(11,31,58,0.15)] transform -rotate-2 hover:rotate-0 transition-transform duration-700">
            <img
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80"
              alt="MANDANI ASSOCIATE Consultants"
              className="w-full aspect-[4/5] object-cover"
            />
          </div>

          {/* Experience Badge */}
          <div className="absolute -bottom-10 -right-10 z-20 bg-[#0B1F3A] rounded-[2rem] p-10 shadow-2xl animate-bounce-subtle">
            <div className="text-amber-400 text-5xl font-bold mb-2">10+</div>
            <div className="text-white/90 text-xs font-bold uppercase tracking-widest leading-tight">
              Years of Excellence<br />In Financial Services
            </div>
          </div>

          {/* Partner Badge */}
          <div className="absolute -top-6 -left-6 z-20 bg-white rounded-2xl p-6 shadow-xl border border-slate-50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Landmark size={24} />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 leading-none">30+</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Bank Partners</div>
            </div>
          </div>
        </div>
         </ScrollReveal>
        {/* Right column: Content */}
        <ScrollReveal direction="right">
        <div>
          <span className="inline-block px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.2em] text-amber-600 bg-amber-50 uppercase mb-8">
            Why Partner With Us
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-10" style={{ color: NAVY }}>
            Experienced Advisors for Your <span className="text-amber-600 italic">Financial Growth</span>
          </h2>

          <div className="space-y-10 mb-12">
            {highlights.map((h, i) => (
              <div key={i} className="flex gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#0B1F3A] group-hover:text-white transition-all duration-300">
                  <Check size={20} className="text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{h.title}</h3>
                  <p className="text-slate-500 leading-relaxed max-w-md">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-5">
            <PrimaryButton onClick={() => goHomeAndScroll("contact")} className="!px-10 !py-4 shadow-xl shadow-amber-500/20">
              Book A Free Session
            </PrimaryButton>
            <GhostButton onClick={() => goHomeAndScroll("loans")} className="!px-10 !py-4">
              Explore Our Services
            </GhostButton>
          </div>
        </div>
          </ScrollReveal>

      </div>
    </section>
  );
}

function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    {
      n: "01",
      title: "Application & Eligibility Check",
      text: "Our experts conduct a thorough assessment of your financial profile and requirement to determine your eligibility across multiple lenders.",
      img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
      floatingIcon: FileText,
      floatingText: "The first step is to submit a loan application along with key financial documents such as income statements and KYC papers.",
    },
    {
      n: "02",
      title: "Loan Structuring & Documentation",
      text: "Our team assists in preparing and verifying all necessary documentation, ensuring compliance with lender requirements. This includes financial projections, collateral details (if required), and legal paperwork to ensure a smooth approval process.",
      img: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=800&q=80",
      floatingIcon: FileCheck,
      floatingText: "Once eligibility is confirmed, we help structure your loan by selecting the most suitable type, tenure, and repayment plan.",
    },
    {
      n: "03",
      title: "Bank Evaluation & Approval",
      text: "Our consultants actively engage with banks to negotiate competitive interest rates, flexible repayment terms, and faster processing. We provide necessary clarifications to lenders, reducing approval delays and increasing the chances of securing the best deal.",
      img: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=800&q=80",
      floatingIcon: Landmark,
      floatingText: "The lender carefully reviews your application, evaluates financial risks, and conducts due diligence before granting approval.",
    },
    {
      n: "04",
      title: "Loan Disbursement",
      text: "We ensure that the funds are transferred without unnecessary delays, allowing you to utilize them for business expansion, working capital, or personal financial goals. Our team continues to support you post-disbursement with financial planning and repayment guidance.",
      img: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80",
      floatingIcon: IndianRupee,
      floatingText: "Once approved, the final agreement is signed, and the loan amount is disbursed to your account as per the agreed terms.",
    },
  ];

  const stepRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveStep(Number(entry.target.getAttribute('data-index')));
          }
        });
      },
      { threshold: 0.5, rootMargin: "-10% 0px -10% 0px" }
    );

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 bg-white/75 relative">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-24">
          <div className="inline-block px-6 py-2 rounded-full border border-slate-200 text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-6">
            Our Process
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#0B1F3A] tracking-tight uppercase">
            Our Roadmap to Your Financial Success
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-32 relative">
          {/* Left Side: Scrolling Content */}
          <div className="w-full lg:w-1/2 lg:pr-16">
            {steps.map((s, i) => (
              <div
                key={s.n}
                ref={el => (stepRefs.current[i] = el)}
                data-index={i}
                className="min-h-[60vh] flex flex-col justify-center py-20"
              >
                <div className="relative">
                  <div className="absolute -top-24 -left-8 text-[15rem] font-black text-slate-100/60 select-none leading-none -z-10">
                    {s.n}
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-[#0B1F3A] mb-8 relative text-left uppercase">
                    <span className="inline-block w-12 h-1 bg-amber-500 absolute -bottom-3 left-0" />
                    {s.title}
                  </h3>
                  <p className="text-slate-500 text-lg leading-relaxed max-w-lg text-left">
                    {s.text}
                  </p>
                </div>

                {/* Mobile Image (visible only on small screens) */}
                <div className="lg:hidden mt-12 relative">
                  <div className="rounded-[2.5rem] overflow-hidden shadow-xl">
                    <img src={s.img} alt={s.title} className="w-full aspect-video object-cover" />
                  </div>
                  <div className="mt-6 bg-slate-50 rounded-2xl p-6 border border-slate-100 text-left">
                    <p className="text-sm text-slate-600 leading-relaxed font-medium text-left">
                      {s.floatingText}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side: Sticky Image container */}
          <div className="hidden lg:block w-1/2 sticky top-44 h-[70vh] self-start">
            <div className="relative h-full w-full">
              {/* Image Layer with Clip */}
              <div className="absolute inset-0 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] bg-slate-100 border border-slate-100/50">
                {steps.map((s, i) => (
                  <img
                    key={s.n}
                    src={s.img}
                    alt={s.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                      activeStep === i ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))}
              </div>

              {/* Floating Card Layer - Outside Clip */}
              {steps.map((s, i) => (
                <div
                  key={s.n + '-card'}
                  className={`absolute bottom-12 -left-12 w-80 transition-all duration-700 ease-in-out ${
                    activeStep === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'
                  }`}
                >
                  <div className="bg-white/35 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-white/20 text-left">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 text-slate-800 border border-slate-100">
                      <s.floatingIcon size={32} />
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed font-bold">
                      {s.floatingText}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .vertical-text {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
        }
        @keyframes bounceSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-subtle {
          animation: bounceSubtle 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <SectionEyebrow>Testimonials</SectionEyebrow>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold" style={{ color: NAVY }}>What Our Customers Say</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TESTIMONIALS.map(t => (
          <div key={t.name} className="p-7 rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={15} fill={TEAL} color={TEAL} />)}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-5">"{t.text}"</p>
            <div className="font-semibold text-sm" style={{ color: NAVY }}>{t.name}</div>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-slate-400 mt-8">Individual experiences may vary. MANDANI ASSOCIATE does not guarantee approval or specific outcomes.</p>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <SectionEyebrow>FAQ</SectionEyebrow>
          <h2 className="font-display text-3xl sm:text-4xl font-bold" style={{ color: NAVY }}>Common Questions</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FAQS.slice(0, 6).map((f, i) => (
            <div key={i} className="bg-white/45 backdrop-blur-sm p-8 rounded-[2rem] border-2 border-slate-300/85 shadow-xl shadow-slate-200/20 hover:border-amber-500/30 hover:bg-white hover:shadow-2xl transition-all duration-300">
              <h3 className="text-lg font-bold mb-4" style={{ color: "#1D4E89" }}>{f.q}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "Surat",
    loanType: "",
    message: "",
    termsAccepted: false,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.termsAccepted) {
      alert("Please accept Terms & Conditions and Privacy Policy.");
      return;
    }

    if (!formData.fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      alert("Please enter your email.");
      return;
    }

    if (!formData.phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }

    if (!formData.loanType) {
      alert("Please select a loan type.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("loan_requests")
        .insert([
          {
            full_name: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            city: formData.city,
            loan_type: formData.loanType,
            message: formData.message.trim(),
            terms_accepted: formData.termsAccepted,
          },
        ]);

      if (error) {
        console.error("Supabase error:", error);
        alert("Submission failed: " + error.message);
        return;
      }

      alert("Your request has been submitted successfully!");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        city: "Surat",
        loanType: "",
        message: "",
        termsAccepted: false,
      });

    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const iconInputCls = "w-full rounded-xl border border-slate-200 pl-11 pr-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 bg-white";

  return (
    <section id="contact" className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 bg-white">
      <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 items-start">
        {/* Left Column */}
        <div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-[1.15] mb-4" style={{ color: NAVY }}>
            Contact Us Today, Get<br />
            In Touch With <span style={{ color: TEAL }}>Expert</span>
          </h2>
          <p className="text-slate-500 text-base mb-8 leading-relaxed max-w-md">
            Free loan consultation in Surat — speak with our advisors and get the right bank offer without extra consultancy charges.
          </p>

          <div className="space-y-5 mb-10">
            {/* Call Us */}
            <div className="bg-white/45 backdrop-blur-sm rounded-2xl p-5 border-2 border-slate-200/60 shadow-xl flex items-start gap-4 transition-all hover:border-amber-500/30">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(14,154,135,0.1)" }}>
                <Phone size={18} style={{ color: TEAL }} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Call Us</div>
                <div className="text-base font-bold text-slate-700 leading-tight">+91 6352243073</div>
                <div className="text-base font-bold text-slate-700">+91 99790 43073</div>
              </div>
            </div>

            {/* Our Office */}
            <div className="bg-white/45 backdrop-blur-sm rounded-2xl p-5 border-2 border-slate-200/60 shadow-xl flex items-start gap-4 transition-all hover:border-amber-500/30">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(14,154,135,0.1)" }}>
                <MapPin size={18} style={{ color: TEAL }} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Our Office</div>
                <div className="text-sm font-medium text-slate-700 mb-1">
                  <span className="font-bold">Surat —</span> D-2008, 2nd Floor, Central Bazar, Minibazar, Varachha Main Road, Surat-395006.
                </div>
                <a href="https://www.google.com/maps/search/?api=1&query=D-2008%2C+2nd+Floor%2C+Central+Bazar%2C+Minibazar%2C+Varachha+Main+Road%2C+Surat-395006" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-amber-600 uppercase tracking-wider hover:underline">View full address</a>
              </div>
            </div>

            {/* Follow Us */}
            <div className="bg-white/45 backdrop-blur-sm rounded-2xl p-5 border-2 border-slate-200/60 shadow-xl flex items-center gap-4 justify-between transition-all hover:border-amber-500/30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(14,154,135,0.1)" }}>
                  <MessageCircle size={18} style={{ color: TEAL }} />
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Follow Us</div>
              </div>
              <div className="flex gap-2">
                <a href="tel:+916352243073" className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-600 hover:scale-110 transition-transform border border-slate-100"><Phone size={16} /></a>
                <a href="https://www.instagram.com/mandani_associate/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm text-pink-600 hover:scale-110 transition-transform border border-slate-100"><Instagram size={16} /></a>
                <a href="https://wa.me/916352243073" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm text-green-600 hover:scale-110 transition-transform border border-slate-100"><MessageCircle size={16} fill="currentColor" /></a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="relative group">
          <div className="absolute -top-1 left-0 right-0 h-1.5 bg-amber-500 rounded-t-3xl z-10" />
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 sm:p-10 relative">
            <div className="mb-8">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em] mb-2 block">Contact Form</span>
              <h3 className="font-display text-2xl font-semibold mb-2" style={{ color: NAVY }}>Get A Flexible Schedule</h3>
              <p className="text-slate-500 text-sm">Share your details and we'll call you back with the best loan options in Surat.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    className={iconInputCls}
                    placeholder="Full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    type="email"
                    className={iconInputCls}
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    className={iconInputCls}
                    placeholder="Phone (10 digits)"
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select
                    className={iconInputCls + " appearance-none"}
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  >
                    <option value="Surat">Surat</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Vadodara">Vadodara</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  className={iconInputCls + " appearance-none"}
                  value={formData.loanType}
                  onChange={(e) => setFormData({ ...formData, loanType: e.target.value })}
                >
                  <option value="">Select loan type</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Home Loan">Home Loan</option>
                  <option value="Business Loan">Business Loan</option>
                  <option value="Mortgage Loan">Mortgage Loan</option>
                  <option value="Car Loan">Car Loan</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>

              <div className="relative">
                <textarea
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 p-4 text-sm text-slate-700 outline-none transition-all focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 bg-white"
                  placeholder="Write your message..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                  className="mt-1.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-xs text-slate-400 leading-relaxed">
                  I agree to the <button type="button" className="text-teal-600 hover:underline">Terms & Conditions</button> and <button type="button" className="text-teal-600 hover:underline">Privacy Policy</button> of MANDANI ASSOCIATE.
                </span>
              </label>

              <PrimaryButton type="submit" full disabled={loading} className="!py-4 shadow-xl shadow-amber-600/20 group">
                <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                {loading ? "Sending..." : "Send Request"}
              </PrimaryButton>

              <div className="text-center">
                <p className="text-[10px] text-slate-300">This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- EMI CALCULATOR -------------------------------- */
/* ---------------------------- PDF PRINT COMPONENT --------------------------- */
function PrintableReport({ amt, rate, years, emi, totalPayment, totalInterest, startDate, fullSchedule }) {
  const [startYear, startMonth] = startDate.split("-").map(Number);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const lastYear = fullSchedule[fullSchedule.length - 1];
  const lastMonth = lastYear?.months[lastYear.months.length - 1];

  const fmtPDF = (n) => "Rs. " + Math.round(n || 0).toLocaleString("en-IN");

  return (
    <div className="hidden print:block p-10 bg-white min-h-screen text-slate-900 font-sans relative">
      <div className="relative z-10 text-left">
        {/* PDF Header */}
        <div className="flex justify-between items-end border-b-4 border-[#3F51B5] pb-6 mb-8 text-[#3F51B5]">
          <h1 className="text-3xl font-bold">Loan Amortization Schedule</h1>
          <p className="text-sm font-semibold tracking-wider">MANDANI ASSOCIATE</p>
        </div>

        {/* LOAN DETAILS */}
        <div className="mb-10">
          <h2 className="text-[14px] font-black text-[#3F51B5] uppercase tracking-[0.2em] mb-4">Loan Details</h2>
          <div className="grid grid-cols-2 border-y-2 border-slate-200 py-6 gap-y-4">
            <DetailRow label="Loan Type" value="Home Loan" />
            <DetailRow label="Principal Amount" value={fmtPDF(amt)} />
            <DetailRow label="Annual Interest Rate" value={rate + "%"} />
            <DetailRow label="Loan Tenure" value={`${years} Yr (${years * 12} Months)`} />
            <DetailRow label="Start Month" value={`${monthNames[startMonth - 1]} ${startYear}`} />
            <DetailRow label="Monthly EMI" value={fmtPDF(emi)} />
          </div>
        </div>

        {/* PAYMENT SUMMARY */}
        <div className="mb-10">
          <h2 className="text-[14px] font-black text-[#3F51B5] uppercase tracking-[0.2em] mb-4">Payment Summary</h2>
          <div className="grid grid-cols-2 border-y-2 border-slate-200 py-6 gap-y-4">
            <DetailRow label="Total Amount Payable" value={fmtPDF(totalPayment)} />
            <DetailRow label="Total Interest Payable" value={fmtPDF(totalInterest)} />
            <DetailRow label="Total Principal" value={fmtPDF(amt)} />
            <DetailRow label="Interest to Principal" value={((totalInterest / (amt || 1)) * 100).toFixed(1) + "%"} />
            <DetailRow label="Loan Paid Off By" value={lastMonth?.month || "N/A"} />
            <DetailRow label="No. of EMIs" value={years * 12} />
          </div>
        </div>

        {/* YEAR-WISE SUMMARY */}
        <div style={{ pageBreakBefore: 'always' }}>
          <h2 className="text-[14px] font-black text-[#3F51B5] uppercase tracking-[0.2em] mb-4">Year-wise Summary</h2>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#3F51B5] text-white">
                <th className="py-3 px-4 text-left font-bold uppercase tracking-wider">Year</th>
                <th className="py-3 px-4 text-right font-bold uppercase tracking-wider">Principal</th>
                <th className="py-3 px-4 text-right font-bold uppercase tracking-wider">Interest</th>
                <th className="py-3 px-4 text-right font-bold uppercase tracking-wider">Total Payment</th>
                <th className="py-3 px-4 text-right font-bold uppercase tracking-wider">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 border-b border-slate-200">
              {fullSchedule.map((row) => (
                <tr key={row.year}>
                  <td className="py-3 px-4 font-bold text-slate-700">{row.year}</td>
                  <td className="py-3 px-4 text-right text-slate-600">{fmtPDF(row.yearlyPrincipal)}</td>
                  <td className="py-3 px-4 text-right text-slate-600">{fmtPDF(row.yearlyInterest)}</td>
                  <td className="py-3 px-4 text-right text-slate-600 font-semibold">{fmtPDF(row.yearlyTotal)}</td>
                  <td className="py-3 px-4 text-right text-slate-900 font-black">{fmtPDF(row.remainingBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Contact Us Detail - Shown on Last Page */}
        <div className="mt-16 pt-8 border-t border-slate-100">
          <h2 className="text-[14px] font-black text-[#3F51B5] uppercase tracking-[0.2em] mb-6">Contact Us</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#3F51B5]">
                <Phone size={16} />
              </div>
              <span className="text-sm font-bold text-slate-700">+91 6352243073 , +91 99790 43073</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#3F51B5]">
                <Mail size={16} />
              </div>
              <span className="text-sm font-bold text-slate-700">loan.mandaniassociate@gmail.com</span>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#3F51B5] mt-0.5">
                <MapPin size={16} />
              </div>
              <span className="text-sm font-bold text-slate-700 max-w-lg">
                D-2008, 2nd Floor, Central Bazar, Minibazar, Varachha Main Road, Surat-395006.
              </span>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-50 text-center">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.3em]">Generated by MANDANI ASSOCIATE</p>
          <p className="text-[10px] text-slate-300 mt-1">Surat's Trusted Financial Advisors</p>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between px-6">
      <span className="text-slate-500 font-medium">{label}</span>
      <span className="font-bold text-slate-800">{value}</span>
    </div>
  );
}

function EMICalculatorView({ navTo, startApplication, goHomeAndScroll }) {
  const [amt, setAmt] = useState(1000000);
  const [rate, setRate] = useState(10.5);
  const [years, setYears] = useState(5);
  const [startDate, setStartDate] = useState(new Date().toISOString().substring(0, 7));
  const [expandedYear, setExpandedYear] = useState(null);

  const emi = calcEMI(amt, rate, years);
  const totalPayment = emi * years * 12;
  const totalInterest = totalPayment - amt;
  const data = [{ name: "Principal", value: Math.round(amt) }, { name: "Interest", value: Math.round(totalInterest) }];

  const fullSchedule = useMemo(() => {
    let balance = amt;
    const monthlyRate = rate / 12 / 100;
    const yearsArray = [];

    const [startYear, startMonth] = startDate.split("-").map(Number);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

    let currentYear = startYear;
    let currentMonthIdx = startMonth - 1; // 0-11

    while (balance > 0.01) {
      const year = currentYear;
      const monthsInYear = [];
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;

      for (let m = currentMonthIdx; m < 12; m++) {
        if (balance <= 0.01) break;

        const interest = balance * monthlyRate;
        const principal = Math.min(emi - interest, balance);

        monthsInYear.push({
          month: `${monthNames[m]} ${year}`,
          emi: principal + interest,
          principal,
          interest,
          balance: Math.max(0, balance - principal)
        });

        yearlyInterest += interest;
        yearlyPrincipal += principal;
        balance -= principal;
      }

      if (monthsInYear.length > 0) {
        yearsArray.push({
          year,
          months: monthsInYear,
          yearlyPrincipal,
          yearlyInterest,
          yearlyTotal: yearlyPrincipal + yearlyInterest,
          remainingBalance: balance < 0.01 ? 0 : balance
        });
      }
      currentYear++;
      currentMonthIdx = 0;
      if (yearsArray.length > years + 2) break;
    }
    return yearsArray;
  }, [amt, rate, years, emi, startDate]);

  return (
    <div className="bg-white">
      <PrintableReport
        amt={amt} rate={rate} years={years} emi={emi}
        totalPayment={totalPayment} totalInterest={totalInterest}
        startDate={startDate} fullSchedule={fullSchedule}
      />
      <div className="print:hidden bg-slate-50/40">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 lg:py-36 bg-[#0B1F3A]">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?auto=format&fit=crop&w=1600&q=80"
              alt="Calculator Background"
              className="w-full h-full object-cover"
              style={{ opacity: 1.0 }}
            />
            <div className="absolute inset-0 bg-[#0B1F3A]/35" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B1F3A]/80 via-transparent to-[#0B1F3A]/80" />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/50 transition-all hover:bg-white/45">
              <button onClick={() => navTo("home")} className="text-[11px] font-bold text-white hover:text-white transition-colors uppercase tracking-widest">Home</button>
              <span className="text-[11px] font-bold text-white/50">/</span>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">Loan Calculator</span>
            </div>

            <h1 className="font-display text-white text-5xl sm:text-7xl font-bold mb-8 leading-tight">
              Loan EMI Calculator
            </h1>

            <p className="text-white text-lg sm:text-xl max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
              Estimate monthly EMI, total interest, and repayment schedule for home, personal, business, education, car, and mortgage loans — with expert guidance.
            </p>

            <div className="flex flex-wrap justify-center gap-5">
              <PrimaryButton onClick={() => goHomeAndScroll("contact")} className="!px-10 !py-4 shadow-xl shadow-amber-500/20">
                Free consultation
              </PrimaryButton>
              <button
                onClick={() => goHomeAndScroll("loans")}
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold border-2 border-white/50 text-white hover:bg-white/5 transition-all active:scale-95"
              >
                Our loan services
              </button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 -mt-16 relative z-20">
          {/* Floating Actions Menu */}
          <div className="fixed right-4 top-[45%] -translate-y-1/2 z-[60] flex flex-col gap-2">
            <button
              onClick={() => window.print()}
              className="w-11 h-11 rounded-xl bg-[#0B1F3A] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all group relative"
            >
              <FileText size={20} />
              <div className="absolute right-full mr-3 px-2 py-1 rounded-md bg-[#0B1F3A] text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest">
                Download PDF
              </div>
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("repayment-table");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="w-11 h-11 rounded-xl bg-[#0B1F3A] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all group relative"
            >
              <BarChart3 size={20} />
              <div className="absolute right-full mr-3 px-2 py-1 rounded-md bg-[#0B1F3A] text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest">
                Summary Table
              </div>
            </button>
          </div>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 mb-24">
            {/* Calculator Card */}
            <ScrollReveal direction="left">
            <div className="bg-white/55 backdrop-blur-xl rounded-[2.5rem] border-2 border-slate-200/60 shadow-[0_40px_80px_-20px_rgba(11,31,58,0.12)] p-8 sm:p-12">
              <div className="flex flex-col gap-10">
                <SliderRow label="Loan Amount" value={amt} setValue={setAmt} min={50000} max={100000000} step={50000} format={fmtINR} />

                <div className="grid sm:grid-cols-2 gap-10">
                   <SliderRow label="Interest Rate (per annum)" value={rate} setValue={setRate} min={5} max={24} step={0.1} format={v => v.toFixed(1) + "%"} />
                   <div className="flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-sm font-semibold" style={{ color: "#0B1F3A" }}>Schedule Start Month</span>
                      </div>
                      <input
                        type="month"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full h-[46px] px-4 rounded-xl border border-slate-200 font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                   </div>
                </div>

                <SliderRow label="Loan Tenure" value={years} setValue={setYears} min={1} max={30} step={1} format={v => v + " years"} />
              </div>

              <div className="grid sm:grid-cols-3 gap-6 mt-12">
                <StatBox label="Monthly EMI" value={fmtINR(emi)} highlight />
                <StatBox label="Total Interest" value={fmtINR(totalInterest)} />
                <StatBox label="Total Payable" value={fmtINR(totalPayment)} />
              </div>

              <div className="mt-12 flex flex-col gap-6">
                <PrimaryButton full className="!py-5 !text-lg !rounded-2xl" onClick={() => startApplication("EMI Calculator")}>
                  Apply for This Loan Now
                </PrimaryButton>
                <DisclaimerNote compact>
                  This calculator gives an indicative estimate. Actual EMI, interest rate, and charges depend on the lender's final assessment.
                </DisclaimerNote>
              </div>
            </div>
            </ScrollReveal>

            {/* Analysis Card */}
            <ScrollReveal direction="right">
            <div className="bg-slate-50/80 backdrop-blur-xl rounded-[2.5rem] border-2 border-slate-200/60 p-8 sm:p-12 flex flex-col items-center h-fit sticky top-24">
              <div className="w-full text-center mb-10">
                <h3 className="text-2xl font-bold text-[#0B1F3A] mb-2">Analysis Breakdown</h3>
                <p className="text-sm text-slate-500 font-medium">Principal vs Interest Component</p>
              </div>

              <div className="flex-1 w-full flex items-center justify-center min-h-[320px]">
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" innerRadius={80} outerRadius={130} paddingAngle={4}>
                      <Cell fill="#0B1F3A" stroke="none" />
                      <Cell fill="#E2C16B" stroke="none" />
                    </Pie>
                    <RTooltip formatter={v => fmtINR(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full grid grid-cols-2 gap-4 mt-10">
                <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-4 h-4 rounded-full bg-[#0B1F3A]" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Principal</p>
                    <p className="text-sm font-bold text-slate-900">{((amt / totalPayment) * 100).toFixed(1)}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-4 h-4 rounded-full bg-[#E2C16B]" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interest</p>
                    <p className="text-sm font-bold text-slate-900">{((totalInterest / totalPayment) * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>
            </ScrollReveal>
          </div>

          {/* Repayment Schedule Section (Accordion) */}
          <div id="monthly-schedule" className="mb-24 p-6 sm:p-10 bg-white/40 rounded-[2.5rem] border-2 border-slate-200 shadow-inner">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-[#0B1F3A] mb-3">Repayment Deduction</h2>
               <p className="text-slate-500 max-w-lg mx-auto">Tap a year to view detailed month-by-month breakdown of your principal and interest components.</p>
            </div>

            <div className="space-y-6">
              {fullSchedule.map((yearData) => (
                <div
                  key={yearData.year}
                  className="bg-white rounded-[2rem] border-2 border-slate-100 shadow-2xl shadow-slate-300/50 overflow-hidden hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] hover:border-amber-500/40 transition-all duration-300 group"
                >
                  <button
                    onClick={() => setExpandedYear(expandedYear === yearData.year ? null : yearData.year)}
                    className="w-full flex items-center justify-between p-6 sm:p-9 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-[#0B1F3A] mb-1 group-hover:text-amber-700 transition-colors">{yearData.year}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{yearData.months.length} months</span>
                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="text-xs font-bold text-amber-600">{fmtINR(yearData.yearlyTotal)} Total</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${expandedYear === yearData.year ? 'bg-[#0B1F3A] text-white shadow-lg' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                       <ChevronDown size={20} className={`transition-transform duration-500 ${expandedYear === yearData.year ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {expandedYear === yearData.year && (
                    <div className="px-6 sm:px-8 pb-8 animate-fade-down">
                      <div className="overflow-x-auto">
                        <table className="w-full border-separate border-spacing-y-2">
                          <thead>
                            <tr className="text-[#0B1F3A]">
                              <th className="px-4 py-2 text-left text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Month</th>
                              <th className="px-4 py-2 text-right text-[10px] font-black uppercase tracking-[0.2em] opacity-50">EMI</th>
                              <th className="px-4 py-2 text-right text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Principal</th>
                              <th className="px-4 py-2 text-right text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Interest</th>
                              <th className="px-4 py-2 text-right text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {yearData.months.map((m, idx) => (
                              <tr key={idx} className="bg-slate-50/50 rounded-xl">
                                <td className="px-4 py-3 font-bold text-[#0B1F3A] text-sm rounded-l-xl">{m.month}</td>
                                <td className="px-4 py-3 text-right text-slate-600 text-sm font-medium">{fmtINR(m.emi)}</td>
                                <td className="px-4 py-3 text-right text-slate-600 text-sm font-medium">{fmtINR(m.principal)}</td>
                                <td className="px-4 py-3 text-right text-slate-600 text-sm font-medium">{fmtINR(m.interest)}</td>
                                <td className="px-4 py-3 text-right text-amber-600 text-sm font-bold rounded-r-xl">{fmtINR(m.balance)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Year-wise Summary Section (Static Table) */}
          <div id="repayment-table" className="bg-[#0B1F3A] rounded-[2.5rem] p-8 sm:p-12 overflow-hidden shadow-2xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-2">Year-wise Summary</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/10 text-white/50">
                    <th className="px-6 py-6 text-left text-xs font-black uppercase tracking-[0.2em]">Year</th>
                    <th className="px-6 py-6 text-right text-xs font-black uppercase tracking-[0.2em]">Principal</th>
                    <th className="px-6 py-6 text-right text-xs font-black uppercase tracking-[0.2em]">Interest</th>
                    <th className="px-6 py-6 text-right text-xs font-black uppercase tracking-[0.2em]">Total Payment</th>
                    <th className="px-6 py-6 text-right text-xs font-black uppercase tracking-[0.2em]">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {fullSchedule.map((row) => (
                    <tr key={row.year} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-6 font-bold text-white text-lg">{row.year}</td>
                      <td className="px-6 py-6 text-right font-medium text-slate-300">{fmtINR(row.yearlyPrincipal)}</td>
                      <td className="px-6 py-6 text-right font-medium text-slate-300">{fmtINR(row.yearlyInterest)}</td>
                      <td className="px-6 py-6 text-right font-bold text-white">{fmtINR(row.yearlyTotal)}</td>
                      <td className="px-6 py-6 text-right font-bold text-amber-400">{fmtINR(row.remainingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SliderRow({ label, value, setValue, min, max, step, format }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold" style={{ color: NAVY }}>{label}</span>
        <input value={typeof value === "number" ? value : ""} onChange={e => {
          const v = Number(e.target.value.replace(/[^\d.]/g, ""));
          if (!isNaN(v)) setValue(v);
        }} className="w-28 text-right text-sm font-semibold rounded-lg border border-slate-200 px-2 py-1" style={{ color: TEAL_DARK }} />
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => setValue(Number(e.target.value))} className="w-full" />
      <div className="flex justify-between text-[11px] text-slate-400 mt-1">
        <span>{format(min)}</span><span>{format(max)}</span>
      </div>
    </div>
  );
}

function StatBox({ label, value, highlight }) {
  return (
    <div className="rounded-xl p-4 text-center border-2 border-slate-200/60 shadow-md" style={{ backgroundColor: highlight ? NAVY : "rgba(255, 255, 255, 0.9)" }}>
      <div className="text-[11px] mb-1 font-black uppercase tracking-wider" style={{ color: highlight ? "rgba(255,255,255,0.7)" : "#64748B" }}>{label}</div>
      <div className="font-display text-lg font-bold" style={{ color: highlight ? "white" : NAVY }}>{value}</div>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-500">
      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} /> {label}
    </div>
  );
}

/* ---------------------------- ELIGIBILITY CHECKER --------------------------- */
function EligibilityView({ navTo, startApplication, goHomeAndScroll }) {
  const [form, setForm] = useState({
    name: "", mobile: "", email: "", employment: "Salaried", income: "", age: "", city: "Surat",
    amount: "", loanType: LOAN_CATEGORIES[0].name, existingEmi: "", creditScore: ""
  });
  const [result, setResult] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    const income = Number(form.income) || 0;
    const existingEmi = Number(form.existingEmi) || 0;
    const requested = Number(form.amount) || 0;
    const disposable = Math.max(income * 0.5 - existingEmi, 0);
    const eligibleAmount = disposable * 60; // rough multiplier over an assumed 5-year tenor, indicative only
    let status = "Below Estimated Eligibility";
    if (requested <= eligibleAmount) status = "Likely Eligible";
    else if (requested <= eligibleAmount * 1.4) status = "Needs Review";
    setResult({ eligibleAmount, status, emiCapacity: disposable });
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-36 bg-[#0B1F3A]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1454165833767-027ffea70250?auto=format&fit=crop&w=1600&q=80"
            alt="Eligibility Check"
            className="w-full h-full object-cover"
            style={{ opacity: 1.0 }}
          />
          <div className="absolute inset-0 bg-[#0B1F3A]/35" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1F3A]/80 via-transparent to-[#0B1F3A]/80" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/50 transition-all hover:bg-white/45">
            <button onClick={() => navTo("home")} className="text-[11px] font-bold text-white hover:text-white transition-colors uppercase tracking-widest">Home</button>
            <span className="text-[11px] font-bold text-white/50">/</span>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">Eligibility Check</span>
          </div>

          <h1 className="font-display text-white text-5xl sm:text-7xl font-bold mb-8 leading-tight">
            Loan Eligibility Checker
          </h1>

          <p className="text-white text-lg sm:text-xl max-w-4xl mx-auto mb-12 leading-relaxed font-medium">
            Answer a few quick questions to see an indicative eligibility estimate and find the best loan terms in Surat.
          </p>

          <div className="flex flex-wrap justify-center gap-5">
            <PrimaryButton onClick={() => {
              const el = document.getElementById("eligibility-form");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }} className="!px-10 !py-4 shadow-xl shadow-amber-500/20">
              Check now
            </PrimaryButton>
            <button
              onClick={() => goHomeAndScroll("contact")}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold border-2 border-white/50 text-white hover:bg-white/5 transition-all"
            >
              Expert guidance
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section id="eligibility-form" className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24 -mt-12 relative z-20">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12">
          <form onSubmit={submit} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_40px_80px_-20px_rgba(11,31,58,0.12)] p-8 sm:p-12 grid sm:grid-cols-2 gap-8">
            <Field label="Full Name"><input required className={inputCls} placeholder="As per records" value={form.name} onChange={e => set("name", e.target.value)} /></Field>
            <Field label="Mobile Number"><input required className={inputCls} placeholder="10-digit number" value={form.mobile} onChange={e => set("mobile", e.target.value)} /></Field>
            <Field label="Email"><input required type="email" className={inputCls} placeholder="example@mail.com" value={form.email} onChange={e => set("email", e.target.value)} /></Field>
            <Field label="Employment Type">
              <select className={inputCls} value={form.employment} onChange={e => set("employment", e.target.value)}>
                <option>Salaried</option><option>Self Employed</option><option>Business Owner</option><option>Student</option>
              </select>
            </Field>
            <Field label="Monthly Income (₹)"><input required type="number" className={inputCls} placeholder="Net take-home" value={form.income} onChange={e => set("income", e.target.value)} /></Field>
            <Field label="Age"><input required type="number" className={inputCls} placeholder="Years" value={form.age} onChange={e => set("age", e.target.value)} /></Field>
            <Field label="City"><input required className={inputCls} value={form.city} readOnly /></Field>
            <Field label="Required Loan Amount (₹)"><input required type="number" className={inputCls} placeholder="₹" value={form.amount} onChange={e => set("amount", e.target.value)} /></Field>
            <Field label="Loan Type">
              <select className={inputCls} value={form.loanType} onChange={e => set("loanType", e.target.value)}>
                {LOAN_CATEGORIES.map(c => <option key={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Existing EMI (₹, if any)"><input type="number" className={inputCls} placeholder="₹" value={form.existingEmi} onChange={e => set("existingEmi", e.target.value)} /></Field>
            <div className="sm:col-span-2 mt-4">
              <PrimaryButton type="submit" full className="!py-5 !text-lg !rounded-2xl shadow-xl shadow-amber-500/20">
                Check Eligibility
              </PrimaryButton>
            </div>
          </form>

          <div className="flex flex-col gap-8">
            {result ? (
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_40px_80px_-20px_rgba(11,31,58,0.12)] p-8 sm:p-12 fade-up h-fit">
                <h3 className="font-display text-2xl font-bold mb-6 text-slate-900">Eligibility Result</h3>
                <div className="mb-8"><Badge status={result.status === "Likely Eligible" ? "Approved" : result.status === "Needs Review" ? "Under Review" : "Rejected"} /></div>

                <div className="grid gap-6 mb-10">
                  <div className="p-6 rounded-3xl bg-slate-900 text-white">
                    <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">Est. Eligible Amount</p>
                    <p className="font-display text-4xl font-bold">{fmtINR(result.eligibleAmount)}</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 text-slate-900">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Est. EMI Capacity</p>
                    <p className="font-display text-3xl font-bold">{fmtINR(result.emiCapacity)}<span className="text-sm font-medium text-slate-400">/mo</span></p>
                  </div>
                </div>

                <PrimaryButton full onClick={() => startApplication(form.loanType)} className="!py-4 shadow-lg shadow-amber-500/20">
                  Proceed to Application <ArrowRight size={18} />
                </PrimaryButton>

                <div className="mt-8">
                  <DisclaimerNote compact>
                    Results are indicative. Final approval and terms are subject to lender verification.
                  </DisclaimerNote>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 p-12 text-center flex-1 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6 text-slate-300">
                  <Calculator size={40} />
                </div>
                <h4 className="text-xl font-bold text-slate-700 mb-2">Result Pending</h4>
                <p className="text-sm text-slate-400 max-w-xs leading-relaxed">Fill in the form on the left to see your estimated loan eligibility instantly.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------ APPLICATION FORM ---------------------------- */
function ApplyView({ prefill, addApplication, navTo }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", dob: "", mobile: "", email: "", address: "", city: "", state: "", pincode: "",
    employment: "Salaried", company: "", income: "", experience: "", existingLoans: "",
    loanType: prefill || LOAN_CATEGORIES[0].name, amount: "", tenure: "", purpose: "",
    consent: false,
  });
  const [docs, setDocs] = useState(Object.fromEntries(REQUIRED_DOCS.map(d => [d.key, null])));
  const [uploading, setUploading] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFileUpload = async (key, file) => {
    if (!file) return;

    setUploading(prev => ({ ...prev, [key]: true }));

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('loan_documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('loan_documents')
        .getPublicUrl(filePath);

      setDocs(prev => ({ ...prev, [key]: publicUrl }));
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Upload failed: ' + (error.message || 'Unknown error'));
    } finally {
      setUploading(prev => ({ ...prev, [key]: false }));
    }
  };

  const stepLabels = ["Personal Details", "Employment Details", "Loan Details", "Documents", "Review & Submit"];

  const canNext = () => {
    if (step === 1) return form.name && form.dob && form.mobile && form.email && form.city;
    if (step === 2) return form.income;
    if (step === 3) return form.amount && form.tenure;
    if (step === 4) return true;
    return true;
  };

  const submit = async () => {
    setLoading(true);
    const appId = refNumber();

    try {
      const { error } = await supabase
        .from("loan_applications")
        .insert([{
          id: appId,
          full_name: form.name,
          dob: form.dob || null,
          mobile: form.mobile,
          email: form.email,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          employment_type: form.employment,
          company_name: form.company,
          monthly_income: Number(form.income) || 0,
          experience_years: Number(form.experience) || 0,
          existing_loans: form.existingLoans,
          loan_type: form.loanType,
          loan_amount: Number(form.amount) || 0,
          tenure_years: Number(form.tenure) || 0,
          purpose: form.purpose,
          docs: docs,
        }]);

      if (error) {
        console.error("Supabase error:", error);
        alert("Submission failed: " + error.message);
        return;
      }

      const app = {
        id: appId, name: form.name, mobile: form.mobile, loanType: form.loanType,
        amount: Number(form.amount) || 0, status: "Submitted", consultant: "Unassigned",
        date: new Date().toISOString().slice(0, 10),
      };
      addApplication(app);
      setSubmitted(app);

    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <PageShell eyebrow="Application" title="" subtitle="">
        <div className="max-w-lg mx-auto text-center bg-white rounded-2xl border border-slate-100 shadow-sm p-10 fade-up">
          <CheckCircle2 size={48} style={{ color: TEAL }} className="mx-auto mb-5" />
          <h2 className="font-display text-2xl font-semibold mb-6" style={{ color: NAVY }}>Application Submitted Successfully</h2>
          <div className="flex gap-3 justify-center">
            <PrimaryButton onClick={() => navTo("home")}>Back to Home</PrimaryButton>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell eyebrow="Application" title="Loan Application Form" subtitle="Complete the steps below to submit your loan enquiry.">
      <div className="max-w-3xl mx-auto">
        {/* Progress */}
        <div className="flex items-center mb-10">
          {stepLabels.map((label, i) => {
            const n = i + 1;
            const active = n === step, done = n < step;
            return (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold"
                    style={{ backgroundColor: done ? TEAL : active ? NAVY : "#E2E8F0", color: (done || active) ? "white" : "#94A3B8" }}>
                    {done ? <Check size={15} /> : n}
                  </div>
                  <span className="text-[10px] text-slate-400 text-center hidden sm:block w-20">{label}</span>
                </div>
                {n < stepLabels.length && <div className="flex-1 h-0.5 mx-1" style={{ backgroundColor: n < step ? TEAL : "#E2E8F0" }} />}
              </React.Fragment>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
          {step === 1 && (
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Full Name"><input className={inputCls} value={form.name} onChange={e => set("name", e.target.value)} /></Field>
              <Field label="Date of Birth"><input type="date" className={inputCls} value={form.dob} onChange={e => set("dob", e.target.value)} /></Field>
              <Field label="Mobile Number"><input className={inputCls} value={form.mobile} onChange={e => set("mobile", e.target.value)} /></Field>
              <Field label="Email"><input type="email" className={inputCls} value={form.email} onChange={e => set("email", e.target.value)} /></Field>
              <div className="sm:col-span-2"><Field label="Address"><input className={inputCls} value={form.address} onChange={e => set("address", e.target.value)} /></Field></div>
              <Field label="City"><input className={inputCls} value={form.city} onChange={e => set("city", e.target.value)} /></Field>
              <Field label="State"><input className={inputCls} value={form.state} onChange={e => set("state", e.target.value)} /></Field>
              <Field label="Pincode"><input className={inputCls} value={form.pincode} onChange={e => set("pincode", e.target.value)} /></Field>
            </div>
          )}
          {step === 2 && (
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Employment Type">
                <select className={inputCls} value={form.employment} onChange={e => set("employment", e.target.value)}>
                  <option>Salaried</option><option>Self Employed</option><option>Business Owner</option><option>Student</option>
                </select>
              </Field>
              <Field label="Company / Business Name"><input className={inputCls} value={form.company} onChange={e => set("company", e.target.value)} /></Field>
              <Field label="Monthly Income (₹)"><input type="number" className={inputCls} value={form.income} onChange={e => set("income", e.target.value)} /></Field>
              <Field label="Work Experience (years)"><input type="number" className={inputCls} value={form.experience} onChange={e => set("experience", e.target.value)} /></Field>
              <div className="sm:col-span-2"><Field label="Existing Loans (if any)"><input className={inputCls} value={form.existingLoans} onChange={e => set("existingLoans", e.target.value)} /></Field></div>
            </div>
          )}
          {step === 3 && (
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Loan Type">
                <select className={inputCls} value={form.loanType} onChange={e => set("loanType", e.target.value)}>
                  {LOAN_CATEGORIES.map(c => <option key={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Required Amount (₹)"><input type="number" className={inputCls} value={form.amount} onChange={e => set("amount", e.target.value)} /></Field>
              <Field label="Preferred Tenure (years)"><input type="number" className={inputCls} value={form.tenure} onChange={e => set("tenure", e.target.value)} /></Field>
              <div className="sm:col-span-2"><Field label="Purpose of Loan"><textarea rows={3} className={inputCls} value={form.purpose} onChange={e => set("purpose", e.target.value)} /></Field></div>
            </div>
          )}
          {step === 4 && (
            <div className="grid sm:grid-cols-2 gap-4">
              {REQUIRED_DOCS.map(d => (
                <div key={d.key} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: NAVY }}>{d.label}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{docs[d.key] ? docs[d.key] : "Not uploaded"}</div>
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border"
                    style={{ borderColor: docs[d.key] ? TEAL : "#CBD5E1", color: docs[d.key] ? TEAL_DARK : "#475569" }}>
                    {uploading[d.key] ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" />
                    ) : docs[d.key] ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <UploadCloud size={14} />
                    )}
                    {uploading[d.key] ? "Uploading..." : docs[d.key] ? "Uploaded" : "Upload"}
                    <input
                      type="file"
                      className="hidden"
                      onChange={e => handleFileUpload(d.key, e.target.files[0])}
                      disabled={uploading[d.key]}
                    />
                  </label>
                </div>
              ))}
              <p className="sm:col-span-2 text-xs text-slate-400 mt-1">Business documents may be requested additionally where applicable.</p>
            </div>
          )}
          {step === 5 && (
            <div>
              <h3 className="font-semibold mb-4" style={{ color: NAVY }}>Review Your Application</h3>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm mb-6">
                <ReviewRow label="Name" value={form.name} />
                <ReviewRow label="Date of Birth" value={form.dob} />
                <ReviewRow label="Mobile" value={form.mobile} />
                <ReviewRow label="Email" value={form.email} />
                <ReviewRow label="City" value={form.city} />
                <ReviewRow label="Employment" value={form.employment} />
                <ReviewRow label="Monthly Income" value={form.income && fmtINR(form.income)} />
                <ReviewRow label="Loan Type" value={form.loanType} />
                <ReviewRow label="Required Amount" value={form.amount && fmtINR(form.amount)} />
                <ReviewRow label="Tenure" value={form.tenure && `${form.tenure} years`} />
                <ReviewRow label="Documents Uploaded" value={`${Object.values(docs).filter(Boolean).length}/${REQUIRED_DOCS.length}`} />
              </div>
              <label className="flex items-start gap-3 mb-6 cursor-pointer">
                <input type="checkbox" checked={form.consent} onChange={e => set("consent", e.target.checked)} className="mt-1" />
                <span className="text-xs text-slate-500">I confirm that the information provided by me is accurate and I consent to being contacted regarding my loan enquiry.</span>
              </label>
              <DisclaimerNote compact>Submitting this application does not guarantee loan approval. Final decisions rest with the lender.</DisclaimerNote>
            </div>
          )}

          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <GhostButton onClick={() => setStep(s => s - 1)}><ArrowLeft size={15} /> Back</GhostButton>
            ) : <span />}
            {step < 5 ? (
              <PrimaryButton onClick={() => canNext() && setStep(s => s + 1)}>Next <ArrowRight size={15} /></PrimaryButton>
            ) : (
              <PrimaryButton onClick={submit} disabled={loading || !form.consent}>
                {loading ? "Submitting..." : "Submit Application"}
              </PrimaryButton>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-dashed border-slate-100 py-2">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-slate-700">{value || "—"}</span>
    </div>
  );
}

/* ---------------------------------- ABOUT ------------------------------------ */
function AboutView({ navTo, goHomeAndScroll }) {
  const whyUsItems = [
    {
      title: "Long experience",
      icon: Clock3,
      text: "We know this industry well and are aware of the know-hows that speed up approvals."
    },
    {
      title: "Proven consulting track record",
      icon: BarChart3,
      text: "We have successfully delivered more than 5,000+ loan services across Surat and Gujarat."
    },
    {
      title: "We value your time",
      icon: Users,
      text: "Frequent bank visits for documentation and rate negotiation are handled with minimal hassle."
    },
    {
      title: "Faster loan approvals",
      icon: CheckCircle2,
      text: "Complete files at login save pendency clearance time and extra bank visits."
    },
    {
      title: "Free consulting",
      icon: HeartHandshake,
      text: "Free profile analysis with the best suitable loan offers from 30+ lenders."
    },
    {
      title: "Strong lender negotiation",
      icon: Users,
      text: "We negotiate sanction amount & rate of interest with banks on your behalf."
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-36 bg-[#0B1F3A]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
            alt="About MANDANI Associate"
            className="w-full h-full object-cover"
            style={{ opacity: 0.95 }}
          />
          <div className="absolute inset-0 bg-[#0B1F3A]/35" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1F3A]/80 via-transparent to-[#0B1F3A]/80" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/50 transition-all hover:bg-white/45">
            <button onClick={() => navTo("home")} className="text-[11px] font-bold text-white hover:text-white transition-colors uppercase tracking-widest">Home</button>
            <span className="text-[11px] font-bold text-white/50">/</span>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">About Us</span>
          </div>

          <h1 className="font-display text-white text-4xl sm:text-7xl font-bold mb-8 leading-tight">
            About MANDANI Associate — Loan<br />Advisors in <span className="text-amber-400">Surat</span>
          </h1>

          <p className="text-white text-lg sm:text-xl max-w-4xl mx-auto mb-12 leading-relaxed font-medium">
            Your trusted loan advisors in Surat — complete solutions for home, business, education, personal, and secured loans.
          </p>

          <div className="flex flex-wrap justify-center gap-5">
            <PrimaryButton onClick={() => goHomeAndScroll("contact")} className="!px-10 !py-4 shadow-xl shadow-amber-500/20">
              Free consultation
            </PrimaryButton>
            <button
              onClick={() => goHomeAndScroll("loans")}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold border-2 border-white/50 text-white hover:bg-white/5 transition-all active:scale-95"
            >
              Our services
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Grid Section */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24 bg-white">
          <ScrollReveal direction="up">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.2em] text-amber-600 bg-amber-50 uppercase mb-4">
            WHY CHOOSE US
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold mb-6 max-w-4xl mx-auto leading-tight text-[#0B1F3A]">
            We facilitate <span className="text-amber-600">complete solutions</span> for all types of loans
          </h2>
          <p className="text-slate-500 text-lg max-w-3xl mx-auto">
            We offer loan services from banks, NBFCs, and other financers — including consultancy, documentation, and coordination for legal procedures.
          </p>
        </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyUsItems.map((item, idx) => {
            const Icon = item.icon;
            return (
                 <ScrollReveal direction={idx % 2 === 0 ? "left" : "right"} delay={idx * 0.08}>
              <div key={idx} className="p-10 rounded-[2rem] bg-white/45 backdrop-blur-sm border-2 border-slate-200/60 transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-navy-900/5 group text-left shadow-lg">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 border border-slate-100">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#0B1F3A] mb-4">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {item.text}
                </p>
              </div>
                </ScrollReveal>
            );
          })}
        </div>

        <div className="mt-20">
          <DisclaimerNote>
            We help customers understand loan options and navigate the application process. We do not guarantee loan approval or specific interest rates as final decisions are made by the respective financial institutions.
          </DisclaimerNote>
        </div>
      </section>
    </div>
  );
}

/* -------------------------------- DOCUMENTS ----------------------------------- */
function DocumentsView({ navTo, goHomeAndScroll }) {
  const [activeLoanId, setActiveLoanId] = useState(null);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-36 bg-[#0B1F3A]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80"
            alt="Documents Background"
            className="w-full h-full object-cover"
            style={{ opacity: 1.0 }}
          />
          <div className="absolute inset-0 bg-[#0B1F3A]/25" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1F3A]/70 via-transparent to-[#0B1F3A]/70" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/50 transition-all hover:bg-white/45">
            <button onClick={() => navTo("home")} className="text-[11px] font-bold text-white hover:text-white transition-colors uppercase tracking-widest">Home</button>
            <span className="text-[11px] font-bold text-white/50">/</span>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">Documents</span>
          </div>

          <h1 className="font-display text-white text-5xl sm:text-7xl font-bold mb-8 leading-tight">
            Documents You May Need
          </h1>

          <p className="text-white text-lg sm:text-xl max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
            Requirements vary by loan type and lender — here's a general guide to help you prepare your file for a fast approval in Surat.
          </p>

          <div className="flex flex-wrap justify-center gap-5">
            <PrimaryButton onClick={() => navTo("apply")} className="!px-10 !py-4 shadow-xl shadow-amber-500/20">
              Start your application
            </PrimaryButton>
            <button
              onClick={() => goHomeAndScroll("contact")}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold border-2 border-white/50 text-white hover:bg-white/5 transition-all active:scale-95"
            >
              Ask a consultant
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24 -mt-12 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {LOAN_CATEGORIES.map((loan, idx) => {
              const isOpen = activeLoanId === loan.id;
              return (
                <ScrollReveal key={loan.id} direction={idx % 2 === 0 ? "left" : "right"} delay={idx * 0.05}>
                  <div className={`bg-white/55 backdrop-blur-sm rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden flex flex-col ${isOpen ? 'border-amber-500 shadow-2xl ring-4 ring-amber-50' : 'border-slate-200/60 shadow-lg hover:shadow-xl'}`}>
                    <div className="p-8 flex-grow">
                      <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-6">
                        <loan.icon size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-[#0B1F3A] mb-6">{loan.name}</h3>

                      {isOpen ? (
                        <div className="space-y-8 animate-fade-down">
                          <div>
                            <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-4">Required Documents</h4>
                            <ul className="space-y-3">
                              {[
                                "PAN Card & Aadhaar",
                                loan.id === 'personal' ? "GST Registration Proof" : "Latest 3 Months Salary Slips",
                                loan.id === 'personal' ? "12 Months Bank Statement" : "6 Months Bank Statement",
                                "Address Proof (Utility Bill)",
                                "2 Passport Photos",
                                loan.id === 'business' || loan.id === 'machinery' || loan.id === 'personal' ? "Business Proof (GST/MSME)" : "Last 2 Years ITR",
                              ].map((doc, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-500">
                                  <div className="mt-1 w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                                    <Check size={12} className="text-amber-600" />
                                  </div>
                                  <span>{doc}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-xs font-black text-[#B8842E] uppercase tracking-widest mb-4">Eligibility Criteria</h4>
                            <ul className="space-y-3">
                              {loan.eligibility.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-500">
                                  <div className="mt-1 w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                                  </div>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400 mb-6">Tap to view checklist & eligibility.</p>
                      )}
                    </div>

                    <button
                      onClick={() => setActiveLoanId(isOpen ? null : loan.id)}
                      className={`w-full py-4 text-sm font-bold transition-all flex items-center justify-center gap-2 border-t ${isOpen ? 'bg-amber-600 text-white border-amber-600' : 'bg-slate-50 text-[#0B1F3A] border-slate-100 hover:bg-slate-100'}`}
                    >
                      {isOpen ? <>Hide Checklist <ChevronUp size={16} /></> : <>View Required Documents <ChevronDown size={16} /></>}
                    </button>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          <div className="space-y-10">
            <DisclaimerNote>
              Note: The above list is indicative. Depending on the lending partner and your specific profile, additional documents like business ownership proof, property papers, or guarantor details may be requested.
            </DisclaimerNote>

            <div className="p-10 rounded-[2.5rem] bg-slate-50/80 backdrop-blur-sm border-2 border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-8 shadow-xl">
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Still confused about paperwork?</h3>
                <p className="text-slate-500">Our Surat consultants handle the documentation for you to ensure a high success rate.</p>
              </div>
              <PrimaryButton onClick={() => goHomeAndScroll("contact")} className="!rounded-2xl">
                Get Expert Help
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------ CUSTOMER DASHBOARD ----------------------------- */
function DashboardView({ applications, navTo }) {
  const [tab, setTab] = useState("overview");
  const menu = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "applications", label: "My Applications", icon: FileText },
    { id: "documents", label: "Documents", icon: UploadCloud },
    { id: "offers", label: "Loan Offers", icon: Wallet },
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "support", label: "Support", icon: HelpCircle },
  ];

  const myApps = applications.slice(0, 3);

  return (
    <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12 grid lg:grid-cols-[240px_1fr] gap-8">
      <aside className="bg-white rounded-2xl border border-slate-100 p-4 h-fit">
        <div className="px-3 py-3 mb-2">
          <div className="text-xs text-slate-400">Welcome back</div>
          <div className="font-display font-semibold" style={{ color: NAVY }}>Aditi Sharma</div>
        </div>
        {menu.map(m => {
          const Icon = m.icon; const active = tab === m.id;
          return (
            <button key={m.id} onClick={() => setTab(m.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-colors"
              style={{ backgroundColor: active ? "rgba(14,154,135,0.1)" : "transparent", color: active ? TEAL_DARK : "#475569" }}>
              <Icon size={16} /> {m.label}
            </button>
          );
        })}
        <button onClick={() => navTo("home")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 mt-3 border-t border-slate-100 pt-4">
          <LogOut size={16} /> Logout
        </button>
      </aside>

      <div>
        <h1 className="font-display text-2xl font-semibold mb-6" style={{ color: NAVY }}>Welcome, Aditi Sharma</h1>

        {tab === "overview" && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <DashCard label="Active Applications" value="2" icon={FileText} />
              <DashCard label="Documents" value="8/10" icon={UploadCloud} />
              <DashCard label="Application Status" value="Under Review" icon={Clock3} small />
              <DashCard label="Next Action" value="Upload bank statement" icon={AlertTriangle} small />
            </div>
            <h3 className="font-semibold mb-3" style={{ color: NAVY }}>Recent Applications</h3>
            <ApplicationsTable apps={myApps} />
          </>
        )}
        {tab === "applications" && <ApplicationsTable apps={applications} />}
        {tab !== "overview" && tab !== "applications" && (
          <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-sm text-slate-400">
            {menu.find(m => m.id === tab)?.label} content will appear here once connected to your account.
          </div>
        )}
      </div>
    </section>
  );
}

function DashCard({ label, value, icon: Icon, small }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: "rgba(11,31,58,0.06)" }}>
        <Icon size={16} style={{ color: NAVY }} />
      </div>
      <div className={`font-display font-semibold ${small ? "text-base" : "text-2xl"}`} style={{ color: NAVY }}>{value}</div>
      <div className="text-xs text-slate-400 mt-1">{label}</div>
    </div>
  );
}

function ApplicationsTable({ apps }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100">
      <table className="w-full text-sm min-w-[600px]">
        <thead><tr style={{ backgroundColor: MIST }}>
          {["Application ID", "Loan Type", "Amount", "Status", "Date"].map(h => (
            <th key={h} className="p-3.5 text-left text-xs font-semibold text-slate-500">{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {apps.map(a => (
            <tr key={a.id} className="border-t border-slate-100">
              <td className="p-3.5 font-medium" style={{ color: NAVY }}>{a.id}</td>
              <td className="p-3.5 text-slate-500">{a.loanType}</td>
              <td className="p-3.5 text-slate-500">{fmtINR(a.amount)}</td>
              <td className="p-3.5"><Badge status={a.status} /></td>
              <td className="p-3.5 text-slate-400">{a.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------------- ADMIN DASHBOARD ------------------------------ */
function AdminView({ applications, updateApplicationStatus }) {
  const [tab, setTab] = useState("dashboard");
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "applications", label: "Applications" },
    { id: "customers", label: "Customers" },
    { id: "documents", label: "Documents" },
    { id: "consultants", label: "Consultants" },
    { id: "products", label: "Loan Products" },
    { id: "reports", label: "Reports" },
  ];

  const counts = useMemo(() => {
    const c = { Total: applications.length, "New": 0, "Under Review": 0, Approved: 0, Rejected: 0, Disbursed: 0, "Pending Documents": 0 };
    applications.forEach(a => {
      if (a.status === "Submitted") c["New"]++;
      if (a.status === "Under Review" || a.status === "Documents Under Review" || a.status === "Eligibility Verification" || a.status === "Lender Review") c["Under Review"]++;
      if (a.status === "Approved") c.Approved++;
      if (a.status === "Rejected") c.Rejected++;
      if (a.status === "Disbursed") c.Disbursed++;
      if (a.status === "Documents Required") c["Pending Documents"]++;
    });
    return c;
  }, [applications]);

  const monthly = [
    { month: "Mar", applications: 42 }, { month: "Apr", applications: 55 }, { month: "May", applications: 61 },
    { month: "Jun", applications: 48 }, { month: "Jul", applications: 70 }, { month: "Aug", applications: 58 + applications.length },
  ];

  return (
    <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold" style={{ color: NAVY }}>Admin Panel</h1>
          <p className="text-sm text-slate-400">Internal view — demo data only.</p>
        </div>
      </div>

      <div className="flex gap-2 mb-8 border-b border-slate-100 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px"
            style={{ borderColor: tab === t.id ? TEAL : "transparent", color: tab === t.id ? NAVY : "#94A3B8" }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "dashboard" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Object.entries(counts).map(([label, value]) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="font-display text-2xl font-semibold" style={{ color: NAVY }}>{value}</div>
              <div className="text-xs text-slate-400 mt-1">{label} Applications</div>
            </div>
          ))}
        </div>
      )}

      {tab === "applications" && (
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-sm min-w-[820px]">
            <thead><tr style={{ backgroundColor: NAVY }}>
              {["ID", "Applicant", "Loan Type", "Amount", "Consultant", "Status", "Update"].map(h => (
                <th key={h} className="p-3.5 text-left text-xs font-semibold text-white">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {applications.map((a, i) => (
                <tr key={a.id} style={{ backgroundColor: i % 2 ? "white" : MIST }}>
                  <td className="p-3.5 font-medium" style={{ color: NAVY }}>{a.id}</td>
                  <td className="p-3.5 text-slate-500">{a.name}</td>
                  <td className="p-3.5 text-slate-500">{a.loanType}</td>
                  <td className="p-3.5 text-slate-500">{fmtINR(a.amount)}</td>
                  <td className="p-3.5 text-slate-500">{a.consultant}</td>
                  <td className="p-3.5"><Badge status={a.status} /></td>
                  <td className="p-3.5">
                    <select className="text-xs border border-slate-200 rounded-lg px-2 py-1.5" value={a.status}
                      onChange={e => updateApplicationStatus(a.id, e.target.value)}>
                      {["Submitted", "Under Review", "Documents Required", "Approved", "Rejected", "Disbursed"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "customers" && (
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-sm min-w-[600px]">
            <thead><tr style={{ backgroundColor: MIST }}>
              {["Name", "Mobile", "Applications", "Last Activity"].map(h => <th key={h} className="p-3.5 text-left text-xs font-semibold text-slate-500">{h}</th>)}
            </tr></thead>
            <tbody>
              {applications.map(a => (
                <tr key={a.id} className="border-t border-slate-100">
                  <td className="p-3.5 font-medium" style={{ color: NAVY }}>{a.name}</td>
                  <td className="p-3.5 text-slate-500">{a.mobile}</td>
                  <td className="p-3.5 text-slate-500">1</td>
                  <td className="p-3.5 text-slate-400">{a.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "documents" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map(a => (
            <div key={a.id} className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="font-semibold text-sm mb-1" style={{ color: NAVY }}>{a.id}</div>
              <div className="text-xs text-slate-400 mb-3">{a.name}</div>
              <div className="flex flex-wrap gap-1.5">
                {REQUIRED_DOCS.slice(0, 4).map(d => (
                  <span key={d.key} className="text-[10px] px-2 py-1 rounded-full" style={{ backgroundColor: MIST, color: "#475569" }}>{d.label}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "consultants" && (
        <div className="grid sm:grid-cols-3 gap-4">
          {[{ name: "S. Rao", load: 6 }, { name: "A. Nair", load: 4 }, { name: "K. Verma", load: 9 }].map(c => (
            <div key={c.name} className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="font-semibold text-sm" style={{ color: NAVY }}>{c.name}</div>
              <div className="text-xs text-slate-400 mt-1">{c.load} active applications</div>
            </div>
          ))}
        </div>
      )}

      {tab === "products" && (
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-sm min-w-[760px]">
            <thead><tr style={{ backgroundColor: MIST }}>
              {["Loan Type", "Indicative Rate", "Max Amount", "Tenure", "Processing Fee"].map(h => <th key={h} className="p-3.5 text-left text-xs font-semibold text-slate-500">{h}</th>)}
            </tr></thead>
            <tbody>
              {LOAN_CATEGORIES.map(c => (
                <tr key={c.id} className="border-t border-slate-100">
                  <td className="p-3.5 font-medium" style={{ color: NAVY }}>{c.name}</td>
                  <td className="p-3.5 text-slate-500">{c.rate}</td>
                  <td className="p-3.5 text-slate-500">Varies by lender</td>
                  <td className="p-3.5 text-slate-500">Varies by lender</td>
                  <td className="p-3.5 text-slate-500">Up to 2.5%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "reports" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-semibold mb-4 text-sm" style={{ color: NAVY }}>Applications per Month</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} />
                <RTooltip /><Bar dataKey="applications" fill={TEAL} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-semibold mb-4 text-sm" style={{ color: NAVY }}>Loan Type Distribution</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={LOAN_CATEGORIES.map((c, i) => ({ name: c.name, value: [30, 25, 15, 10, 12, 8][i] }))} dataKey="value" nameKey="name" outerRadius={90}>
                  {LOAN_CATEGORIES.map((c, i) => <Cell key={c.id} fill={[NAVY, TEAL, "#4B7BAF", "#6BC2B0", "#2A4A78", "#89D2C2"][i]} />)}
                </Pie>
                <RTooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </section>
  );
}

/* --------------------------------- CIBIL -------------------------------------- */
function CibilScoreView({ navTo, startApplication, goHomeAndScroll }) {
  const [form, setForm] = useState({ name: "", mobile: "", email: "", pan: "", consent: false });
  const [checking, setChecking] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const check = async (e) => {
    e.preventDefault();

    if (!form.consent) {
      alert("Please authorize the CIBIL check.");
      return;
    }

    setChecking(true);

    try {
      const { data, error } = await supabase
        .from("cibil_requests")
        .insert({
          full_name: form.name,
          mobile: form.mobile,
          email: form.email,
          pan: form.pan.toUpperCase(),
          consent: form.consent,
          status: "pending",
        });

      if (error) {
        console.error("Supabase CIBIL error:", error);
        alert("Submission failed: " + error.message);
        return;
      }

      console.log("CIBIL request submitted:", data);
      alert("CIBIL request submitted successfully!");
      setSubmitted(true);

    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div>
      {/* Hero Section with High Visibility Background */}
      <section className="relative overflow-hidden py-24 lg:py-36 bg-[#0B1F3A]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1600&q=80"
            alt="Credit Analysis Background"
            className="w-full h-full object-cover"
            style={{ opacity: 1.0 }}
          />
          <div className="absolute inset-0 bg-[#0B1F3A]/35" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1F3A]/90 via-transparent to-[#0B1F3A]/90" />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/50 transition-all hover:bg-white/45">
            <button onClick={() => navTo("home")} className="text-[11px] font-bold text-white hover:text-white transition-colors uppercase tracking-widest">Home</button>
            <span className="text-[11px] font-bold text-white/50">/</span>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">Check CIBIL</span>
          </div>
          <h1 className="font-display text-white text-4xl sm:text-6xl font-semibold mb-6">Check Your CIBIL Score</h1>
          <p className="text-white text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
            Your CIBIL score decides loan approval, interest rate, and sanction amount.
            Understand where you stand — with free guidance from MANDANI ASSOCIATE.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <PrimaryButton onClick={() => {
              const el = document.getElementById("check-form");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }} className="!rounded-full px-8 shadow-xl">Request free assistance</PrimaryButton>
            <button onClick={() => goHomeAndScroll("contact")} className="px-8 py-3 rounded-full border border-white/70 text-white font-semibold hover:bg-white/5 transition-colors backdrop-blur-sm">
              Speak to an advisor
            </button>
          </div>
        </div>
      </section>

      {/* Ranges and Assistance Section */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start">
          {/* Left: Ranges */}
          <ScrollReveal direction="left">
          <div>
            <div className="mb-10">
              <span className="inline-block px-3 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase mb-4" style={{ backgroundColor: "rgba(184,132,46,0.1)", color: TEAL_DARK }}>Score Guide</span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4" style={{ color: NAVY }}>CIBIL score ranges explained</h2>
              <p className="text-slate-500">Where you fall on the scale affects how lenders view your application.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { range: "300 – 549", label: "POOR", color: "#EF4444", text: "High rejection risk. Lenders may decline or ask for stronger security." },
                { range: "550 – 649", label: "FAIR", color: "#F59E0B", text: "Limited options. Approval possible with higher interest or lower amount." },
                { range: "650 – 749", label: "GOOD", color: "#3B82F6", text: "Most lenders consider you. Reasonable rates and faster processing." },
                { range: "750 – 900", label: "EXCELLENT", color: TEAL, text: "Best offers — lowest rates, highest sanction, and quick disbursal." },
              ].map(r => (
                <div key={r.label} className="bg-white/45 backdrop-blur-sm p-6 rounded-2xl border-2 border-slate-200/60 shadow-lg hover:shadow-xl transition-all">
                  <div className="text-xl font-bold mb-1" style={{ color: NAVY }}>{r.range}</div>
                  <div className="text-xs font-extrabold tracking-widest mb-3" style={{ color: r.color }}>{r.label}</div>
                  <p className="text-sm text-slate-500 leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
          </ScrollReveal>

          {/* Right: Assistance Box */}
          <ScrollReveal direction="right">
          <div className="bg-white/55 backdrop-blur-xl rounded-3xl border-2 border-slate-200/60 shadow-2xl p-8 sm:p-10 sticky top-24">
            <div className="space-y-6">
              <Field label="Loan you are planning">
                <select className={inputCls}>
                  {LOAN_CATEGORIES.map(c => <option key={c.id}>{c.name}</option>)}
                </select>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(184,132,46,0.08)" }}>
                    <CheckCircle2 size={14} style={{ color: TEAL }} />
                  </span>
                  <div className="text-[11px] leading-tight text-slate-500">
                    <strong className="block text-slate-700">Free consultation</strong> no charges for CIBIL guidance
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(59,130,246,0.08)" }}>
                    <Clock size={14} style={{ color: "#3B82F6" }} />
                  </span>
                  <div className="text-[11px] leading-tight text-slate-500">
                    <strong className="block text-slate-700">Quick callback</strong> within 24 working hours
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(15,23,42,0.08)" }}>
                    <Building2 size={14} style={{ color: NAVY }} />
                  </span>
                  <div className="text-[11px] leading-tight text-slate-500">
                    <strong className="block text-slate-700">30+ partners</strong> banks & NBFCs across India
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(184,132,46,0.08)" }}>
                    <Shield size={14} style={{ color: TEAL }} />
                  </span>
                  <div className="text-[11px] leading-tight text-slate-500">
                    <strong className="block text-slate-700">Confidential</strong> your details stay private & secure
                  </div>
                </div>
              </div>

              <PrimaryButton full className="!rounded-full !py-4 shadow-lg shadow-amber-500/20" onClick={() => {
                const el = document.getElementById("check-form");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}>
                Submit for CIBIL assistance
              </PrimaryButton>
            </div>
          </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Check Form Section */}
      <section id="check-form" className="bg-slate-50 py-20 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
            <div className="p-8 sm:p-10">
              <h2 className="font-display text-2xl font-semibold mb-2" style={{ color: NAVY }}>Check Your Score Free</h2>
              <p className="text-slate-500 text-sm mb-8">Get your detailed credit report and expert advice.</p>

              {submitted ? (
                <div className="text-center py-10 fade-up">
                  <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} style={{ color: TEAL }} />
                  </div>
                  <h3 className="font-semibold text-xl mb-2" style={{ color: NAVY }}>Request Received!</h3>
                  <p className="text-sm text-slate-500 mb-8">Our expert team will analyze your profile and contact you with your CIBIL assessment shortly.</p>
                  <PrimaryButton full onClick={() => startApplication(null)}>Apply for Loan Now</PrimaryButton>
                  <button onClick={() => setSubmitted(false)} className="mt-4 text-sm font-semibold text-slate-400 underline decoration-dotted">Check Another Profile</button>
                </div>
              ) : (
                <form onSubmit={check} className="space-y-5">
                  <Field label="Full Name"><input required className={inputCls} placeholder="As per PAN card" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></Field>
                  <Field label="Mobile Number"><input required className={inputCls} placeholder="10-digit number" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} /></Field>
                  <Field label="Email Address"><input required type="email" className={inputCls} placeholder="example@mail.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></Field>
                  <Field label="PAN Card Number"><input required className={inputCls} placeholder="ABCDE1234F" value={form.pan} onChange={e => setForm({...form, pan: e.target.value})} /></Field>
                  <label className="flex items-start gap-3 cursor-pointer py-2">
                    <input type="checkbox" required checked={form.consent} onChange={e => setForm({...form, consent: e.target.checked})} className="mt-1" />
                    <span className="text-xs text-slate-500 leading-relaxed">
                      I authorize MANDANI ASSOCIATE to pull my credit report and contact me regarding my loan eligibility.
                    </span>
                  </label>
                  <PrimaryButton type="submit" full className={checking ? "opacity-70" : ""}>
                    {checking ? "Checking Score..." : "Get My CIBIL Score"}
                  </PrimaryButton>
                </form>
              )}
            </div>
            <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
              <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
                <Shield size={13} className="text-amber-600" /> Your data is 100% secure and encrypted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Factors Section */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 border-t border-slate-100">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <SectionEyebrow>Score Factors</SectionEyebrow>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold" style={{ color: NAVY }}>What affects your CIBIL score?</h2>
          <p className="text-slate-500 mt-4 text-sm">Understanding these key factors can help you manage and improve your credit health effectively.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Clock3, title: "Repayment history", text: "On-time EMIs and credit card payments build trust. Missed or delayed payments lower your score." },
            { icon: Wallet, title: "Credit utilisation", text: "Using too much of your credit limit regularly can signal financial stress to lenders." },
            { icon: Search, title: "Hard enquiries", text: "Too many loan applications in a short period can temporarily reduce your score." },
            { icon: Layers, title: "Credit mix", text: "A healthy mix of secured (home, LAP) and unsecured (personal) credit shows balanced borrowing." },
            { icon: Hourglass, title: "Credit age", text: "Longer credit history with consistent repayment strengthens your profile over time." },
            { icon: FileText, title: "Outstanding dues", text: "Unsettled defaults, write-offs, or overdue accounts stay on your report and hurt approvals." },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="p-8 rounded-2xl border-2 border-slate-200/60 bg-white/45 backdrop-blur-sm hover:border-amber-500/30 transition-colors group shadow-lg">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors" style={{ backgroundColor: "rgba(11,31,58,0.04)" }}>
                  <Icon size={22} style={{ color: NAVY }} className="group-hover:text-amber-600 transition-colors" />
                </div>
                <h3 className="font-semibold text-lg mb-3" style={{ color: NAVY }}>{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/55 backdrop-blur-sm p-8 rounded-2xl border-2 border-slate-200/60 shadow-xl">
              <TrendingUp className="mb-4" style={{ color: TEAL }} />
              <h3 className="font-semibold mb-2" style={{ color: NAVY }}>Improve Your Score</h3>
              <p className="text-sm text-slate-500">Get personalized tips from our experts on how to boost your credit score over time.</p>
            </div>
            <div className="bg-white/55 backdrop-blur-sm p-8 rounded-2xl border-2 border-slate-200/60 shadow-xl">
              <Shield className="mb-4" style={{ color: TEAL }} />
              <h3 className="font-semibold mb-2" style={{ color: NAVY }}>Sanction Amount</h3>
              <p className="text-sm text-slate-500">A better CIBIL score helps you secure higher loan amounts for your needs.</p>
            </div>
            <div className="bg-white/55 backdrop-blur-sm p-8 rounded-2xl border-2 border-slate-200/60 shadow-xl">
              <Briefcase className="mb-4" style={{ color: TEAL }} />
              <h3 className="font-semibold mb-2" style={{ color: NAVY }}>Loan Optimization</h3>
              <p className="text-sm text-slate-500">We help you choose lenders that favor your specific credit profile to ensure approval.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* --------------------------------- LEGAL -------------------------------------- */
function LegalView({ type, setType }) {
  const content = LEGAL_CONTENT[type];
  return (
    <PageShell eyebrow="Legal" title={content.title} subtitle="">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(LEGAL_CONTENT).map(([k, v]) => (
            <button key={k} onClick={() => setType(k)}
              className="px-4 py-2 rounded-full text-xs font-semibold border"
              style={{ borderColor: type === k ? TEAL : "#E2E8F0", color: type === k ? TEAL_DARK : "#64748B", backgroundColor: type === k ? "rgba(14,154,135,0.08)" : "white" }}>
              {v.title}
            </button>
          ))}
        </div>
        <p className="text-slate-500 leading-relaxed">{content.body}</p>
      </div>
    </PageShell>
  );
}

/* -------------------------------- Page shell ----------------------------------- */
function PageShell({ eyebrow, title, subtitle, children }) {
  return (
    <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-14">
      {(title || eyebrow) && (
        <div className="text-center max-w-2xl mx-auto mb-12">
          {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
          {title && <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-3" style={{ color: NAVY }}>{title}</h1>}
          {subtitle && <p className="text-slate-500">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

/* ---------------------------------- Footer -------------------------------------- */
function Footer({ navTo, goHomeAndScroll, setLegalType }) {
  const openLegal = (type) => { setLegalType(type); navTo("legal"); };
  return (
    <footer style={{ backgroundColor: NAVY }} className="text-slate-300 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 grid sm:grid-cols-2 lg:grid-cols-[1.2fr_0.7fr_0.7fr_0.7fr_1.8fr] gap-12">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center border border-white/10 shadow-2xl p-1">
              <img
                src="/mandanilogo.png"
                alt="Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden flex-col items-center justify-center text-[#B8842E]">
                 <HomeIcon size={24} strokeWidth={2.5} />
                 <div className="text-[5px] font-black">MA</div>
              </div>
            </div>
            <div className="text-left">
              <span className="block font-display font-bold text-2xl tracking-tight leading-none" style={{ color: GOLD_LIGHT }}>MANDANI</span>
              <span className="block text-[10px] font-black tracking-[0.25em] uppercase mt-1 text-white">Associate</span>
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-8 max-w-xs leading-relaxed">Loans Made Simple. Your trusted partner in financial growth and stable future.</p>
          <div className="flex gap-4">
            {[
              { icon: Phone, href: "tel:+916352243073" },
              { icon: MessageCircle, href: "https://wa.me/916352243073" },
              { icon: Instagram, href: "https://www.instagram.com/mandani_associate/" },
              { icon: Facebook, href: "#" }
            ].map((social, i) => (
              <a key={i} href={social.href} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-[#E2C16B] hover:text-[#0B1F3A] hover:border-[#E2C16B] transition-all duration-300">
                <social.icon size={18} fill={social.icon === Phone || social.icon === Instagram ? "none" : "currentColor"} />
              </a>
            ))}
          </div>
        </div>

        <FooterCol title="Services" items={LOAN_CATEGORIES.map(c => c.name)} onClick={() => goHomeAndScroll("loans")} />

        <FooterCol title="Company" items={["About Us", "Contact", "CIBIL", "Careers", "FAQs"]} onClick={(it) => {
          if (it === "About Us") navTo("about");
          else if (it === "Contact") goHomeAndScroll("contact");
          else if (it === "CIBIL") navTo("cibil");
          else if (it === "FAQs") goHomeAndScroll("contact");
        }} />

        <FooterCol title="Legal" items={["Privacy Policy", "Terms & Conditions", "Disclaimer", "Cookie Policy"]} onClick={(it) => {
          const map = { "Privacy Policy": "privacy", "Terms & Conditions": "terms", "Disclaimer": "disclaimer", "Cookie Policy": "cookie" };
          openLegal(map[it]);
        }} />

        <div>
          <h4 className="font-bold text-sm mb-8 uppercase tracking-widest" style={{ color: GOLD_LIGHT }}>Contact Us</h4>
          <ul className="space-y-6">
            <li className="flex items-center gap-4 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-900 shadow-xl shadow-amber-500/10" style={{ backgroundColor: GOLD_LIGHT }}>
                <Phone size={14} />
              </div>
              <div className="text-sm font-medium">
                <a href="tel:+916352243073" className="hover:text-amber-400 transition-colors">+91 6352243073</a> ,
                <a href="tel:+919979043073" className="hover:text-amber-400 transition-colors ml-1">+91 99790 43073</a>
              </div>
            </li>
            <li className="flex items-center gap-4 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-900 shadow-xl shadow-amber-500/10" style={{ backgroundColor: GOLD_LIGHT }}>
                <Mail size={14} />
              </div>
              <a href="mailto:loan.mandaniassociate@gmail.com" className="text-sm font-medium hover:text-amber-400 transition-colors">loan.mandaniassociate@gmail.com</a>
            </li>
            <li className="flex items-start gap-4 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-900 shadow-xl shadow-amber-500/10 mt-1" style={{ backgroundColor: GOLD_LIGHT }}>
                <MapPin size={14} />
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=D-2008%2C+2nd+Floor%2C+Central+Bazar%2C+Minibazar%2C+Varachha+Main+Road%2C+Surat-395006" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-amber-400 transition-colors leading-relaxed">
                D-2008, 2nd Floor, Central Bazar, Minibazar, Varachha Main Road, Surat-395006.
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <span>© 2026 MANDANI ASSOCIATE. All Rights Reserved.</span>
          <div className="flex items-center gap-6">
            <button onClick={() => openLegal("consent")} className="hover:text-white transition-colors">Consent Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items, onClick }) {
  return (
    <div>
      <h4 className="font-bold text-sm mb-8 uppercase tracking-widest" style={{ color: GOLD_LIGHT }}>{title}</h4>
      <ul className="space-y-4">
        {items.map(it => (
          <li key={it}>
            <button onClick={() => onClick(it)} className="text-sm text-slate-400 hover:text-white hover:translate-x-1 transition-all text-left">
              {it}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
