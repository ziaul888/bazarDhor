"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface AddItemContextType {
  isAddDrawerOpen: boolean;
  openAddDrawer: () => void;
  closeAddDrawer: () => void;
}

const AddItemContext = createContext<AddItemContextType | undefined>(undefined);

export function AddItemProvider({ children }: { children: ReactNode }) {
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

  const openAddDrawer = () => {
    console.log('Opening add drawer...');
    setIsAddDrawerOpen(true);
  };
  const closeAddDrawer = () => {
    console.log('Closing add drawer...');
    setIsAddDrawerOpen(false);
  };

  return (
    <AddItemContext.Provider value={{
      isAddDrawerOpen,
      openAddDrawer,
      closeAddDrawer
    }}>
      {children}
    </AddItemContext.Provider>
  );
}

export function useAddItem() {
  const context = useContext(AddItemContext);
  if (context === undefined) {
    throw new Error('useAddItem must be used within an AddItemProvider');
  }
  return context;
}