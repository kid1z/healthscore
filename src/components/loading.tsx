import { motion } from "motion/react";

export default function Loading() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      className="ml-2 inline-block"
      initial={{ rotate: 0 }}
      transition={{
        repeat: Number.POSITIVE_INFINITY,
        duration: 1,
        ease: "linear",
      }}
    >
      <svg
        className="h-5 w-5 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <title>loading</title>
        <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
        <path
          className="opacity-75"
          d="M4 12a8 8 0 018-8v8H4z"
          strokeWidth="4"
        />
      </svg>
    </motion.span>
  );
}
