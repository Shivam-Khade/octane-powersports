"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ProfileModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ProfileModalContext = createContext<ProfileModalContextType | undefined>(undefined);

export function ProfileModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <ProfileModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </ProfileModalContext.Provider>
  );
}

export function useProfileModal() {
  const context = useContext(ProfileModalContext);
  if (context === undefined) {
    throw new Error("useProfileModal must be used within a ProfileModalProvider");
  }
  return context;
}
