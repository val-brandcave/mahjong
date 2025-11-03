"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MobileContainer } from "@/components/mobile/MobileContainer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import {
  Home,
  BookOpen,
  Zap,
  Menu,
  Crown,
  User,
  BarChart3,
  Palette,
  Trophy,
  Users,
  MessageSquare,
  Settings as SettingsIcon,
  HelpCircle,
  FileText,
  ChevronRight,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("more");

  const menuSections = [
    {
      title: null,
      items: [
        { icon: Crown, label: "Try Premium", color: "rgb(233, 99, 121)", action: () => {} },
      ],
    },
    {
      title: null,
      items: [
        { icon: BarChart3, label: "Stats", color: "rgb(64, 175, 175)", action: () => {} },
        { icon: User, label: "Profile", color: "rgb(140, 100, 230)", action: () => router.push("/profile") },
        { icon: Palette, label: "Theme", color: "rgb(100, 200, 150)", action: () => {} },
        { icon: Trophy, label: "Awards", color: "rgb(218, 165, 32)", action: () => {} },
        { icon: Users, label: "Friends", color: "rgb(175, 87, 219)", action: () => router.push("/friends") },
        { icon: MessageSquare, label: "Messages", color: "rgb(100, 150, 230)", action: () => {} },
        { icon: SettingsIcon, label: "Settings", color: "rgb(120, 120, 120)", action: () => {} },
      ],
    },
    {
      title: "Learn",
      items: [
        { icon: BookOpen, label: "Lessons", color: "rgb(175, 87, 219)", action: () => router.push("/lessons") },
        { icon: Zap, label: "Challenges", color: "rgb(233, 99, 121)", action: () => router.push("/challenges") },
      ],
    },
    {
      title: "Account",
      items: [
        { icon: Crown, label: "Membership", color: "rgb(64, 175, 175)", action: () => {} },
        { icon: HelpCircle, label: "Support", color: "rgb(100, 200, 100)", action: () => {} },
      ],
    },
  ];

  return (
    <MobileContainer>
      {/* Fixed Header */}
      <div className="mobile-header">
        <div className="flex items-center justify-center flex-1">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Mahj Club
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="mobile-content space-y-6 pb-24 pt-16">
        {menuSections.map((section, sectionIdx) => (
          <div key={sectionIdx}>
            {section.title && (
              <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-2">
                {section.title}
              </h2>
            )}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {section.items.map((item, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: sectionIdx * 0.1 + idx * 0.05 }}
                  onClick={item.action}
                  className="w-full flex items-center gap-4 px-4 py-4 text-left hover:bg-muted/50 transition-colors border-b border-border/50 last:border-b-0"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <item.icon className="h-5 w-5" style={{ color: item.color }} />
                  </div>
                  <span className="flex-1 font-medium text-foreground">{item.label}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </motion.button>
              ))}
            </div>
          </div>
        ))}

        {/* App Info */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground mb-1">Mahj Club v1.0.0</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <button className="text-xs text-muted-foreground hover:text-foreground">
              Privacy
            </button>
            <span className="text-muted-foreground">•</span>
            <button className="text-xs text-muted-foreground hover:text-foreground">
              Terms
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3 max-w-md mx-auto">
        <div className="flex items-center justify-around">
          <button
            onClick={() => router.push("/home")}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            style={{ color: activeTab === "home" ? "rgb(64, 175, 175)" : undefined }}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => router.push("/lessons")}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            style={{ color: activeTab === "lessons" ? "rgb(175, 87, 219)" : undefined }}
          >
            <BookOpen className="h-6 w-6" />
            <span className="text-xs font-medium">Lessons</span>
          </button>

          <button
            onClick={() => router.push("/challenges")}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            style={{ color: activeTab === "challenges" ? "rgb(233, 99, 121)" : undefined }}
          >
            <Zap className="h-6 w-6" />
            <span className="text-xs font-medium">Challenges</span>
          </button>

          <button
            onClick={() => setActiveTab("more")}
            className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
            style={{ color: activeTab === "more" ? "rgb(140, 100, 80)" : "hsl(var(--muted-foreground))" }}
          >
            <Menu className="h-6 w-6" />
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </div>
    </MobileContainer>
  );
}

