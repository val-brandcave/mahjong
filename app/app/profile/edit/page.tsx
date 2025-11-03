
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MobileContainer } from "@/components/mobile/MobileContainer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, ChevronRight } from "lucide-react";
import { useOnboardingStore } from "@/lib/store/onboarding";
import { useUserProfileStore } from "@/lib/store/onboarding";

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "India",
  "Japan",
  "China",
  "France",
  "Germany",
  "Spain",
  "Italy",
  "Brazil",
];

export default function EditProfilePage() {
  const router = useRouter();
  const { username } = useOnboardingStore();
  const {
    firstName,
    lastName,
    status,
    location,
    country,
    setFirstName,
    setLastName,
    setStatus,
    setLocation,
    setCountry,
  } = useUserProfileStore();

  const [localFirstName, setLocalFirstName] = useState(firstName);
  const [localLastName, setLocalLastName] = useState(lastName);
  const [localStatus, setLocalStatus] = useState(status);
  const [localLocation, setLocalLocation] = useState(location);
  const [localCountry, setLocalCountry] = useState(country);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    // Open file picker
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Upload and process image
      console.log("File selected:", file.name);
    }
  };

  const handleSave = () => {
    setFirstName(localFirstName);
    setLastName(localLastName);
    setStatus(localStatus);
    setLocation(localLocation);
    setCountry(localCountry);
    router.back();
  };

  return (
    <MobileContainer>
      {/* Fixed Header */}
      <MobileHeader 
        title="Edit Profile"
        showBack
        centered
      />

      {/* Content */}
      <div className="mobile-content space-y-4 pb-24 pt-16">
        {/* Avatar Upload */}
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-4">Profile Picture</p>
          <div className="flex items-center justify-between">
            <button
              onClick={handleAvatarClick}
              className="relative group"
            >
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl">
                👤
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Flair */}
        <motion.button
          onClick={() => router.push("/profile/edit/flair")}
          className="w-full bg-card border border-border rounded-xl p-4 text-left hover:bg-accent/5 transition-colors flex items-center justify-between"
          whileHover={{ x: 4 }}
        >
          <div>
            <p className="text-sm text-muted-foreground mb-1">Flair</p>
            <p className="text-base font-medium">Add or remove flair</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </motion.button>

        {/* Status */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-2">Status</p>
          <Input
            type="text"
            placeholder="What's on your mind?"
            value={localStatus}
            onChange={(e) => setLocalStatus(e.target.value)}
            maxLength={50}
            className="h-10"
          />
          <p className="text-xs text-muted-foreground mt-2 text-right">
            {localStatus.length}/50
          </p>
        </div>

        {/* Username (read-only) */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-2">Username</p>
          <p className="text-base font-medium">{username}</p>
        </div>

        {/* First Name */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-2">First Name</p>
          <Input
            type="text"
            placeholder="First name"
            value={localFirstName}
            onChange={(e) => setLocalFirstName(e.target.value)}
            className="h-10"
          />
        </div>

        {/* Last Name */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-2">Last Name</p>
          <Input
            type="text"
            placeholder="Last name"
            value={localLastName}
            onChange={(e) => setLocalLastName(e.target.value)}
            className="h-10"
          />
        </div>

        {/* Country Dropdown */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-2">Country</p>
          <div className="relative">
            <button
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              className="w-full text-left px-3 py-2 border border-input rounded-lg hover:bg-accent/5 transition-colors flex items-center justify-between"
            >
              <span className="text-base">{localCountry}</span>
              <ChevronRight className="h-4 w-4 transform transition-transform" />
            </button>

            {/* Dropdown Menu */}
            {showCountryDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 bg-card border border-input rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
              >
                {COUNTRIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setLocalCountry(c);
                      setShowCountryDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-accent/10 transition-colors border-b border-border/50 last:border-b-0 ${
                      c === localCountry ? "bg-accent/20" : ""
                    }`}
                  >
                    <span className="text-sm font-medium">{c}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-2">Location</p>
          <Input
            type="text"
            placeholder="City or region"
            value={localLocation}
            onChange={(e) => setLocalLocation(e.target.value)}
            className="h-10"
          />
        </div>

        {/* Language */}
        <motion.button
          onClick={() => router.push("/profile/edit/language")}
          className="w-full bg-card border border-border rounded-xl p-4 text-left hover:bg-accent/5 transition-colors flex items-center justify-between"
          whileHover={{ x: 4 }}
        >
          <div>
            <p className="text-sm text-muted-foreground mb-1">Language</p>
            <p className="text-base font-medium">English</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </motion.button>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 mt-4"
        >
          Save Changes
        </Button>
      </div>
    </MobileContainer>
  );
}
