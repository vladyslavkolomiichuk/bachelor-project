"use client";

import ConfirmModal from "@/components/GeneralComponents/ConfirmModal/confirm-modal";
import { createContext, useState, useContext } from "react";

const ConfirmContext = createContext();

export function ConfirmProvider({ children }) {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    options: {},
    resolve: null,
  });

  function confirm(options) {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        options,
        resolve,
      });
    });
  }

  function handleConfirm() {
    confirmState.resolve(true);
    setConfirmState({ ...confirmState, isOpen: false, resolve: null });
  }

  function handleCancel() {
    confirmState.resolve(false);
    setConfirmState({ ...confirmState, isOpen: false, resolve: null });
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {confirmState.isOpen && (
        <ConfirmModal
          isOpen={true}
          title={confirmState.options.title}
          message={confirmState.options.message}
          buttonName={confirmState.options.buttonName || "OK"}
          type={confirmState.options.type}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  return useContext(ConfirmContext).confirm;
}
