"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MobileContainer } from "@/components/mobile/MobileContainer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Input } from "@/components/ui/input";
import { Search, Plus, Eye, Home, BookOpen, Zap, Menu, Facebook, Mail, MessageCircle } from "lucide-react";
import { useFriendsStore } from "@/lib/store/onboarding";

// Updated suggested friends with generic names
const SUGGESTED_FRIENDS = [
  { id: "sug1", username: "mahj_master_88", firstName: "Jennifer", lastName: "Smith", level: 18, country: "United States" },
  { id: "sug2", username: "tile_queen_92", firstName: "Michelle", lastName: "Johnson", level: 15, country: "Canada" },
  { id: "sug3", username: "charleston_pro", firstName: "Rebecca", lastName: "Williams", level: 21, country: "United States" },
  { id: "sug4", username: "lucky_dragon", firstName: "Amanda", lastName: "Brown", level: 12, country: "Australia" },
  { id: "sug5", username: "bamboo_babe", firstName: "Jessica", lastName: "Davis", level: 19, country: "United States" },
  { id: "sug6", username: "windtile_warrior", firstName: "Nicole", lastName: "Miller", level: 14, country: "United Kingdom" },
  { id: "sug7", username: "pattern_finder", firstName: "Ashley", lastName: "Wilson", level: 17, country: "Canada" },
  { id: "sug8", username: "joker_genius", firstName: "Stephanie", lastName: "Moore", level: 13, country: "United States" },
];

// Weekly leaderboard - top 3 only
const WEEKLY_LEADERBOARD = [
  { id: "lead1", rank: 1, username: "dragon_empress", firstName: "Catherine", lastName: "Anderson", level: 25 },
  { id: "lead2", rank: 2, username: "mahj_legend", firstName: "Elizabeth", lastName: "Taylor", level: 24 },
  { id: "lead3", rank: 3, username: "tile_master_99", firstName: "Margaret", lastName: "Thomas", level: 23 },
];

