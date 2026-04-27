import React from "react";
import { motion } from "framer-motion";

export const MotionReveal = ({
  children,
  delay = 0,
  y = 24,
  duration = 0.7,
  className = "",
  once = true,
  ...rest
}) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once, margin: "-80px" }}
    transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
    {...rest}
  >
    {children}
  </motion.div>
);

export const TiltCard = ({ children, className = "", intensity = 10 }) => {
  const ref = React.useRef(null);
  const [style, setStyle] = React.useState({});

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      transform: `perspective(900px) rotateX(${(-y * intensity).toFixed(
        2
      )}deg) rotateY(${(x * intensity).toFixed(2)}deg) translateZ(0)`,
    });
  };
  const onLeave = () =>
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)",
    });

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        ...style,
        transition: "transform 280ms cubic-bezier(0.22,1,0.36,1)",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className={className}
    >
      {children}
    </div>
  );
};
