"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MobileContainer } from "@/components/mobile/MobileContainer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { useOnboardingStore } from "@/lib/store/onboarding";

const premiumFeatures = [
  "Unlimited Challenges",
  "Advanced Statistics",
];

export default function TrialPage() {
  const router = useRouter();
  const { setAcceptedTrial } = useOnboardingStore();
  const [billingPeriod, setBillingPeriod] = useState<"yearly" | "monthly">("yearly");

  const monthlyPrice = 9.99;
  const yearlyPrice = 79.99;
  const yearlyMonthly = (yearlyPrice / 12).toFixed(2);
  const savings = Math.round(((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12)) * 100);

  const handleAcceptTrial = () => {
    setAcceptedTrial(true);
    router.push("/home");
  };

  const handleSkip = () => {
    setAcceptedTrial(false);
    router.push("/home");
  };

  return (
    <MobileContainer isOnboarding>
      <MobileHeader showBack />

      <div className="mobile-content">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-accent via-primary to-secondary mb-4"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-2">
            Get Started with 1 Free Week of Premium
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Unlock the full learning experience
          </p>
        </div>

        {/* Features List */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <div className="space-y-4">
            {premiumFeatures.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-success" />
                </div>
                <p className="text-base font-medium">{feature}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pricing Toggle */}
        <div className="bg-muted rounded-xl p-1 flex gap-1 mb-6">
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
              billingPeriod === "yearly"
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Yearly
            {billingPeriod === "yearly" && (
              <span className="ml-2 text-xs font-semibold text-success">
                Save {savings}%
              </span>
            )}
          </button>
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
              billingPeriod === "monthly"
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Monthly
          </button>
        </div>

        {/* Price Display */}
        <div className="text-center mb-6">
          {billingPeriod === "yearly" ? (
            <>
              <div className="text-4xl font-bold mb-1">
                ${yearlyMonthly}<span className="text-2xl text-muted-foreground">/mo</span>
              </div>
              <p className="text-sm text-muted-foreground">
                ${yearlyPrice}/yr after free trial. Cancel anytime.
              </p>
            </>
          ) : (
            <>
              <div className="text-4xl font-bold mb-1">
                ${monthlyPrice}<span className="text-2xl text-muted-foreground">/mo</span>
              </div>
              <p className="text-sm text-muted-foreground">
                After free trial. Cancel anytime.
              </p>
            </>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleAcceptTrial}
            className="w-full h-14 text-base font-semibold bg-gradient-to-r from-primary via-accent to-secondary hover:opacity-90 transition-opacity"
          >
            Redeem 1 Week Free
          </Button>

          <Button
            onClick={handleSkip}
            variant="ghost"
            className="w-full h-14 text-base text-muted-foreground hover:text-foreground"
          >
            No, thank you
          </Button>
        </div>

      </div>
    </MobileContainer>
  );
}

