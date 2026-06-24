import React, { createContext, useContext, useState, useEffect } from "react";

type LoaderContextType = {
  isLoaderComplete: boolean;
  setIsLoaderComplete: (value: boolean) => void;
};

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [isLoaderComplete, setIsLoaderComplete] = useState(false);

  useEffect(() => {
    if (isLoaderComplete) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [isLoaderComplete]);

  return (
    <LoaderContext.Provider value={{ isLoaderComplete, setIsLoaderComplete }}>
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const context = useContext(LoaderContext);
  if (context === undefined) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
}
