import { CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";

export default function Toast({
  show,
  type = "success",
  message,
  duration = 3000,
  onClose,
}) {
  if (!show) return null;

  const styles = {
    success: {
      bg: "bg-green-600",
      progress: "bg-green-300",
      icon: <CheckCircle2 size={20} />,
    },
    error: {
      bg: "bg-red-600",
      progress: "bg-red-300",
      icon: <XCircle size={20} />,
    },
    warning: {
      bg: "bg-yellow-500 text-black",
      progress: "bg-yellow-200",
      icon: <AlertCircle size={20} />,
    },
  };

  return (
    <div className="fixed right-5 top-5 z-50">
      <div
        className={`relative overflow-hidden flex min-w-[320px] items-center justify-between rounded-xl px-4 py-3 text-white shadow-xl animate-in slide-in-from-top duration-300 ${styles[type].bg}`}
      >
        <div className="flex items-center gap-3">
          {styles[type].icon}
          <span>{message}</span>
        </div>

        <button onClick={onClose}>
          <X size={18} />
        </button>

        {/* Progress Line */}
        <div className="absolute bottom-0 left-0 h-1 w-full bg-white/20">
          <div
            className={`h-full ${styles[type].progress}`}
            style={{
              animation: `toast-progress ${duration}ms linear forwards`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
