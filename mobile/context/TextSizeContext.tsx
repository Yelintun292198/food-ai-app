// context/TextSizeContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type TextSizeContextType = {
    fontSize: number;
    setFontSize: (size: number) => void;
};

const TextSizeContext = createContext<TextSizeContextType>({
    fontSize: 16,
    setFontSize: () => {},
});

export const TextSizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [fontSize, setFontSizeState] = useState(16);

    useEffect(() => {
        (async () => {
            const stored = await AsyncStorage.getItem("fontSize");
            if (stored) setFontSizeState(Number(stored));
        })();
    }, []);

    const setFontSize = async (size: number) => {
        setFontSizeState(size);
        await AsyncStorage.setItem("fontSize", String(size));
    };

    return (
        <TextSizeContext.Provider value={{ fontSize, setFontSize }}>
            {children}
        </TextSizeContext.Provider>
    );
};

export const useTextSize = () => useContext(TextSizeContext);
