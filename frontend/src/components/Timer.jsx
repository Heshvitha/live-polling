import { useEffect, useState } from "react";

export default function Timer({ duration, onTimeUp, paused=false }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (paused) return;

    if (timeLeft <= 0) {
        onTimeUp?.();
        return;
    }
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, paused, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  let textColor = "#000";
  if (timeLeft <= duration/4){
    textColor ="red";
  } 

  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: "63px",
        height: "29px",
        top: "215px",
        left: "535px",
        paddingTop: "10px",
        paddingBottom: "10px",
        gap: "10px",
        opacity: 1,
        fontFamily: "Sora, sans-serif",
        fontWeight: 600,
        fontSize: "18px",
        lineHeight: "100%",
        textAlign: "center",
        color: textColor,
      }}
    >
      {formattedTime}
    </div>
      
  );
}
