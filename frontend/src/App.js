import { useEffect, useState, useCallback } from "react";
import { Toaster } from "sonner";
import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import Features from "@/components/site/Features";
import Subjects from "@/components/site/Subjects";
import Pricing from "@/components/site/Pricing";
import Faq from "@/components/site/Faq";
import Reviews from "@/components/site/Reviews";
import Footer from "@/components/site/Footer";
import SignupDialog from "@/components/site/SignupDialog";

function useTheme() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("aid_theme") || "dark"; } catch { return "dark"; }
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("aid_theme", theme); } catch { /* ignore */ }
  }, [theme]);
  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  return { theme, toggle };
}

export default function App() {
  const { theme, toggle } = useTheme();
  const [dialog, setDialog] = useState({ open: false, mode: "signup" });

  const openSignup = useCallback(() => setDialog({ open: true, mode: "signup" }), []);
  const openLogin = useCallback(() => setDialog({ open: true, mode: "login" }), []);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--tx)]">
      <Navbar theme={theme} toggleTheme={toggle} onLogin={openLogin} onSignup={openSignup} />
      <main>
        <Hero onSignup={openSignup} onLogin={openLogin} />
        <Features />
        <Subjects />
        <Pricing onSignup={openSignup} />
        <Reviews onSignup={openSignup} />
        <Faq />
      </main>
      <Footer />

      <SignupDialog
        open={dialog.open}
        mode={dialog.mode}
        onOpenChange={(v) => setDialog((d) => ({ ...d, open: v }))}
      />
      <Toaster position="top-center" theme={theme} richColors closeButton />
    </div>
  );
}
