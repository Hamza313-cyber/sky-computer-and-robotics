// Decorative frosted-glass sheets and bubbles behind the page. Purely visual, hidden from screen readers.
export default function GlassBackdrop() {
  return (
    <div aria-hidden="true">
      <div className="gsheet" style={{ left: -140, top: "34vh", width: 540, height: 380, transform: "rotate(-12deg)" }} />
      <div className="gsheet" style={{ right: -160, top: "4vh", width: 480, height: 330, transform: "rotate(14deg)" }} />
      <div className="gsheet hide-sm" style={{ right: -120, top: "66vh", width: 500, height: 340, transform: "rotate(-7deg)" }} />
      <div className="gsheet hide-sm" style={{ left: "38vw", top: "82vh", width: 420, height: 260, transform: "rotate(9deg)" }} />
      <div className="gbubble hide-sm" style={{ left: "46vw", top: "14vh", width: 170, height: 170 }} />
      <div className="gbubble" style={{ left: "6vw", top: "78vh", width: 110, height: 110 }} />
      <div className="gbubble hide-sm" style={{ right: "22vw", top: "52vh", width: 70, height: 70 }} />
    </div>
  );
}
