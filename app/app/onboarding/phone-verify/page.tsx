"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MobileContainer } from "@/components/mobile/MobileContainer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnboardingStore } from "@/lib/store/onboarding";

export default function PhoneVerifyPage() {
  const router = useRouter();
  const { phoneNumber, countryCode, setPinCode } = useOnboardingStore();
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Auto-focus first input
    inputRefs.current[0]?.focus();
    
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Auto-submit when all 6 digits are entered
    if (pin.every((digit) => digit !== "")) {
      const pinCode = pin.join("");
      setPinCode(pinCode);
      
      // Simulate verification delay
      setTimeout(() => {
        router.push("/onboarding/username");
      }, 500);
    }
  }, [pin, setPinCode, router]);

  const handlePinChange = (index: number, value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length > 1) return;

    const newPin = [...pin];
    newPin[index] = numericValue;
    setPin(newPin);

    // Auto-focus next input
    if (numericValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    const newPin = [...pin];
    
    for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
      newPin[i] = pastedData[i];
    }
    
    setPin(newPin);
    const lastFilledIndex = Math.min(pastedData.length, 6) - 1;
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleResend = () => {
    setCountdown(60);
    // Simulate resending code
    console.log("Resending code...");
  };

  return (
    <MobileContainer isOnboarding>
      <MobileHeader showBack />

      <div className="mobile-content">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">Enter verification code</h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            We sent a code to{" "}
            <span className="font-medium text-foreground">
              {countryCode} {phoneNumber}
            </span>
          </p>
        </div>

        {/* PIN Input */}
        <div className="flex gap-3 justify-between mb-6" onPaste={handlePaste}>
          {pin.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handlePinChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-full h-14 text-center text-2xl font-semibold"
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>

        {/* Resend Button */}
        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-sm text-muted-foreground">
              Resend code in <span className="font-medium">{countdown}s</span>
            </p>
          ) : (
            <Button
              variant="ghost"
              onClick={handleResend}
              className="text-sm text-primary hover:text-primary/80"
            >
              Resend code
            </Button>
          )}
        </div>

        {/* Helper Text */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            Make sure to check your messages for the verification code. It may take a few moments to arrive.
          </p>
        </div>
      </div>

      {/* Loading indicator when all digits entered */}
      {pin.every((digit) => digit !== "") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="bg-card p-6 rounded-2xl shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        </motion.div>
      )}
    </MobileContainer>
  );
}

