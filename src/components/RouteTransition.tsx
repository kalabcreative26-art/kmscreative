import { useRouterState } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

export function RouteTransition({ children }: { children: ReactNode }) {
  const location = useRouterState({ select: (state) => state.location });
  const previous = useRef({ path: location.pathname, index: location.state.__TSR_index ?? 0 });
  const index = location.state.__TSR_index ?? 0;
  const changed = previous.current.path !== location.pathname;
  const backward = location.pathname === "/" || index < previous.current.index;
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    previous.current = { path: location.pathname, index };
    document.documentElement.dataset.navigation = backward ? "back" : "forward";
  }, [location.pathname, index]);

  return (
    <motion.div
      key={location.pathname}
      className="route-content"
      initial={reducedMotion || !changed ? false : { x: backward ? "-20%" : "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
}