import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import Features from "@/components/site/Features";
import Subjects from "@/components/site/Subjects";
import Pricing from "@/components/site/Pricing";
import Faq from "@/components/site/Faq";
import Reviews from "@/components/site/Reviews";
import Footer from "@/components/site/Footer";

// The full AI Doctor product (Firebase login, quiz, flashcards, AI) is the
// self-contained static app served from /app/. The marketing landing lives here.
const APP_LOGIN = "/app/index.html#login";
const APP_SIGNUP = "/app/index.html#signup";

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

  const goLogin = useCallback(() => { window.location.assign(APP_LOGIN); }, []);
  const goSignup = useCallback(() => { window.location.assign(APP_SIGNUP); }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--tx)]">
      <Navbar theme={theme} toggleTheme={toggle} onLogin={goLogin} onSignup={goSignup} />
      <main>
        <Hero onSignup={goSignup} onLogin={goLogin} />
        <Features />
        <Subjects />
        <Pricing onSignup={goSignup} />
        <Reviews onSignup={goSignup} />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
