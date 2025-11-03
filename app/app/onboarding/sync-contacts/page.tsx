"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MobileContainer } from "@/components/mobile/MobileContainer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";

export default function SyncContactsPage() {
  const router = useRouter();

  const handleAllow = () => {
    router.push("/onboarding/contacts-found");
  };

  const handleSkip = () => {
    router.push("/onboarding/invite-friends");
  };

  return (
    <MobileContainer isOnboarding>
      <MobileHeader showBack />

      {/* Content */}
      <div className="mobile-content flex flex-col justify-between">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Illustration */}
          <div className="flex justify-center py-8">
            <div className="relative w-48 h-48">
              {/* Phone */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-40 bg-white rounded-3xl border-8 border-slate-800 shadow-xl flex items-center justify-center">
                  {/* Contact Grid */}
                  <div className="grid grid-cols-3 gap-2 p-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative Emojis */}
              <div className="absolute -top-4 -right-8 text-5xl">😄</div>
              <div className="absolute -top-2 -left-8 text-5xl">😊</div>
              <div className="absolute -bottom-4 right-0 text-5xl">😄</div>
              <div className="absolute -bottom-2 -left-4 text-5xl">😊</div>
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-center">
              Find Friends on Mahj Club
            </h1>
            <div className="space-y-3">
              <p className="text-center text-muted-foreground">
                Tap Allow to sync your contacts and find people you know on Mahj Club
              </p>
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                Your contacts will be used by Mahj Club to improve your experience by allowing you to
                connect with your friends. For more information, please read our{" "}
                <a href="#" className="underline text-primary">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-3 mt-8"
        >
          <Button
            onClick={handleAllow}
            className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90"
          >
            ALLOW
          </Button>
          <Button
            onClick={handleSkip}
            variant="ghost"
            className="w-full h-14 text-base font-semibold text-primary hover:bg-accent/5"
          >
            SKIP
          </Button>
        </motion.div>
      </div>
    </MobileContainer>
  );
}
