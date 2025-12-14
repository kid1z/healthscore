import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import type { ModalProps } from "../types";

export const SimpleModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <button
        aria-label="Close modal"
        className="absolute inset-0 cursor-default border-none bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        type="button"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-t-3xl bg-white p-6 sm:rounded-2xl">
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
          <span className="text-xl">🎉</span>
        </div>

        {/* Title */}
        <h2 className="text-center font-semibold text-lg">{title}</h2>

        {/* Step */}
        <AnimatePresence>
          <motion.div
            animate={{ opacity: 1, y: -10, scale: 1.05 }}
            className="mt-6 text-center font-semibold text-1xl"
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            key="congrats"
            transition={{
              duration: 0.6,
              ease: "easeOut",
              type: "spring",
              stiffness: 300,
              damping: 15,
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>

        {/* Actions */}
        <button
          className="mt-6 w-full rounded-xl bg-gray-900 py-3 font-medium text-white"
          onClick={onClose}
          type="button"
        >
          Save
        </button>
      </div>
    </div>
  );
};
