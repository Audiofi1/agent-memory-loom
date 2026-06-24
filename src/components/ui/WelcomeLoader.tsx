import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLoader } from "@/hooks/LoaderContext";
import { Component as DotsLoader } from "@/components/3-dots-loader";

export function WelcomeLoader() {
  const { isLoaderComplete, setIsLoaderComplete } = useLoader();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Artificial delay for the 3-dots loader
    const timer = setTimeout(() => setIsVisible(false), 2600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence
      onExitComplete={() => {
        setIsLoaderComplete(true);
      }}
    >
      {isVisible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-background pointer-events-auto"
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: [0.64, 0, 0.78, 0] }}
        >
          <motion.div 
            exit={{ opacity: 0, scale: 0.9 }} 
            transition={{ duration: 0.4 }}
            className="relative z-10 flex flex-col items-center"
          >
            <DotsLoader />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
