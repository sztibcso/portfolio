import { useNavigate } from "react-router-dom";

export default function DontClickButton() {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => navigate("/secret")}
      className="fixed bottom-4 left-1/2 translate-x-[-50%] md:left-4 md:translate-x-0 bg-red-600 text-white font-bold text-sm px-4 py-2 border-4 border-black rounded-full shadow-[4px_4px_0_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_black] transition-all z-50"
    >
      Don't Click Me
    </button>
  );
}