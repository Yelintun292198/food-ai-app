// components/TypingText.tsx
import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Colors } from "../constants/colors";

type Props = {
  text: string;
  charSpeed?: number;
  sentencePause?: number;
  textStyle?: any; // allow custom styles
};

export default function TypingText({
  text,
  charSpeed = 20,
  sentencePause = 500,
  textStyle,
}: Props) {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const { isDark } = useTheme();
  const theme = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    const sentences = text.split(/(?<=[.!?])\s+/);
    let sentenceIndex = 0;

    const typeSentence = (sentence: string) => {
      let charIndex = 0;
      const charInterval = setInterval(() => {
        setDisplayed((prev) => prev + sentence[charIndex]);
        charIndex++;
        if (charIndex >= sentence.length) {
          clearInterval(charInterval);
          sentenceIndex++;
          if (sentenceIndex < sentences.length) {
            setTimeout(() => typeSentence(sentences[sentenceIndex]), sentencePause);
          } else {
            setIsTyping(false);
          }
        }
      }, charSpeed);
    };

    setDisplayed("");
    typeSentence(sentences[sentenceIndex]);

    return () => setDisplayed("");
  }, [text]);

  return (
    <Text
      style={[
        {
          fontSize: 16,
          lineHeight: 22,
          marginTop: 10,
          color: theme.text,
        },
        textStyle,
      ]}
    >
      {displayed}
      {isTyping && <Text style={{ opacity: 0.4, color: theme.text }}>|</Text>}
    </Text>
  );
}
