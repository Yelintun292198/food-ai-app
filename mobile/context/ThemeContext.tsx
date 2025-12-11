import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

type ProviderProps = {
  children: ReactNode;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: ProviderProps) => {
  const [isDark, setIsDark] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem("theme");

      if (saved === "dark") setIsDark(true);
      else if (saved === "light") setIsDark(false);
      else {
        const systemPrefersDark = Appearance.getColorScheme() === "dark";
        setIsDark(systemPrefersDark);
      }
    } catch (e) {
      console.log("Failed to load theme:", e);
    } finally {
      setLoaded(true);
    }
  };

  const toggleTheme = async () => {
    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
