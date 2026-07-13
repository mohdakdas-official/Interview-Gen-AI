import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="font-semibold text-lg">{question}</span>

        <ChevronDown className={`duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      <div
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-6 text-gray-400 leading-7">{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
