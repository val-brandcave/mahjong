"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MobileContainer } from "@/components/mobile/MobileContainer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useOnboardingStore } from "@/lib/store/onboarding";

export default function PasswordPage() {
  const router = useRouter();
  const { setPassword } = useOnboardingStore();
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Password validation rules
  const hasMinLength = passwordInput.length >= 8;
  const hasUpperCase = /[A-Z]/.test(passwordInput);
  const hasLowerCase = /[a-z]/.test(passwordInput);
  const hasNumber = /[0-9]/.test(passwordInput);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordInput);

  const isPasswordValid =
    hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

  const handleContinue = () => {
    if (isPasswordValid) {
      setPassword(passwordInput);
      router.push("/onboarding/username");
    }
  };

  const PasswordRule = ({ met, label }: { met: boolean; label: string }) => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2"
    >
      {met ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-muted-foreground" />
      )}
      <span
        className={`text-sm ${
          met ? "text-green-600 font-medium" : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
    </motion.div>
  );

  return (
    <MobileContainer isOnboarding>
      <MobileHeader showBack />

      {/* Content */}
      <div className="mobile-content flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Create a password</h1>
            <p className="text-muted-foreground">Make it strong for better security</p>
          </div>

          {/* Password Input with Show/Hide Toggle */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="h-auto py-3 pr-12 text-base"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Password Rules */}
          <div className="bg-accent/5 rounded-lg p-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase">
              Password requirements
            </p>
            <div className="space-y-2">
              <PasswordRule
                met={hasMinLength}
                label="At least 8 characters"
              />
              <PasswordRule
                met={hasUpperCase}
                label="One uppercase letter (A-Z)"
              />
              <PasswordRule
                met={hasLowerCase}
                label="One lowercase letter (a-z)"
              />
              <PasswordRule met={hasNumber} label="One number (0-9)" />
              <PasswordRule
                met={hasSpecialChar}
                label="One special character (!@#$%^&*)"
              />
            </div>
          </div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: isPasswordValid ? 1 : 0.5,
            }}
          >
            <Button
              onClick={handleContinue}
              disabled={!isPasswordValid}
              className={`w-full h-14 text-base font-semibold ${
                isPasswordValid
                  ? "bg-primary hover:bg-primary/90 cursor-pointer"
                  : "bg-primary/50 cursor-not-allowed"
              }`}
            >
              Continue
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </MobileContainer>
  );
}
