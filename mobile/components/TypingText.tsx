// 🧠 components/TypingText.tsx (ChatGPT-style typing)
import React, { useEffect, useState } from "react";
import { Text } from "react-native";

type Props = {
  text: string;
  charSpeed?: number;     // speed per character (ms)
  sentencePause?: number; // pause between sentences (ms)
};

export default function TypingText({
  text,
  charSpeed = 20,
  sentencePause = 500,
}: Props) {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(true);

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
            setTimeout(
              () => typeSentence(sentences[sentenceIndex]),
              sentencePause
            );
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
    <Text style={{ fontSize: 16, lineHeight: 22, marginTop: 10, color: "#333" }}>
      {displayed}
      {isTyping && <Text style={{ opacity: 0.5 }}>|</Text>}
    </Text>
  );
}
