// StudentWaitingPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL); 

export default function StudentWaitingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const studentName = location.state?.studentName || "Student";

  const [dots, setDots] = useState("");


  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

    useEffect(() => {
        const handler = (questionData) => {
            console.log("Received new question:", questionData);
            alert(`New question received: ${questionData.question}`);
            navigate("/student-question", { state: { studentName, questionData } });
        }
        socket.on("newQuestion", handler );
        return () => {
        socket.off("newQuestion", handler);
        };
    }, [navigate, studentName]);


  return (
    <div className="min-h-screen w-full bg-white realtive flex flex-col items-center justify-center px-4 ">
      {/* Badge */}
        <span
            className="text-white text-sm font-medium rounded-[24px] flex items-center justify-center"
            style={{
                width: "134px",
                height: "31px",
                top: "173px",
                left: "683px",
                position: "absolute",
                borderRadius: "24px",
                paddingRight: "9px",
                paddingLeft: "9px",
                gap: "7px",
                background: "linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)",
                opacity: 1,
            }}
            >
            Intervue Poll
        </span>


        <div className="flex flex-col items-center justify-center mb-6">
        <div
            className="h-[58px] w-[57px] rounded-full border-4 border-gray-300 border-t-[#500ECE]"
            style={{
              position: "absolute",
              top: "250px",
              left: "723px",
              borderTopColor: "#500ECE",
              borderStyle: "solid",
              borderWidth: "4px",
              borderRadius: "50%",
              animation: "spin 2s linear infinite",
            }}
          ></div>

          <style>
          {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          `}
          </style>

        </div>

        <p
            className="text-center mb-0"
            style={{
                width: "737px",
                height: "42px",
                fontFamily: "Sora, sans-serif",
                fontWeight: 600,
                fontStyle: "normal",
                fontSize: "33px",
                lineHeight: "42px", 
                letterSpacing: "0%",
                top: "350px",
                left: "391px",
                position: "absolute",
                textAlign: "center",
                opacity: 1,
            }}
            >
            Hi {studentName}, wait for the teacher to ask questions{dots}
        </p>
    </div>
  );
}
