import { motion, type Variants } from "motion/react";
import { type ReactNode } from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(12px)", scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    scale: 1,
    transition: { 
      type: "tween",
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1]
    }
  },
};

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export function RevealText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0, rotateZ: 5 }}
            whileInView={{ y: 0, opacity: 1, rotateZ: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              type: "tween",
              duration: 1,
              delay: delay + i * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}
