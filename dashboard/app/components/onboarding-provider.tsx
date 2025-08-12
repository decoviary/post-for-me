import { createContext, useContext, useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/ui/dialog";

import { AccountForm } from "./account-form";

const OnboardingContext = createContext<null>(null);

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const checkAndShowOnboarding = () => {
    // Check if onboarding was dismissed
    const dismissed = localStorage.getItem("dismissedOnboarding");
    if (dismissed === "true") {
      return;
    }

    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      localStorage.setItem("dismissedOnboarding", "true");
      handleCloseDialog();
    }
  };

  // Auto-check onboarding when user changes
  useEffect(() => {
    checkAndShowOnboarding();
  }, []);

  return (
    <OnboardingContext.Provider value={null}>
      {children}

      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome to Post for Me!</DialogTitle>
            <DialogDescription>
              {`Let's finish setting up your account`}
            </DialogDescription>
          </DialogHeader>

          <AccountForm />
        </DialogContent>
      </Dialog>
    </OnboardingContext.Provider>
  );
}
