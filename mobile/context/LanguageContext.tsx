import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Language = "ja" | "en";

type LanguageContextType = {
  language: Language;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "ja",
  toggleLanguage: () => {},
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("ja");

  // Load saved language on app start
  useEffect(() => {
    AsyncStorage.getItem("language").then((saved) => {
      if (saved === "ja" || saved === "en") {
        setLanguage(saved);
      }
    });
  }, []);

  // Toggle JP <-> EN
  const toggleLanguage = async () => {
    const next = language === "ja" ? "en" : "ja";
    setLanguage(next);
    await AsyncStorage.setItem("language", next);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
