import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const PASSWORD = "Tecnomatix";

export default function TecnomatixButton() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setPassword("");
    setError(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setPassword("");
    setError(false);
  };

  const handleOk = () => {
    if (password === PASSWORD) {
      sessionStorage.setItem("tecnomatix_auth", "true");
      handleClose();
      navigate("/tecnomatix");
    } else {
      setError(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleOk();
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="fixed bottom-4 right-1/2 translate-x-[-50%] md:right-4 md:translate-x-0 bg-red-600 text-white font-bold text-sm px-4 py-2 border-4 border-black rounded-full shadow-[4px_4px_0_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_black] transition-all z-50"
      >
        Tecnomatix
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-4 border-black rounded-lg shadow-[8px_8px_0_0_black] p-8 max-w-md w-full font-pixel">
            <h2 className="text-xl font-bold text-center mb-6 text-gray-900">
              Enter Password
            </h2>

            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Password..."
              className={`w-full border-4 ${
                error ? "border-red-500" : "border-black"
              } rounded-lg px-4 py-3 text-gray-900 font-bold text-lg mb-2 focus:outline-none focus:border-red-400`}
            />

            <div className="h-6 mb-4">
              {error && (
                <p className="text-red-500 font-bold text-sm text-center">
                  Wrong password!
                </p>
              )}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleClose}
                className="bg-red-500 text-white font-bold px-8 py-3 border-4 border-black rounded-lg shadow-[4px_4px_0_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_black] transition-all"
              >
                Back
              </button>
              <button
                onClick={handleOk}
                className="bg-green-500 text-white font-bold px-8 py-3 border-4 border-black rounded-lg shadow-[4px_4px_0_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_black] transition-all"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
