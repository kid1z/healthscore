/** biome-ignore-all lint/nursery/noLeakedRender: <na> */
import { AnimatePresence, motion } from "motion/react";
import ShinyText from "./shiny-text";

export default function Thinking({ loading }: { loading: boolean }) {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col items-center gap-4 rounded-2xl p-8">
            <ShinyText
              className="animate-shine text-3xl"
              disabled={false}
              speed={3}
              text="Thinking!"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
