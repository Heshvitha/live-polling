//TeacherViewQuestion.jsx
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";

const socket = io(import.meta.env.VITE_BACKEND_URL);

export default function TeacherViewQuestion() {
  const location = useLocation();
  const navigate = useNavigate();
  
  console.log("location",location.state.questionData);

  const [poll, setPoll] = useState(location.state?.questionData || null);
  const [loading, setLoading] = useState(!poll);
  const [results, setResults] = useState(poll?.options? Array(poll.options.length).fill(0) : []);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [totalStudents, setTotalStudents] = useState(5);


    useEffect(() => {
    if (poll?.options) {
      setResults(Array(poll.options.length).fill(0));
      setAnsweredCount(0);
    }
  }, [poll]);

  useEffect(() => {
    if(!poll){
    fetch(`${import.meta.env.VITE_BACKEND_URL}/check-question`)
      .then((res)  =>  res.json())
      .then(data => {
        if(data.hasNewQuestion) {
          setPoll(data.question);
        }
      setLoading(false);
    })
      .catch((err) => {
      console.error(err)
      setLoading(false)});
    }
    
    socket.on("newQuestion", (questionData) => {
      console.log("Received new question:", questionData);
      setPoll(questionData);
      setLoading(false);
    });

    socket.on("resultsUpdate", (data) => {
      setResults(data.pollResults || []);
      setAnsweredCount(data.answeredCount || 0);
      setTotalStudents(data.totalStudents || 5);
    });

    return () => {
      socket.off("newQuestion");
      socket.off("resultsUpdate");
    };
  }, [poll]);

  console.log("poll",poll);

  if (loading) {
    return (
      <div className="w-screen min-h-screen flex items-center justify-center bg-white">
        <div className="text-lg font-semibold">
          Waiting for the teacher to ask a question...
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="w-screen min-h-screen flex items-center justify-center bg-white">
        <div className="text-lg font-semibold">
          No active poll available.
        </div>
      </div>
    );
  }

  const totalVotes = (results||[]).reduce((sum,r) => sum+r,0);

  return (
    <div className="w-screen min-h-screen bg-white flex flex-col items-center pt-24">
      <div className="flex flex-col gap-4 w-full max-w-[600px]">
        <div className="text-lg font-semibold mb-2">Question</div>
        <div className="bg-[#4D4D4D] text-white rounded-t-lg px-4 py-3 font-medium">
          <h2>{poll.question}</h2>
        </div>
        {poll.options?.map((opt, idx) => {
          const voteCount = results[idx] || 0;
          const percent = totalVotes ? Math.round((voteCount / totalVotes) * 100) : 0;
          return (
          <div
            key={opt.id}
            className="relative flex items-center gap-4 border-b border-[#E5E5E5] last:border-b-0 bg-[#F6F6F6] px-4"
            style={{
              height: "48px",
              borderRadius: idx === poll.options.length - 1 ? "0 0 8px 8px" : "0",
            }}
          >
          { totalVotes > 0 && (
            <div
                className="absolute top-0 left-0 h-full rounded-l-md"
                style={{
                  width: `${percent}%`,
                  backgroundColor: "#7565D9",
                  opacity: 0.3,
                  zIndex: 0,
                }}
              />
              )}


            <div
              className="relative flex-1 font-medium text-[#7451B6] px-2"
              style={{
                borderRadius: "8px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "8px",
                zIndex: 1
              }}
            >
              <span className="flex-1 font-medium">{opt.text}</span>
              {totalVotes > 0 && (
                  <span className="text-sm font-semibold w-10 text-right">
                    {percent}%
                  </span>
                )}
            </div>
          </div>
          );

})}
      <p className="text-sm text-gray-500 mt-2">
          {answeredCount}/{totalStudents} students answered
        </p>
      </div>

      
      <button
        className={`mt-8 text-white font-semibold rounded-full px-6 py-3 bg-[#7451B6] ${
          answeredCount < totalStudents ? " cursor-not-allowed opacity-50" : ""
        }`}
        disabled = {answeredCount < totalStudents }
        onClick={() => navigate("/teacher")}
      >
        + Ask a new question
      </button>
    </div>
  );
}