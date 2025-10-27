"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface AddItemContextType {
  isAddModalOpen: boolean;
  openAddModal: () => void;
  closeAddModal: () => void;
}

const AddItemContext = createContext<AddItemContextType | undefined>(undefined);

export function AddItemProvider({ children }: { children: ReactNode }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const openAddModal = () => {
    console.log('Opening add modal...');
    setIsAddModalOpen(true);
  };
  const closeAddModal = () => {
    console.log('Closing add modal...');
    setIsAddModalOpen(false);
  };

  return (
    <AddItemContext.Provider value={{
      isAddModalOpen,
      openAddModal,
      closeAddModal
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