export default function FriendsPage() {
  const router = useRouter();
  const { friends, addFriend } = useFriendsStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"friends" | "suggestions">("friends");
  const [activeNavTab, setActiveNavTab] = useState("friends");

  const filteredFriends = friends.filter(
    (friend) =>
      friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSuggestions = SUGGESTED_FRIENDS.filter(
    (suggestion) =>
      !friends.find((f) => f.id === suggestion.id) &&
      (suggestion.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        suggestion.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        suggestion.lastName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddFriend = (friend: typeof SUGGESTED_FRIENDS[0]) => {
    addFriend({
      id: friend.id,
      username: friend.username,
      firstName: friend.firstName,
      lastName: friend.lastName,
      level: friend.level,
      avatar: friend.firstName.charAt(0) + friend.lastName.charAt(0),
      country: friend.country,
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return { bg: "rgb(218, 165, 32)", text: "white" }; // Gold
    if (rank === 2) return { bg: "rgb(192, 192, 192)", text: "rgb(60, 60, 60)" }; // Silver
    if (rank === 3) return { bg: "rgb(205, 127, 50)", text: "white" }; // Bronze
    return { bg: "rgb(120, 120, 120)", text: "white" };
  };

  return (
    <MobileContainer>
      {/* Fixed Header */}
      <MobileHeader 
        title="Friends"
        showBack
        centered
      />

      {/* Content */}
      <div className="mobile-content space-y-4 pb-24 pt-16">
        {/* Invite Options */}
        <div className="grid grid-cols-3 gap-3">
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-3 hover:bg-accent/5 transition-colors flex flex-col items-center gap-2"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <Facebook className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs font-medium text-center">Facebook</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-card border border-border rounded-xl p-3 hover:bg-accent/5 transition-colors flex flex-col items-center gap-2"
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgb(233, 99, 121)" }}
            >
              <Mail className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs font-medium text-center">Email</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-3 hover:bg-accent/5 transition-colors flex flex-col items-center gap-2"
          >
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs font-medium text-center">Invite</span>
          </motion.button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or username"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab("friends")}
            className={`pb-3 px-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === "friends"
                ? "border-b-2 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            style={{ borderColor: activeTab === "friends" ? "rgb(64, 175, 175)" : undefined }}
          >
            Friends
            <span 
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ 
                backgroundColor: activeTab === "friends" ? "rgba(64, 175, 175, 0.2)" : "rgba(120, 120, 120, 0.2)",
                color: activeTab === "friends" ? "rgb(64, 175, 175)" : "rgb(120, 120, 120)"
              }}
            >
              {friends.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("suggestions")}
            className={`pb-3 px-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === "suggestions"
                ? "border-b-2 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            style={{ borderColor: activeTab === "suggestions" ? "rgb(64, 175, 175)" : undefined }}
          >
            Suggestions
            <span 
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ 
                backgroundColor: activeTab === "suggestions" ? "rgba(64, 175, 175, 0.2)" : "rgba(120, 120, 120, 0.2)",
                color: activeTab === "suggestions" ? "rgb(64, 175, 175)" : "rgb(120, 120, 120)"
              }}
            >
              {filteredSuggestions.length}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === "friends" ? (
            <>
              {filteredFriends.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-muted-foreground mb-4">
                    You haven't added any Friends yet
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {filteredFriends.map((friend, index) => (
                    <motion.div
                      key={friend.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-card border border-border rounded-xl p-4"
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar with Initials */}
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 text-white"
                          style={{ backgroundColor: "rgb(64, 175, 175)" }}
                        >
                          {getInitials(friend.firstName, friend.lastName)}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground mb-1">
                            {friend.username}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-1">
                            {friend.firstName} {friend.lastName}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            Level <span className="font-semibold">{friend.level}</span>
                          </span>
                        </div>

                        {/* View Button */}
                        <button
                          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: "rgba(64, 175, 175, 0.2)" }}
                          title="View profile"
                        >
                          <Eye className="h-5 w-5" style={{ color: "rgb(64, 175, 175)" }} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {filteredSuggestions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-muted-foreground">No suggestions available</p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {filteredSuggestions.map((suggestion, index) => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-card border border-border rounded-xl p-4"
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar with Initials */}
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 text-white"
                          style={{ backgroundColor: "rgb(175, 87, 219)" }}
                        >
                          {getInitials(suggestion.firstName, suggestion.lastName)}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground mb-1">
                            {suggestion.username}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-1">
                            {suggestion.firstName} {suggestion.lastName}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            Level <span className="font-semibold">{suggestion.level}</span>
                          </span>
                        </div>

                        {/* Add Button */}
                        <button
                          onClick={() => handleAddFriend(suggestion)}
                          className="flex-shrink-0 w-10 h-10 rounded-lg bg-success/20 hover:bg-success/30 transition-colors flex items-center justify-center"
                          title="Add friend"
                        >
                          <Plus className="h-5 w-5 text-success" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Weekly Leaderboard Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground px-2">Weekly Leaderboard</h2>
          <div className="space-y-3">
            {WEEKLY_LEADERBOARD.map((user, index) => {
              const rankColors = getRankColor(user.rank);
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0"
                      style={{ 
                        backgroundColor: rankColors.bg,
                        color: rankColors.text
                      }}
                    >
                      {user.rank}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1">
                        {user.username}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        {user.firstName} {user.lastName}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        Level <span className="font-semibold">{user.level}</span>
                      </span>
                    </div>

                    {/* View Button */}
                    <button
                      className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "rgba(218, 165, 32, 0.2)" }}
                      title="View profile"
                    >
                      <Eye className="h-5 w-5" style={{ color: "rgb(218, 165, 32)" }} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3 max-w-md mx-auto">
        <div className="flex items-center justify-around">
          <button
            onClick={() => router.push("/home")}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            style={{ color: activeNavTab === "home" ? "rgb(64, 175, 175)" : undefined }}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => router.push("/lessons")}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            style={{ color: activeNavTab === "lessons" ? "rgb(175, 87, 219)" : undefined }}
          >
            <BookOpen className="h-6 w-6" />
            <span className="text-xs font-medium">Lessons</span>
          </button>

          <button
            onClick={() => router.push("/challenges")}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            style={{ color: activeNavTab === "challenges" ? "rgb(233, 99, 121)" : undefined }}
          >
            <Zap className="h-6 w-6" />
            <span className="text-xs font-medium">Challenges</span>
          </button>

          <button
            onClick={() => router.push("/more-options")}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            style={{ color: activeNavTab === "more" ? "rgb(140, 100, 80)" : undefined }}
          >
            <Menu className="h-6 w-6" />
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </div>
    </MobileContainer>
  );
}
