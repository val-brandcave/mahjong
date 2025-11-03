"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MobileContainer } from "@/components/mobile/MobileContainer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Crown, Check } from "lucide-react";
import { DUMMY_APP_USERS } from "@/lib/data/dummy-users";

export default function FacebookInvitePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [addedUsers, setAddedUsers] = useState<Set<string>>(new Set());

  const filteredUsers = searchQuery
    ? DUMMY_APP_USERS.filter(
        (user) =>
          user.facebookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : DUMMY_APP_USERS;

  const handleAdd = (userId: string) => {
    const newAdded = new Set(addedUsers);
    if (newAdded.has(userId)) {
      newAdded.delete(userId);
    } else {
      newAdded.add(userId);
    }
    setAddedUsers(newAdded);
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
          <div>
            <h1 className="text-3xl font-bold mb-2">Facebook Friends</h1>
            <p className="text-muted-foreground text-sm">
              Add friends from your Facebook network
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-auto py-3 text-base"
            />
          </div>

          {/* Facebook Friends List */}
          <div className="space-y-2 flex-1">
            {filteredUsers.map((user) => {
              const isAdded = addedUsers.has(user.id);
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-lg p-4 flex items-center gap-3"
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 text-2xl border-2 border-accent/20">
                    {user.avatar}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground text-sm">
                        @{user.username}
                      </h3>
                      {user.isPremium && (
                        <Crown className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {user.facebookName}
                    </p>
                  </div>

                  {/* Add Button */}
                  <button
                    onClick={() => handleAdd(user.id)}
                    className={`flex-shrink-0 p-2 rounded-full transition-all flex items-center justify-center ${
                      isAdded
                        ? "bg-green-500/20 text-green-600"
                        : "bg-primary/20 text-primary hover:bg-primary/30"
                    }`}
                  >
                    {isAdded ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  </button>
                </motion.div>
              );
            })}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-6 text-muted-foreground text-sm">
              No friends found
            </div>
          )}
        </motion.div>
      </div>
    </MobileContainer>
  );
}
