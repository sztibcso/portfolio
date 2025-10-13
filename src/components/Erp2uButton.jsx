import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Erp2uButton() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setStep(1);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setStep(1);
  };

  const handleNo = () => {
    setStep(999);
  };

  const handleYes = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      handleClose();
      navigate("/erp2u");
    }
  };

  const getModalContent = () => {
    switch (step) {
      case 1:
        return {
          question: "Az ERP2U alkalmazottja vagy?",
          showButtons: true,
        };
      case 2:
        return {
          question: "Interjúztattál egy bizonyos Szalontai Tibort (Tibcsót)?",
          showButtons: true,
        };
      case 3:
        return {
          question: "Érdekel tud-e még többet?",
          showButtons: true,
        };
      case 999:
        return {
          question: "Próbáld újra!",
          showButtons: false,
        };
      default:
        return { question: "", showButtons: false };
    }
  };

  const content = getModalContent();

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="fixed bottom-4 right-1/2 translate-x-[-50%] md:right-4 md:translate-x-0 bg-red-600 text-white font-bold text-sm px-4 py-2 border-4 border-black rounded-full shadow-[4px_4px_0_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_black] transition-all z-50"
      >
        ERP2U
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-4 border-black rounded-lg shadow-[8px_8px_0_0_black] p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
              {content.question}
            </h2>

            <div className="flex gap-4 justify-center">
              {content.showButtons ? (
                <>
                  <button
                    onClick={handleYes}
                    className="bg-green-500 text-white font-bold px-8 py-3 border-4 border-black rounded-lg shadow-[4px_4px_0_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_black] transition-all"
                  >
                    Igen
                  </button>
                  <button
                    onClick={handleNo}
                    className="bg-red-500 text-white font-bold px-8 py-3 border-4 border-black rounded-lg shadow-[4px_4px_0_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_black] transition-all"
                  >
                    Nem
                  </button>
                </>
              ) : (
                <button
                  onClick={handleClose}
                  className="bg-blue-500 text-white font-bold px-8 py-3 border-4 border-black rounded-lg shadow-[4px_4px_0_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_black] transition-all"
                >
                  Bezárás
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
