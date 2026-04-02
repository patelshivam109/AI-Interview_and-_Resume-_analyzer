import { motion } from "framer-motion";
import { cn } from "../utils/cn";

const variants = {
  primary: "button-primary",
  secondary: "button-secondary",
  ghost: "button-ghost",
};

export default function Button({
  children,
  className = "",
  variant = "primary",
  as: Component = "button",
  motionEnabled = true,
  ...props
}) {
  const classes = cn(variants[variant] ?? variants.primary, className);

  if (!motionEnabled) {
    return (
      <Component className={classes} {...props}>
        {children}
      </Component>
    );
  }

  const MotionComponent = motion(Component);

  return (
    <MotionComponent whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className={classes} {...props}>
      {children}
    </MotionComponent>
  );
}
