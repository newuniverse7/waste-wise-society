import confetti from "canvas-confetti";

const ECO_COLORS = ["#10b981", "#5cbdb9", "#a7f3d0", "#34d399", "#064e3b"];

export function celebrate(intensity: "small" | "medium" | "large" = "medium") {
  const counts = { small: 60, medium: 120, large: 220 };
  const count = counts[intensity];

  confetti({
    particleCount: count,
    spread: 75,
    origin: { y: 0.6 },
    colors: ECO_COLORS,
    scalar: 0.9,
  });

  if (intensity !== "small") {
    setTimeout(() => {
      confetti({
        particleCount: count / 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ECO_COLORS,
      });
      confetti({
        particleCount: count / 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ECO_COLORS,
      });
    }, 200);
  }
}

export function badgeUnlock() {
  const duration = 1500;
  const end = Date.now() + duration;
  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ECO_COLORS,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ECO_COLORS,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
