/**
 * DISCLAIMER MODAL COMPONENT
 * Shows a warning before user begins Jury Mode
 * Explains that this is for learning, not for copying AI answers
 */

interface DisclaimerModalProps {
  onAccept: () => void;    // Called when user clicks "I Understand"
  onCancel: () => void;    // Called when user clicks "Cancel"
}

export const DisclaimerModal = ({ onAccept, onCancel }: DisclaimerModalProps) => {
  return (
    <>
      {/* Dark overlay that covers the whole screen */}
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"></div>

      {/* Modal card in the center */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="max-w-md rounded-2xl bg-[#202020] p-8 shadow-2xl ring-1 ring-slate-700/50">
          {/* Warning icon */}
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/20">
              <span className="text-4xl">⚠️</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="mb-4 text-center text-2xl font-bold text-white">
            Important Notice
          </h2>

          {/* Disclaimer text */}
          <div className="mb-6 space-y-3 text-sm leading-relaxed text-slate-300">
            <p>
              <strong className="text-electric">VibeFlow Jury Mode</strong> is designed 
              for learning and understanding your own code.
            </p>
            <p>
              Please <strong className="text-red-400">do not copy or reuse</strong> AI-generated 
              answers in academic submissions — it's designed to <strong>guide</strong>, 
              not replace, your understanding.
            </p>
            <p className="text-slate-400">
              Use this tool to test your knowledge and identify areas for improvement.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            {/* Cancel button */}
            <button
              onClick={onCancel}
              className="flex-1 rounded-xl bg-slate-700 px-4 py-3 font-medium text-slate-200 transition hover:bg-slate-600"
            >
              Cancel
            </button>

            {/* Accept button */}
            <button
              onClick={onAccept}
              className="flex-1 rounded-xl bg-electric px-4 py-3 font-medium text-white transition hover:bg-cobalt hover:shadow-[0_0_20px_rgba(127,90,240,0.4)]"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
