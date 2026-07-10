import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Activity, CheckCircle2 } from "lucide-react";
import { joinWaitlist } from "./api";
import { YEAR_OPTIONS, EXAM_OPTIONS } from "./content";

export default function SignupDialog({ open, onOpenChange, mode = "signup" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [year, setYear] = useState("");
  const [exam, setExam] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const isLogin = mode === "login";

  async function submit(e) {
    e.preventDefault();
    if (!email) { toast.error("Please enter your email"); return; }
    setLoading(true);
    try {
      await joinWaitlist({ name: name || null, email, year: year || null, exam: exam || null });
      setDone(true);
      toast.success("You're on the list! We'll email your early access.");
    } catch (err) {
      const msg = err?.response?.data?.detail || "Something went wrong. Try again.";
      toast.error(typeof msg === "string" ? msg : "Please enter a valid email");
    } finally { setLoading(false); }
  }

  function reset() {
    onOpenChange(false);
    setTimeout(() => { setDone(false); setName(""); setEmail(""); setYear(""); setExam(""); }, 300);
  }

  const fieldCls = "border-[var(--bd2)] bg-[var(--surface2)] text-[var(--tx)]";

  return (
    <Dialog open={open} onOpenChange={reset}>
      <DialogContent data-testid="signup-dialog" className="crystal border-[var(--bd)] text-[var(--tx)] sm:max-w-[440px]">
        {done ? (
          <div className="py-6 text-center" data-testid="signup-success">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--emerald)]/15">
              <CheckCircle2 className="h-7 w-7 text-[var(--emerald)]" />
            </div>
            <h3 className="font-h text-2xl font-extrabold tracking-tight">You&apos;re in, future doctor.</h3>
            <p className="mt-2 text-sm text-[var(--tx2)]">
              We saved <span className="text-[var(--cyan)]">{email}</span>. Watch your inbox for your early-access link and free study credits.
            </p>
            <button onClick={reset} data-testid="signup-close-btn" className="btn-white mt-6 w-full rounded-full py-3 text-sm font-bold">Done</button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="mb-1 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--cyan)] to-[var(--emerald)]">
                  <Activity className="h-5 w-5 text-black" strokeWidth={2.5} />
                </div>
                <span className="font-h text-lg font-extrabold tracking-tight">AI Doctor</span>
              </div>
              <DialogTitle className="font-h text-2xl font-extrabold tracking-tight">
                {isLogin ? "Welcome back, doctor-in-training" : "Start studying for free"}
              </DialogTitle>
              <DialogDescription className="text-[var(--tx2)]">
                {isLogin ? "Enter your email to get your access link." : "Join thousands of med students. No card required."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={submit} className="space-y-3 pt-1">
              {!isLogin && (
                <div className="space-y-1.5">
                  <Label htmlFor="su-name" className="text-xs text-[var(--tx2)]">Name</Label>
                  <Input id="su-name" data-testid="signup-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Kim" className={fieldCls} />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="su-email" className="text-xs text-[var(--tx2)]">Email</Label>
                <Input id="su-email" type="email" required data-testid="signup-email-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@med.school" className={fieldCls} />
              </div>
              {!isLogin && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-[var(--tx2)]">Year</Label>
                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger data-testid="signup-year-select" className={fieldCls}><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{YEAR_OPTIONS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-[var(--tx2)]">Exam</Label>
                    <Select value={exam} onValueChange={setExam}>
                      <SelectTrigger data-testid="signup-exam-select" className={fieldCls}><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{EXAM_OPTIONS.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <button type="submit" disabled={loading} data-testid="signup-submit-btn" className="btn-white flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold disabled:opacity-70">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLogin ? "Send my access link" : "Claim free access"}
              </button>
              <p className="text-center text-[11px] text-[var(--tx3)]">By continuing you agree to our terms. We never sell your data.</p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
