import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import StudentOptions from "./components/Options/StudentOptions";
import ProfessorOptions from "./components/Options/ProfessorOptions";
import StudentRegister from "./components/Auth/StudentRegister";
import StudentLogin from "./components/Auth/StudentLogin";
import ProfessorRegister from "./components/Auth/ProfessorRegister";
import ProfessorLogin from "./components/Auth/ProfessorLogin";
import StudentDashboard from "./components/Dashboard/StudentDashboard";
import ProfessorDashboard from "./components/Dashboard/ProfessorDashboard";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/student-options" element={<StudentOptions />} />
          <Route path="/professor-options" element={<ProfessorOptions />} />
          <Route path="/student-register" element={<StudentRegister />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/professor-register" element={<ProfessorRegister />} />
          <Route path="/professor-login" element={<ProfessorLogin />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/professor-dashboard" element={<ProfessorDashboard />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
