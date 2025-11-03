"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  centered?: boolean;
}

export function MobileHeader({
  title,
  showBack = false,
  onBack,
  rightAction,
  centered = false,
}: MobileHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  if (centered) {
    return (
      <div className="mobile-header">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="tap-target"
            aria-label="Go back"
          >
            <ArrowLeft className="h-7 w-7" strokeWidth={3} />
          </Button>
        )}
        <div className="flex items-center justify-center gap-2 flex-1">
          {title && (
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          )}
          {rightAction && !showBack && rightAction}
        </div>
        {rightAction && showBack && <div>{rightAction}</div>}
      </div>
    );
  }

  return (
    <div className="mobile-header">
      <div className="flex items-center gap-2">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="tap-target"
            aria-label="Go back"
          >
            <ArrowLeft className="h-7 w-7" strokeWidth={3} />
          </Button>
        )}
        {title && (
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        )}
      </div>
      {rightAction && <div>{rightAction}</div>}
    </div>
  );
}


