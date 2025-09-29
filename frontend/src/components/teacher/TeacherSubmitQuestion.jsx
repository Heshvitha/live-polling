//TeacherSubmitQuestion.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TeacherSubmitQuestion() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { id: 1, text: "", isCorrect: false },
    { id: 2, text: "", isCorrect: false },
  ]);
  const [timer, setTimer] = useState(60); 

  const navigate = useNavigate();

  const handleOptionChange = (id, value) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, text: value } : opt))
    );
  };

  const handleCorrectChange = (id, value) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === id ? { ...opt, isCorrect: value } : opt
      )
    );
  };

  const addOption = () => {
    setOptions((prev) => [
      ...prev,
      { id: prev.length + 1, text: "", isCorrect: false },
    ]);
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }
  
     const filledOptions = options.filter((opt) => opt.text.trim() !== "");
      if (filledOptions.length < 2) {
        alert("Please enter at least 2 options");
        return;
      }

      try{
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/teacher-question-poll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, options : filledOptions, timer }),
      });

      const data = await res.json();
      console.log("Backend response:", data); 
      
      if(data.success){
        alert("Question submitted successfully");
        navigate("/teacher-question-poll", {state : {questionData: {question, options : filledOptions, timer}}});
      }else{
        alert("Failed to submit question. Please try again.");
      }
      }catch(error){
        console.error("Error submitting question:", error);
        alert("Failed to submit question. Please try again.");
      }
    
};

  return (
    <div className="w-screen min-h-screen bg-white flex flex-col justify-between">
      <div className="flex flex-col w-full max-w-[1300px] mx-auto pt-12">
        {/* Badge */}
        <div className="flex mb-8">
          <span className="text-white text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r from-[#7565D9] to-[#4D0ACD]"
            style={{
              minWidth: "134px",
              height: "31px",
              borderRadius: "24px",
              paddingRight: "9px",
              paddingLeft: "9px",
              background: "linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)",
              opacity: 1,
            }}>
            Intervue Poll
          </span>
        </div>

        <div className="flex flex-col items-start gap-2 w-full mb-8  rounded-lg p-4"
          style={{ maxWidth: "900px" }}>
          <h1 className="text-3xl font-semibold text-black">
            Let's <strong>Get Started</strong>
          </h1>
          <p className="text-gray-500 text-base"
            style={{
              fontFamily: "Sora, sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "16px",
              lineHeight: "100%",
              letterSpacing: "0%",
              opacity: 1,
              color: "rgba(0,0,0,0.5)",
              padding: "4px 8px",
              maxWidth: "700px",
            }}>
            you'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
          </p>
        </div>

        {/* Question + Timer */}
        <div className="flex flex-col gap-2 w-full mb-6" style={{ maxWidth: "800px" }}>
          <div className="flex items-center justify-between w-full mb-1">
            <label className="text-base font-semibold text-black">
              Enter your question
            </label>
            <select
              className="border border-[#D9D9D9] rounded-[4px] p-1 text-sm"
              style={{ width: "120px", height: "32px" }}
              value={timer}
              onChange ={(e) => setTimer(Number(e.target.value))}

            >
              <option value={30}>30 seconds</option>
              <option value={45}>45 seconds</option>
              <option value={60}>60 seconds</option>
              <option value={90}>90 seconds</option>
            </select>
          </div>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="border border-[#D9D9D9] text-gray-700 text-base resize-none p-2"
            style={{
              width: "100%",
              height: "174px",
              borderRadius: "2px",
              opacity: 1,
              background: "#F6F6F6",
            }}
            placeholder="Type your question here..."
            maxLength={100}
          />
          <p className="text-right text-sm text-gray-400">{question.length}/100</p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3 w-full mb-6" style={{ maxWidth: "900px" }}>
          <div className="flex justify-between items-end w-[507px] mb-2">
            <div className="text-black font-semibold text-base" style={{ paddingLeft: "8px" }}>
              Edit Options
            </div>
            <div className="text-black font-semibold text-base" style={{ marginRight: "5px" }}>
              Is it Correct?
            </div>
          </div>
          {options.map((opt, idx) => (
            <div
              key={opt.id}
              className="flex justify-between items-center gap-4"
              style={{ height: "60px", width: "507px" }}
            >
              <div className="flex items-center gap-4 flex-1">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[#7565D9] text-white text-sm font-medium">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  className="flex-1 border border-[#D9D9D9] rounded p-2 text-gray-700 bg-[#F6F6F6]"
                  style={{ height: "40px" }}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={`correct-${opt.id}`}
                    checked={opt.isCorrect}
                    onChange={() => handleCorrectChange(opt.id, true)}
                    className="w-4 h-4 accent-[#7565D9]"
                  />
                  Yes
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={`correct-${opt.id}`}
                    checked={!opt.isCorrect}
                    onChange={() => handleCorrectChange(opt.id, false)}
                    className="w-4 h-4 accent-[#7565D9]"
                  />
                  No
                </label>
              </div>
            </div>
          ))}
          <button
            onClick={addOption}
            className="text-[#7451B6] font-medium border border-[#7451B6] rounded-lg p-2 mt-2 w-40"
            style={{ background: "#F6F6F6" }}
          >
            + Add More option
          </button>
        </div>

       

      </div>
      {/* Footer */}
      <footer className="w-full max-w-[100vw] mx-auto pb-12">
        <hr className="w-full border border-[#B6B6B6] mb-8" style={{ maxWidth: "100vw" }} />
        <div className="flex justify-end w-full">
          <button
            onClick={handleAskQuestion}
            className="text-white font-semibold rounded-full px-6 py-3 bg-gradient-to-r from-[#8F64E1] to-[#1D68BD]"
            style={{
              width: "233.934px",
              height: "45.58px",
              borderRadius: "34px",
              background: "linear-gradient(99.18deg, #8F64E1 -46.89%, #1D68BD 223.45%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 1,
            }}
          >
            Ask Question
          </button>
        </div>
      </footer>
    </div>
  );
}
