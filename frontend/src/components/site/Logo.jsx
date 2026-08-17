// Brand logo for AI Doctor — uses the user-provided artwork.
// variant="mark" -> neural head only (nav/dialog). variant="full" -> full lockup (footer).
const PUB = process.env.PUBLIC_URL || "";

export default function LogoMark({ className = "h-9 w-auto", variant = "mark", alt = "AI Doctor" }) {
  const src = variant === "full" ? `${PUB}/aidoctor-logo.png` : `${PUB}/aidoctor-mark.png`;
  return <img src={src} alt={alt} className={className} draggable={false} />;
}
