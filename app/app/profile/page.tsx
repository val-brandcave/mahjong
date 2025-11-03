
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MobileContainer } from "@/components/mobile/MobileContainer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";
import { MoreVertical, Share2, Edit2, GraduationCap, Flame, BookOpen, Zap, Trophy } from "lucide-react";
import { useOnboardingStore } from "@/lib/store/onboarding";
import { useUserProfileStore } from "@/lib/store/onboarding";

export default function ProfilePage() {
  const router = useRouter();
  const { username } = useOnboardingStore();
  const { level, streak, status, flair } = useUserProfileStore();
  const [showMenu, setShowMenu] = useState(false);

  const handleEdit = () => {
    setShowMenu(false);
    router.push("/profile/edit");
  };

  const handleShare = () => {
    setShowMenu(false);
    // TODO: Implement share profile functionality
    console.log("Share profile");
  };

  return (
    <MobileContainer>
      {/* Fixed Header */}
      <MobileHeader 
        title="Profile"
        showBack
        centered
        rightAction={
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
            >
              <MoreVertical className="h-6 w-6 text-muted-foreground" />
            </button>

            {/* Menu Dropdown */}
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 min-w-40"
              >
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-accent/10 transition-colors border-b border-border/50"
                >
                  <Edit2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Edit</span>
                </button>
                <button
                  onClick={handleShare}
                  className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-accent/10 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Share Profile</span>
                </button>
              </motion.div>
            )}
          </div>
        }
      />

      {/* Content */}
      <div className="mobile-content space-y-6 pb-24 pt-16">
        {/* Avatar & Basic Info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-5xl mx-auto mb-4">
            👤
          </div>
          <h2 className="text-2xl font-bold mb-1">{username || "Player"}</h2>
          {status && (
            <p className="text-sm text-muted-foreground mb-2">"{status}"</p>
          )}
          {flair && <p className="text-xl mb-3">{flair}</p>}
        </motion.div>

        {/* Level & Streak Section */}
        <div className="grid grid-cols-2 gap-3">
          {/* Level Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <GraduationCap className="w-6 h-6 mb-2" style={{ color: "rgb(140, 100, 230)" }} />
            <p className="text-xs text-muted-foreground mb-1">Your Level</p>
            <h3 className="text-2xl font-bold">{level}</h3>
          </motion.div>

          {/* Streak Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <Flame className="w-6 h-6 mb-2" style={{ color: "rgb(255, 107, 53)" }} />
            <p className="text-xs text-muted-foreground mb-1">Day Streak</p>
            <h3 className="text-2xl font-bold">{streak} Days</h3>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-lg p-3 text-center"
          >
            <div className="flex justify-center mb-2">
              <BookOpen className="h-6 w-6" style={{ color: "rgb(175, 87, 219)" }} />
            </div>
            <p className="text-xs text-muted-foreground">Lessons</p>
            <p className="text-lg font-bold">5/13</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-lg p-3 text-center"
          >
            <div className="flex justify-center mb-2">
              <Zap className="h-6 w-6" style={{ color: "rgb(233, 99, 121)" }} />
            </div>
            <p className="text-xs text-muted-foreground">Challenges</p>
            <p className="text-lg font-bold">12/32</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-lg p-3 text-center"
          >
            <div className="flex justify-center mb-2">
              <Trophy className="h-6 w-6" style={{ color: "rgb(218, 165, 32)" }} />
            </div>
            <p className="text-xs text-muted-foreground">Achievements</p>
            <p className="text-lg font-bold">8/25</p>
          </motion.div>
        </div>
      </div>
    </MobileContainer>
  );
}
