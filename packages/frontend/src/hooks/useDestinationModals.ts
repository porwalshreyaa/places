import { useState } from "react";
import { Destination } from "../types";

export interface UseDestinationModalsReturn {
  selectedDestination: Destination | null;
  setSelectedDestination: (dest: Destination | null) => void;
  showNewModal: boolean;
  setShowNewModal: (show: boolean) => void;
  isThemeStoreOpen: boolean;
  setIsThemeStoreOpen: (open: boolean) => void;
  prefilledCoords: { lat: number; lng: number } | null;
  setPrefilledCoords: (coords: { lat: number; lng: number } | null) => void;
  handleOpenNewModalWithCoords: (coords: { lat: number; lng: number }) => void;
}

export function useDestinationModals(): UseDestinationModalsReturn {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [isThemeStoreOpen, setIsThemeStoreOpen] = useState(false);
  const [prefilledCoords, setPrefilledCoords] = useState<{ lat: number; lng: number } | null>(null);

  const handleOpenNewModalWithCoords = (coords: { lat: number; lng: number }) => {
    setPrefilledCoords(coords);
    setShowNewModal(true);
  };

  return {
    selectedDestination,
    setSelectedDestination,
    showNewModal,
    setShowNewModal,
    isThemeStoreOpen,
    setIsThemeStoreOpen,
    prefilledCoords,
    setPrefilledCoords,
    handleOpenNewModalWithCoords,
  };
}
