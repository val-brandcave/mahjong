"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface MobileContainerProps {
  children: ReactNode;
  className?: string;
  isOnboarding?: boolean;
}

export function MobileContainer({ children, className = "", isOnboarding = false }: MobileContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`mobile-screen ${isOnboarding ? 'onboarding' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}

