"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { MobileContainer } from "@/components/mobile/MobileContainer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { MahjongTile } from "@/components/mahjong/MahjongTile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import { useOnboardingStore } from "@/lib/store/onboarding";

const COUNTRIES = [
  { code: "+1", name: "United States", flag: "🇺🇸" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+86", name: "China", flag: "🇨🇳" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+1", name: "Canada", flag: "🇨🇦" },
  { code: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "+55", name: "Brazil", flag: "🇧🇷" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { setAuthMethod, setPhoneNumber, setCountryCode, countryCode } = useOnboardingStore();
  const [phoneInput, setPhoneInput] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const selectedCountry = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];

  const handleSelectCountry = (code: string) => {
    setCountryCode(code);
    setShowCountryDropdown(false);
  };

  const handlePhoneAuth = () => {
    if (phoneInput.length >= 10) {
      setAuthMethod("phone");
      setPhoneNumber(phoneInput);
      router.push("/onboarding/phone-verify");
    }
  };

  const handleEmailAuth = () => {
    setAuthMethod("email");
    router.push("/onboarding/email");
  };

  const handleAppleAuth = () => {
    setAuthMethod("apple");
    router.push("/onboarding/username");
  };

  const handleGoogleAuth = () => {
    setAuthMethod("google");
    router.push("/onboarding/username");
  };

  const handleGuest = () => {
    setAuthMethod("guest");
    router.push("/onboarding/username");
  };

  return (
    <MobileContainer isOnboarding>
      <MobileHeader 
        rightAction={
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Log In
          </Button>
        }
      />

      {/* Hero Section */}
      <div className="mobile-content items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Learn Mahjong.
          </h1>
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Have Fun!
          </h1>
          
          {/* Decorative Mahjong Tile Icon */}
          <div className="flex justify-center my-8">
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="drop-shadow-lg"
            >
              <MahjongTile 
                tileSymbol="Chun" 
                size={96} 
                variant="regular"
                title="Red Dragon - Mahjong Tile"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Auth Options */}
        <div className="w-full space-y-4">
          {/* Phone Input */}
          <div className="flex gap-2">
            {/* Country Code Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className="flex items-center gap-2 px-4 py-3 bg-card border border-input rounded-lg hover:bg-accent/5 transition-colors"
              >
                <span className="text-2xl">{selectedCountry.flag}</span>
                <span className="text-sm font-medium">{selectedCountry.code}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>

              {/* Dropdown Menu */}
              {showCountryDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 bg-card border border-input rounded-lg shadow-lg z-50 w-72 max-h-64 overflow-y-auto"
                >
                  {COUNTRIES.map((country) => (
                    <button
                      key={`${country.code}-${country.name}`}
                      onClick={() => handleSelectCountry(country.code)}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-accent/10 transition-colors border-b border-border/50 last:border-b-0 ${
                        country.code === countryCode ? "bg-accent/20" : ""
                      }`}
                    >
                      <span className="text-2xl flex-shrink-0">{country.flag}</span>
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm font-medium">{country.name}</span>
                        <span className="text-xs text-muted-foreground font-semibold">{country.code}</span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Phone Input Field */}
            <Input
              type="tel"
              inputMode="numeric"
              placeholder="Phone number"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ""))}
              onKeyPress={(e) => {
                if (e.key === "Enter") handlePhoneAuth();
              }}
              className="flex-1 h-auto py-3 text-base"
            />
          </div>

          {phoneInput.length >= 10 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button
                onClick={handlePhoneAuth}
                className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90"
              >
                Continue with Phone
              </Button>
            </motion.div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-sm text-muted-foreground font-medium">OR</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Email Button */}
          <Button
            onClick={handleEmailAuth}
            variant="outline"
            className="w-full h-14 text-base font-medium"
          >
            <Image src="/icons/email.png" alt="Email" width={16} height={16} className="mr-2" />
            Continue with email
          </Button>

          {/* Apple Button */}
          <Button
            onClick={handleAppleAuth}
            variant="outline"
            className="w-full h-14 text-base font-medium"
          >
            <Image src="/icons/apple.png" alt="Apple" width={16} height={16} className="mr-2" />
            Continue with Apple
          </Button>

          {/* Google Button */}
          <Button
            onClick={handleGoogleAuth}
            variant="outline"
            className="w-full h-14 text-base font-medium"
          >
            <Image src="/icons/google.png" alt="Google" width={16} height={16} className="mr-2" />
            Continue with Google
          </Button>

          {/* Guest Option */}
          <div className="text-center pt-4">
            <Button
              onClick={handleGuest}
              variant="ghost"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Play as Guest
            </Button>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
}

