// StudentQuestion.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Timer from "../Timer";
import  io  from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL);

export default function StudentQuestion() {
  const location = useLocation();
  const navigate = useNavigate();
  const { studentName = "Student", questionIndex = 1 } = location.state || {};
  const [questionData, setQuestionData] = useState(location.state ? location.state.questionData : null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState([]);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
      if (!questionData){
          fetch(`${import.meta.env.VITE_BACKEND_URL}/check-question`)
          .then((res) => res.json())
          .then((data) => {
              if (data.hasNewQuestion){
                  setQuestionData(data.question);
              }
              else{
                  navigate("/student-waiting", {state: {studentName}});
              }
              setLoading(false);
          })
          .catch((err) => {
              console.error("Error fetching question:", err);
              navigate("/student-waiting", {state: {studentName}});
              setLoading(false);
          });
          } else{
              setLoading(false);
          }

      socket.on("newQuestion", (newQuestion) => {
          setQuestionData(newQuestion);
          setSubmitted(false);
          setSelectedOption(null);
          setIsTimeUp(false);
          setResults([]);
      });

      socket.on("resultsUpdate", ({pollResults}) => {
          
        if(pollResults && Array.isArray(pollResults)){
          setResults(pollResults);
        }
      });

      return () => {
          socket.off("resultsUpdate");
          socket.off("newQuestion");  
      };

    }, [questionData, navigate, studentName]);



    const handleSubmit = () => {
      if (selectedOption === null) {
        alert("Please select an option");
        return;
      }
      if(isTimeUp){
          alert("Time is up!");
          return;
      }
      socket.emit("submitAnswer", {
          questionId: questionData.id,
          optionIndex: selectedOption,
      });

      setSubmitted(true);
      alert(`Answer submitted`);
  };

const totalVotes = results.reduce((sum, r) => sum + r, 0);
const timerDuration = questionData?.timer ? Number(questionData.timer) : 60;

  return (
    < div className="w-screen min-h-screen bg-white flex flex-col items-center pt-24">
        <div className="absolute flex items-center"
            style={{
            width: 727,
            padding: "0 10px",
            marginBottom: 20,
            top:170,
            left:360
            }}
        >
            <div 
            className="text-black font-semibold"
            style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 22,
                lineHeight: "100%",
            }}
            >
            Question {questionIndex}
            </div>
        <div className="flex items-center gap-2 ml-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          className="bi bi-clock"
          viewBox="0 0 16 16"
        >
          <path d="M8 3.5a.5.5 0 0 1 .5.5v4.25l3 1.8a.5.5 0 1 1-.5.866l-3.5-2.1V4a.5.5 0 0 1 .5-.5z" />
          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm0-1A7 7 0 1 1 8 1a7 7 0 0 1 0 14z" />
        </svg>
        

        <Timer 
        duration={timerDuration} 
        onTimeUp={() => setIsTimeUp(true)}
        paused={submitted || isTimeUp}
        />
      </div>
      </div>


      {/* Question + Options container */}
      <div
        className="absolute flex flex-col rounded-lg border border-[#AF8FF1] overflow-hidden"
        style={{
          width: 727,
          height: 353,
          top: 219,
          left: 357,
          borderRadius: 9,
          
        }}
      >
        {/* Question text */}
        <div
          className=" px-4 py-3 font-semibold text-white"
          style={{ 
            fontFamily: "Sora, sans-serif", 
            fontWeight: 600, 
            fontSize: 17, 
            backgroundImage: 'linear-gradient(90deg, #343434 0%, #6E6E6E 100%)', 
            lineHeight: '100%'
          }}
        >
          {questionData.question}
        </div>

        {/* Options */}
        <div
          className="flex flex-col gap-3 overflow-y-auto"
          style={{
            width: 727,
            height: 289,
            padding: "18px 16px",
            gap: 15,
          }}
        >
          {questionData.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const voteCount = results[idx] || 0;
            const percent = totalVotes ? Math.round((voteCount / totalVotes) * 100) : 0;
            return (
            <button
              key={idx}
              onClick={() => !submitted && setSelectedOption(idx)}
              className={`flex items-center gap-4 px-4 h-12 rounded-md cursor-pointer relative`} 
              style={{ 
                backgroundColor: isSelected
                 ? "white"
                 : selectedOption !== null 
                 ? "#F6F6F6" 
                 : "#F6F6F6",
                color : isSelected ? "black" : "#4A4A4A",
                border: `2px solid ${isSelected ? "#4F0DCE" : "#AF8FF1"}`, 
                opacity: submitted ? 0.6 : 1,
                cursor: submitted ? "not-allowed" : "pointer", 
            }}
              disabled={submitted}
            >
              {submitted && totalVotes > 0 && (
                  <div
                    className="absolute top-0 left-0 h-full rounded-l-md"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: "#4F0DCE",
                      opacity: 0.5,
                      zIndex: 0,
                      transition: "width 0.5s",
                    }}
                  />
                )}

              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[#7565D9] text-white text-sm font-medium"
                    style={{ 
                        backgroundColor: isSelected ? "#AF8FF1" : "#FFFFFF", 
                        color: isSelected ? "#FFFFFF" : "#AF8FF1", 
                        zIndex: 1
                    }}
                    >
                {idx + 1}
              </span>
              <div className="flex-1 font-medium flex justify-between items-center">
                <span>{opt.text}</span>
                {submitted && totalVotes > 0 && <span className="text-sm font-semibold">{percent}%</span>}
                </div>
            </button>
          );
        })}

        </div>
        </div>

      {/* Submit */}
    {!submitted && (
    <button
        className={`absolute text-white font-semibold flex items-center justify-center`}
        style={{
            width: 234, 
            height: 58,
            top: 651,
            left: 850,
            borderRadius: 34,
            background: "linear-gradient(99.18deg, #8F64E1 -46.89%, #1D68BD 223.45%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: submitted ? "not-allowed" : "pointer",
            opacity: submitted ? 0.5 : 1,
        }}
        onClick={handleSubmit}
        disabled={submitted || isTimeUp}
        >
        Submit
        </button>
    )}
    {submitted && (
  <div
    className="flex items-center justify-center text-center"
    style={{
      width: 737,
      height: 30,
      position: "absolute",
      top: 592,
      left: 352,
      fontFamily: "Sora, sans-serif",
      fontWeight: 600,
      fontSize: 24,
      lineHeight: "100%",
      textAlign: "center",
      opacity: 1,
    }}
  >
    Wait for the teacher to ask a new question..
  </div>
)}

    </div>
  );
}
