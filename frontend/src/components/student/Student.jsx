import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentPage() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    fetch("http://localhost:4000/check-question")
      .then((res) => res.json())
      .then((data) => {
        if (data.hasNewQuestion) {
          navigate("/student-question", { state: { studentName: name, questionData: data.question} });
        } else {
          navigate("/student-waiting", {state: { studentName : name}}); 
        }
      })
      .catch(err => {
        console.error(err);
        navigate("/student-waiting", {state: { studentName : name}});
      });
  };

  return (
    <div className="min-h-screen w-full bg-white relative flex flex-col items-center justify-center px-4">
      {/* Badge */}
      <span
        className="text-white text-sm font-medium flex items-center justify-center"
        style={{
          width: "134px",
          height: "31px",
          top: "173px",
          left: "683px",
          borderRadius: "24px",
          paddingRight: "9px",
          paddingLeft: "9px",
          gap: "7px",
          background: "linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)",
          opacity: 1,
          position: "absolute",
        }}
      >
        Intervue Poll
      </span>

      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        {/* Heading */}
        <div className="flex flex-col items-center text-center gap-2">
          <h1
              className="text-5xl font-semibold text-black"
              style={{
                width: "981px",
                height: "50px",
                position: "absolute",
                top: "230px",
                left: "270px",
                lineHeight: "50px",
                opacity: 1,
              }}
            >
              Let's <strong>Get Started</strong>
          </h1>

          <p
              style={{
                width: "762px",
                height: "69px",
                position: "absolute",
                top: "292px",
                left: "379.53px",
                fontFamily: "Sora, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "19px",
                lineHeight: "25px",
                letterSpacing: "0%",
                textAlign: "center",
                opacity: 1,
              }}
            >
          If you're a student, you'll be able to{" "}
          <span
            style={{
              fontFamily: "Sora, sans-serif",
              fontWeight: 600,
              fontStyle: "semibold",
              fontSize: "19px",
              lineHeight: "25px",
              letterSpacing: "0%",
              textAlign: "center",
            }}
          >
            submit your answers
          </span>
          , participate in live polls, and see how your responses compare with your classmates.
        </p>

        </div>

        <div
          style={{
            position: "absolute",
            top: "392px",
            left: "523.53px",
            width: "507px",
            height: "95px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            opacity: 1,
          }}>
        <label
          style={{
            width: "507px",
            height: "23px",
            fontFamily: "Sora, sans-serif",
            fontWeight: 400,
            fontStyle: "normal",
            fontSize: "18px",
            lineHeight: "100%",
            letterSpacing: "0%",
            color: "#000000",
          }}
        >
          Enter your Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "507px",
            height: "60px",
            borderRadius: "2px",
            border: "1px solid #D9D9D9",
            padding: "8px",
            fontFamily: "Sora, sans-serif",
            fontSize: "16px",
            outline: "none",
          }}
          placeholder="Your Name"
        />
    </div>

      <button
        style={{
          position: "absolute",
          top: "583px",
          left: "665.53px",
          width: "233.93px",
          height: "57.58px",
          borderRadius: "34px",
          padding: "17px 70px",
          gap: "10px",
          background: "linear-gradient(99.18deg, #8F64E1 -46.89%, #1D68BD 223.45%)",
          color: "white",
          fontFamily: "Sora, sans-serif",
          fontWeight: 600,
          fontSize: "16px",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          opacity: 1,
          border: "none",
        }}
        onClick={handleContinue}
      >
        Continue
      </button>

      </div>
    </div>
  );
}
