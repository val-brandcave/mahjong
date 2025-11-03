"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MobileContainer } from "@/components/mobile/MobileContainer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Send, Check } from "lucide-react";
import { DUMMY_PHONE_CONTACTS } from "@/lib/data/dummy-users";

export default function ContactsInvitePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [invitedContacts, setInvitedContacts] = useState<Set<string>>(new Set());

  const filteredContacts = searchQuery
    ? DUMMY_PHONE_CONTACTS.filter((contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : DUMMY_PHONE_CONTACTS;

  const handleInvite = (contactId: string) => {
    const newInvited = new Set(invitedContacts);
    newInvited.add(contactId);
    setInvitedContacts(newInvited);
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
            <h1 className="text-3xl font-bold mb-2">Invite More Contacts</h1>
            <p className="text-muted-foreground text-sm">
              Send invites through text message
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-auto py-3 text-base"
            />
          </div>

          {/* Contacts List */}
          <div className="space-y-2 flex-1">
            {filteredContacts.map((contact) => {
              const isInvited = invitedContacts.has(contact.id);
              return (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-card border border-border rounded-lg p-4 flex items-center gap-3 transition-all ${
                    isInvited ? "opacity-60" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 text-lg">
                    👤
                  </div>

                  {/* Contact Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm">
                      {contact.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {contact.phoneNumber}
                    </p>
                  </div>

                  {/* Invite Button */}
                  <button
                    onClick={() => handleInvite(contact.id)}
                    disabled={isInvited}
                    className={`flex-shrink-0 p-2 rounded-full transition-all flex items-center justify-center ${
                      isInvited
                        ? "bg-green-500/20 text-green-600"
                        : "bg-primary/20 text-primary hover:bg-primary/30"
                    }`}
                  >
                    {isInvited ? <Check className="h-5 w-5" /> : <Send className="h-5 w-5" />}
                  </button>
                </motion.div>
              );
            })}
          </div>

          {filteredContacts.length === 0 && (
            <div className="text-center py-6 text-muted-foreground text-sm">
              No contacts found
            </div>
          )}
        </motion.div>
      </div>
    </MobileContainer>
  );
}
