// Decorative frosted-glass sheets behind the page (hidden on phones via CSS).
export default function GlassBackdrop() {
  return (
    <div aria-hidden="true">
      <div className="gsheet" style={{ left: -120, top: "38vh", width: 520, height: 380, transform: "rotate(-12deg)" }} />
      <div className="gsheet" style={{ right: -140, top: "6vh", width: 460, height: 320, transform: "rotate(14deg)" }} />
      <div className="gsheet" style={{ right: -100, top: "70vh", width: 480, height: 340, transform: "rotate(-8deg)" }} />
    </div>
  );
}
