import { motion } from "motion/react";
import { ReactNode } from "react";

export function AnimatedSection({ children, className, delay = 0 }: { children: ReactNode, className?: string, delay?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
