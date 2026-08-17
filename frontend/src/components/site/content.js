import {
  Stethoscope, Pill, Bone, ClipboardList, Microscope, Layers,
  Gamepad2, Zap, Activity, FlaskConical, Bug, Scissors,
} from "lucide-react";

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Subjects", href: "#subjects" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export const FEATURES = [
  { icon: Stethoscope, title: "Clinical Case Solver", desc: "Give a patient case — AI walks you through diagnosis, differentials, and management step by step." },
  { icon: Pill, title: "Drug Mnemonics Mode", desc: "Memorable mnemonics for drug names, mechanisms, side effects and contraindications." },
  { icon: Bone, title: "Anatomy Explainer", desc: "Structures, relations, blood supply and nerve supply — with clinical correlations." },
  { icon: ClipboardList, title: "Exam Prep Mode", desc: "USMLE Step 1/2, PLAB and OSCE style answers — exactly what examiners want to see." },
  { icon: Microscope, title: "Pathology Mode", desc: "Disease mechanisms, morphology, clinical features and complications, explained clearly." },
  { icon: Layers, title: "Flashcard Maker", desc: "Upload lecture notes and AI builds medical flashcards optimized for spaced repetition." },
  { icon: Gamepad2, title: "Quiz Mode", desc: "MCQ practice in USMLE/PLAB format with detailed explanations for every option." },
  { icon: Zap, title: "Exam Cram", desc: "Last-minute high-yield points, must-know facts and memory tricks before your exam." },
];

export const SUBJECTS = [
  { icon: Bone, title: "Anatomy", desc: "Gross · neuro · embryo" },
  { icon: Activity, title: "Physiology", desc: "Systems & mechanisms" },
  { icon: FlaskConical, title: "Biochemistry", desc: "Metabolism & pathways" },
  { icon: Pill, title: "Pharmacology", desc: "Drugs & mechanisms" },
  { icon: Microscope, title: "Pathology", desc: "Disease processes" },
  { icon: Bug, title: "Microbiology", desc: "Bacteria · viruses · fungi" },
  { icon: Stethoscope, title: "Clinical Medicine", desc: "Diagnosis & management" },
  { icon: Scissors, title: "Surgery", desc: "Surgical principles" },
];

export const PRICING = {
  free: {
    name: "Free",
    amount: "$0",
    period: "Forever free",
    features: ["5 questions per day", "Basic explanations", "Anatomy & Physiology", "Basic Flashcards"],
  },
  pro: {
    name: "Pro",
    amount: "$2.99",
    per: "/mo",
    period: "cancel anytime",
    features: [
      "Unlimited questions", "All 8 subjects", "Clinical Case Solver",
      "Drug Mnemonics Mode", "USMLE / PLAB Prep", "Exam Cram Mode", "Unlimited Flashcards",
    ],
  },
};

export const FAQS = [
  { q: "What year of med school is this for?", a: "AI Doctor covers all years — from Year 1 pre-clinical (Anatomy, Physiology, Biochemistry) to clinical years (Medicine, Surgery, Pediatrics). The AI adapts its explanation depth based on the topic." },
  { q: "Does it support USMLE and PLAB format?", a: "Yes. Exam Prep Mode gives answers in USMLE Step 1/2 and PLAB format, and Quiz Mode generates MCQs in exam-style format with detailed explanations." },
  { q: "What is the Clinical Case Solver?", a: "You describe a patient case and the AI walks you through the diagnosis, differential diagnoses, investigations and management plan — perfect for OSCE and clinical exam prep." },
  { q: "How is this different from a generic AI chatbot?", a: "AI Doctor is tuned specifically for medical education. Every subject, mode and explanation is designed for MBBS/nursing students with proper medical terminology and clinical relevance." },
];

// Default reviews shipped with the bundle so the landing renders fully even when
// the (optional) backend is unavailable — e.g. frontend-only hosts like Vercel.
export const DEFAULT_REVIEWS = [
  { id: "r1", name: "Aisha Khan", role: "MBBS · Year 3", rating: 5, text: "The Clinical Case Solver is unreal. It walks through differentials the exact way our examiners want. My OSCE prep went from panic to confidence." },
  { id: "r2", name: "Daniel Osei", role: "USMLE Step 1", rating: 5, text: "I upload my lecture notes and get high-yield flashcards in seconds — spaced repetition built in. This replaced three other apps for me." },
  { id: "r3", name: "Priya Nair", role: "NEET PG", rating: 5, text: "Pharmacology mnemonics that actually stick. I finally stopped confusing my beta blockers. Worth way more than the price." },
  { id: "r4", name: "Liam Walsh", role: "PLAB Candidate", rating: 5, text: "Exam Prep Mode answers in proper PLAB format. It's like having a tutor who knows exactly what the exam wants to see." },
  { id: "r5", name: "Sofia Rossi", role: "Nursing · Year 2", rating: 5, text: "Explanations are clear without being dumbed down. The anatomy explainer with clinical correlations is my favorite feature." },
  { id: "r6", name: "Marcus Lee", role: "MBBS · Year 1", rating: 5, text: "Pathology finally makes sense — disease mechanisms explained step by step. I study faster and remember more." },
];

export const GUMROAD_URL = "https://hyperai3.gumroad.com/l/aidoctorstudypro";
export const STUDENT_CODE = "MED20";
export const CONTACT_EMAIL = "aidoctorstudy@gmail.com";

export const YEAR_OPTIONS = ["Pre-clinical (Yr 1–2)", "Clinical (Yr 3–5)", "Intern / Resident", "Nursing", "Other"];
export const EXAM_OPTIONS = ["MBBS / University", "USMLE", "PLAB", "NEET PG", "Not sure yet"];
