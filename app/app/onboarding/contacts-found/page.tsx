"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MobileContainer } from "@/components/mobile/MobileContainer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { DUMMY_APP_USERS } from "@/lib/data/dummy-users";

export default function ContactsFoundPage() {
  const router = useRouter();
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const foundUsers = DUMMY_APP_USERS.slice(0, 5); // Show 5 contacts as found

  const handleSelectAll = () => {
    if (selectedUsers.size === foundUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(foundUsers.map((u) => u.id)));
    }
  };

  const handleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleAddFriends = () => {
    router.push("/onboarding/invite-friends");
  };

  const handleSkip = () => {
    router.push("/onboarding/invite-friends");
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
            <h1 className="text-3xl font-bold mb-2">
              {foundUsers.length} Contacts Found
            </h1>
            <p className="text-muted-foreground">
              These contacts are already Mahj Club players
            </p>
          </div>

          {/* Select All */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-muted-foreground">
              Select All
            </span>
            <button
              onClick={handleSelectAll}
              className={`w-7 h-7 rounded border transition-colors flex items-center justify-center ${
                selectedUsers.size === foundUsers.length
                  ? "bg-green-500 border-green-500"
                  : "border-muted-foreground/30 hover:border-primary"
              }`}
              style={{ minHeight: "auto", minWidth: "auto" }}
            >
              {selectedUsers.size === foundUsers.length && (
                <Check className="h-4 w-4 text-white" />
              )}
            </button>
          </div>

          {/* Contacts List */}
          <div className="space-y-2 flex-1">
            {foundUsers.map((user) => {
              const isSelected = selectedUsers.has(user.id);
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => handleSelectUser(user.id)}
                  className="bg-card border border-border rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:bg-accent/5 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 text-2xl">
                    {user.avatar}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm">
                      {user.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      @{user.username}
                    </p>
                  </div>

                  {/* Checkbox */}
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded border-2 transition-colors flex items-center justify-center ${
                      isSelected
                        ? "bg-green-500 border-green-500"
                        : "border-muted-foreground/30 hover:border-primary"
                    }`}
                  >
                    {isSelected && <Check className="h-4 w-4 text-white" />}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-3"
          >
            <Button
              onClick={handleAddFriends}
              className="w-full h-14 text-base font-semibold bg-green-500 hover:bg-green-600"
            >
              + Add {selectedUsers.size} Friend{selectedUsers.size !== 1 ? "s" : ""}
            </Button>
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
            >
              Skip
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </MobileContainer>
  );
}
