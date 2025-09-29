// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "https://live-polling-frontend-v2.onrender.com", 
    methods: ["GET", "POST"],
  },
});

let currentQuestion = null;
let pollResults = [];
const TOTAL_STUDENTS = 5;
let answeredCount = 0;

app.post("/teacher-question-poll", (req, res) => {
  const { question, options, timer } = req.body;

  if (!question || !options || options.length < 2) {
    return res.status(400).json({ success: false, message: "Invalid question data" });
  }
  
  currentQuestion = { id: uuidv4(), question, options, timer };
  pollResults = Array(options.length).fill(0);
  answeredCount = 0;

  console.log("New question saved:", currentQuestion);  
  
  io.emit("newQuestion", currentQuestion);
  io.emit("resultsUpdate", { pollResults, answeredCount, totalStudents: TOTAL_STUDENTS });

  res.json({ success: true});
});

app.get("/check-question", (req, res) => {
  if (currentQuestion) {
    res.json({ hasNewQuestion: true, question: currentQuestion });
  } else {
    res.json({ hasNewQuestion: false });
  }
});


io.on("connection", (socket) => {
  console.log("Student connected:", socket.id);

  if (currentQuestion) {
    socket.emit("newQuestion", currentQuestion);
    socket.emit("resultsUpdate", { pollResults, answeredCount, totalStudents: TOTAL_STUDENTS });
  }

  socket.on("submitAnswer", ({ questionId, optionIndex }) => {
    if (!currentQuestion || currentQuestion.id !== questionId) return;

    if(optionIndex >=0 && optionIndex < pollResults.length){
      pollResults[optionIndex]++;
      answeredCount++;

      console.log("After increamnet Current pollResults after submission:", pollResults);
      console.log(`Vote received: option ${optionIndex} (${currentQuestion.options[optionIndex]})`);
      io.emit("resultsUpdate", { pollResults, answeredCount, totalStudents: TOTAL_STUDENTS });
      console.log("Current pollResults after submission:", pollResults);

    }
});

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`Backend running at http://localhost:${PORT}`)
);
