import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoleSelect from "./components/RoleSelect";
import TeacherSubmitQuestion from "./components/teacher/TeacherSubmitQuestion";
import Student from "./components/student/Student";
import TeacherViewQuestion from "./components/teacher/TeacherViewQuestion";
import StudentWaiting from "./components/student/StudentWaiting";
import StudentQuestion from "./components/student/StudentQuestion";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        <Route path="/teacher" element={<TeacherSubmitQuestion />} />
        <Route path="/student" element={<Student />} />
        <Route path="/teacher-question-poll" element={<TeacherViewQuestion />} />
        <Route path="/student-waiting" element={<StudentWaiting />} />
        <Route path="/student-question" element={<StudentQuestion />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
