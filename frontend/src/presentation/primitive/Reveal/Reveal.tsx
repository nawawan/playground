import { useEffect, useRef, useState, type ReactNode } from "react";
import { Box } from "@mui/material";

export type RevealProps = {
  children: ReactNode;
  delay?: number;
};

export const Reveal = ({ children, delay = 0 }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={ref}
      sx={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(16px)",
        transition: `opacity .6s ease ${delay}ms, transform .6s ease ${delay}ms`,
        "@media (prefers-reduced-motion: reduce)": {
          opacity: 1,
          transform: "none",
          transition: "none",
        },
      }}
    >
      {children}
    </Box>
  );
};

export default Reveal;
