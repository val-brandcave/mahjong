"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MobileContainer } from "@/components/mobile/MobileContainer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Facebook, Mail, MessageCircle } from "lucide-react";
import { DUMMY_APP_USERS } from "@/lib/data/dummy-users";

export default function InviteFriendsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<typeof DUMMY_APP_USERS>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = DUMMY_APP_USERS.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.username.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  };

  const handleContinue = () => {
    router.push("/onboarding/trial");
  };

  return (
    <MobileContainer isOnboarding>
      <MobileHeader showBack />

      {/* Content */}
      <div className="mobile-content flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Find More Friends</h1>
            <p className="text-muted-foreground text-sm">
              Connect with other Mahj Club players
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Search Facebook Button */}
            <button
              onClick={() => router.push("/onboarding/invite-friends/facebook")}
              className="w-full bg-card border border-border rounded-lg p-4 flex items-center gap-4 hover:bg-accent/5 transition-colors"
            >
              <div className="bg-blue-600 rounded-full p-3 flex items-center justify-center">
                <Facebook className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-foreground">Search Facebook</h3>
                <p className="text-sm text-muted-foreground">
                  Find friends through social
                </p>
              </div>
            </button>

            {/* Send Email Invite Button */}
            <button
              onClick={() => {
                // No action for now
              }}
              className="w-full bg-card border border-border rounded-lg p-4 flex items-center gap-4 hover:bg-accent/5 transition-colors"
            >
              <div className="bg-accent rounded-full p-3 flex items-center justify-center">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-foreground">Send Email Invite</h3>
                <p className="text-sm text-muted-foreground">
                  Invite friends with an email
                </p>
              </div>
            </button>

            {/* Send Text Invite Button */}
            <button
              onClick={() => router.push("/onboarding/invite-friends/contacts")}
              className="w-full bg-card border border-border rounded-lg p-4 flex items-center gap-4 hover:bg-accent/5 transition-colors"
            >
              <div className="bg-green-500 rounded-full p-3 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-foreground">Send Invite</h3>
                <p className="text-sm text-muted-foreground">
                  Invite through text message
                </p>
              </div>
            </button>
          </div>

          {/* Search Section */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Phone Number, Email or Username"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 h-auto py-3 text-base"
              />
            </div>

            {/* Search Results */}
            {searchQuery && filteredUsers.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-lg p-4 flex items-center gap-3"
                  >
                    <div className="text-4xl">{user.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm">{user.name}</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                        {user.isPremium && <span className="text-xs">👑</span>}
                      </div>
                    </div>
                    <div className="text-xs bg-accent/20 px-2 py-1 rounded font-semibold">
                      Lvl {user.level}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {searchQuery && filteredUsers.length === 0 && (
              <div className="text-center py-6 text-muted-foreground text-sm">
                No users found
              </div>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Skip Button */}
          <Button
            onClick={handleContinue}
            variant="ghost"
            className="w-full text-muted-foreground hover:text-foreground"
          >
            Skip
          </Button>
        </motion.div>
      </div>
    </MobileContainer>
  );
}
