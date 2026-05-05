import { useEffect, useRef, useState } from "react";
import "./StatCard.css";

const colorMap = {
  emerald: { gradient: "linear-gradient(135deg, #059669, #10b981)", glow: "rgba(5, 150, 105, 0.35)" },
  teal: { gradient: "linear-gradient(135deg, #14b8a6, #2dd4bf)", glow: "rgba(20, 184, 166, 0.35)" },
  gold: { gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)", glow: "rgba(251, 191, 36, 0.35)" },
  green: { gradient: "linear-gradient(135deg, #10b981, #34d399)", glow: "rgba(16, 185, 129, 0.35)" },
  amber: { gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)", glow: "rgba(245, 158, 11, 0.35)" },
};

export const StatCard = ({
  icon: Icon,
  label,
  value,
  color = "emerald",
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const cardColor = colorMap[color] || colorMap.emerald;

  useEffect(() => {
    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(value * easeOutQuart));

      if (progress < 1) {
        countRef.current = requestAnimationFrame(animate);
      }
    };

    countRef.current = requestAnimationFrame(animate);

    return () => {
      if (countRef.current) {
        cancelAnimationFrame(countRef.current);
      }
    };
  }, [value]);

  return (
    <div 
      className="stat-card" 
      style={{ 
        "--card-gradient": cardColor.gradient,
        "--card-glow": cardColor.glow,
      }}
    >
      <div className="stat-icon-wrapper">
        <Icon size={24} strokeWidth={2} />
      </div>
      <div className="stat-content">
        <div className="stat-value">{count}</div>
        <div className="stat-label">{label}</div>
      </div>
      <div className="stat-decoration" />
    </div>
  );
};