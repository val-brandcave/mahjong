"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCw, Loader2, Check, User } from "lucide-react";

const RANDOM_NAMES = [
  "Sarah J.",
  "Michael K.",
  "Emma L.",
  "David M.",
  "Lisa W.",
  "James T.",
  "Maria G.",
  "Robert H.",
  "Jennifer P.",
  "William C.",
];

const AVATAR_COLORS = [
  "linear-gradient(135deg, rgb(140, 100, 230), rgb(175, 87, 219))",
  "linear-gradient(135deg, rgb(233, 99, 121), rgb(255, 107, 80))",
  "linear-gradient(135deg, rgb(64, 175, 175), rgb(87, 200, 200))",
  "linear-gradient(135deg, rgb(59, 130, 246), rgb(147, 51, 234))",
];

interface Player {
  id: number;
  name: string;
  status: "waiting" | "ready";
  avatar: string;
}

export default function GameplayMatchmakingPage() {
  const router = useRouter();
  const [isLandscape, setIsLandscape] = useState(false);
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "YOU", status: "ready", avatar: AVATAR_COLORS[0] },
    { id: 2, name: "Waiting...", status: "waiting", avatar: AVATAR_COLORS[1] },
    { id: 3, name: "Waiting...", status: "waiting", avatar: AVATAR_COLORS[2] },
    { id: 4, name: "Waiting...", status: "waiting", avatar: AVATAR_COLORS[3] },
  ]);
  const [allReady, setAllReady] = useState(false);

  // Detect landscape orientation
  useEffect(() => {
    const checkOrientation = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspectRatio = width / height;
      setIsLandscape(aspectRatio > 1.2); // Landscape if width > height significantly
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  // Matchmaking sequence (only in landscape)
  useEffect(() => {
    if (!isLandscape) return;

    // Player 2 ready after 2 seconds
    const timer2 = setTimeout(() => {
      const randomName = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === 2 ? { ...p, name: randomName, status: "ready" } : p
        )
      );
    }, 2000);

    // Player 3 ready after 4 seconds
    const timer3 = setTimeout(() => {
      const randomName = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === 3 ? { ...p, name: randomName, status: "ready" } : p
        )
      );
    }, 4000);

    // Player 4 ready after 6 seconds
    const timer4 = setTimeout(() => {
      const randomName = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === 4 ? { ...p, name: randomName, status: "ready" } : p
        )
      );
      setAllReady(true);
    }, 6000);

    return () => {
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isLandscape]);

  // Navigate after all ready
  useEffect(() => {
    if (allReady) {
      const timer = setTimeout(() => {
        router.push("/gameplay-landscape");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [allReady, router]);

  return (
    <div 
      className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
      }}
    >
      <AnimatePresence mode="wait">
        {!isLandscape ? (
          // PORTRAIT MODE - Rotate Device Prompt
          <motion.div
            key="portrait"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-8 text-center"
            style={{ width: "100%", height: "100%" }}
          >
            <motion.div
              animate={{
                rotate: [0, -20, 0, 20, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mb-8"
            >
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgb(59, 130, 246), rgb(147, 51, 234))",
                  boxShadow: "0 20px 60px rgba(59, 130, 246, 0.4)",
                }}
              >
                <RotateCw className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <h1 className="text-3xl font-bold text-white mb-4">
              Rotate Your Device
            </h1>
            <p className="text-white/70 text-lg max-w-md">
              For the best gameplay experience, please turn your device to landscape mode
            </p>

            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mt-12"
            >
              <RotateCw className="w-16 h-16 text-white/50" />
            </motion.div>
          </motion.div>
        ) : (
          // LANDSCAPE MODE - Matchmaking
          <motion.div
            key="landscape"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center"
            style={{ width: "100%", height: "100%", padding: "3vh 5vw" }}
          >
            {/* Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center mb-6"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                {!allReady ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-6 h-6 text-blue-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </motion.div>
                )}
                <h1 className="text-2xl font-bold text-white">
                  {!allReady ? "Finding Players..." : "All Players Ready!"}
                </h1>
              </div>
              <p className="text-white/60 text-xs">
                {!allReady ? "Matching you with opponents" : "Starting game..."}
              </p>
            </motion.div>

            {/* Player Cards */}
            <div className="grid grid-cols-4 gap-4" style={{ maxWidth: "min(80vw, 700px)" }}>
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div
                    className="rounded-xl p-4 border-2 transition-all"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                      borderColor:
                        player.status === "ready"
                          ? "rgb(34, 197, 94)"
                          : "rgba(255, 255, 255, 0.1)",
                      boxShadow:
                        player.status === "ready"
                          ? "0 0 20px rgba(34, 197, 94, 0.3)"
                          : "none",
                    }}
                  >
                    {/* Avatar */}
                    <div className="flex justify-center mb-3">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center relative"
                        style={{
                          background: player.avatar,
                          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
                        }}
                      >
                        <User className="w-8 h-8 text-white" />
                        
                        {/* Status Badge */}
                        {player.status === "ready" && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2"
                            style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
                          >
                            <Check className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                        
                        {/* Loading Badge */}
                        {player.status === "waiting" && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2"
                            style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
                          >
                            <Loader2 className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Player Name */}
                    <div className="text-center">
                      <p className="text-white font-bold text-sm mb-0.5">
                        {player.name}
                      </p>
                      <p
                        className="text-xs font-medium"
                        style={{
                          color:
                            player.status === "ready"
                              ? "rgb(34, 197, 94)"
                              : "rgb(147, 197, 253)",
                        }}
                      >
                        {player.status === "ready" ? "Ready" : "Joining..."}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            {allReady && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6"
              >
                <p className="text-white/60 text-xs">Get ready to play!</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

