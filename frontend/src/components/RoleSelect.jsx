import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RoleSelect() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleContinue = () => {
    if (!selectedRole) {
      alert("Please select a role");
      return;
    }
    navigate(`/${selectedRole}`);
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center">
      {/* Badge */}
        <span
            className="absolute top-[195px] left-1/2 transform -translate-x-1/2 
                flex items-center justify-center gap-[7px] text-white text-sm rounded-[24px]"
            style={{
                width: "134px",
                height: "31px",
                paddingLeft: "9px",
                paddingRight: "9px",
                background: "linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)",
                opacity: 1,
            }}>
            Interview Poll
        </span>


      {/* Welcome Message */}
         <div
            className="absolute top-[252px] left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-[69px]"
            style={{
                width: "981px",
                height: "103px",
                opacity: 1,
            }}
            >
            <h1 className="text-5xl font-semibold text-center">
                Welcome to the <strong>Live Polling System</strong>
            </h1>
            <p className="text-gray-500 text-xl text-center">
                Please select the role that best describes you to begin using the live polling system
            </p>
        </div>


        {/* Role Cards */}
    <div className="absolute top-[405px] left-1/2 transform -translate-x-1/2 flex space-x-[34px]">
            {/* Student Card */}
            <div
                className="rounded-[10px] cursor-pointer transition flex flex-col"
                style={{
                width: "387px",
                height: "143px",
                paddingTop: "15px",
                paddingRight: "17px",
                paddingBottom: "15px",
                paddingLeft: "25px",
                gap: "17px",
                border: selectedRole === "student" ? "2px solid" : "2px solid #D9D9D9",
                borderImage:
                    selectedRole === "student"
                    ? "linear-gradient(92.24deg, #7765DA -8.5%, #1D68BD 101.3%) 1"
                    : "",
                opacity: 1,
                }}
                onClick={() => setSelectedRole("student")}
              >
                <h2 className="font-bold text-xl">I'm a Student</h2>
                <p className="text-gray-500 text-sm">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry
                </p>
            </div>

            {/* Teacher Card */}
            <div
                className="rounded-[10px] cursor-pointer transition flex flex-col"
                style={{
                width: "387px",
                height: "143px",
                paddingTop: "15px",
                paddingRight: "17px",
                paddingBottom: "15px",
                paddingLeft: "25px",
                gap: "17px",
                border: selectedRole === "teacher" ? "3px solid" : "1px solid #D9D9D9",
                borderImage:
                    selectedRole === "teacher"
                    ? "linear-gradient(92.24deg, #7765DA -8.5%, #1D68BD 101.3%) 1"
                    : "",
                opacity: 1,
                }}
                onClick={() => setSelectedRole("teacher")}
            >
                <h2 className="font-bold text-xl">I'm a Teacher</h2>
                <p className="text-gray-500 text-sm">
                Submit answers and view live poll results in real-time.
                </p>
            </div>
    </div>

        {/* Continue Button */}
    <button
      onClick={handleContinue}
      className="text-white font-semibold transition absolute left-1/2"
      style={{
        top: "598px", 
        width: "234px",
        height: "58px",
        borderRadius: "34px",
        background: "linear-gradient(99.18deg, #8F64E1 -46.89%, #1D68BD 223.45%)",
        opacity: 1,
        transform: "translateX(-50%)", 
      }}
    >
      Continue
    </button>

    </div>
    
  );
}
