// app/test.tsx
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import api from "./api/api";  // 👈 path to api.ts (adjust if needed)

export default function TestScreen() {
    const [message, setMessage] = useState("Loading...");

    useEffect(() => {
        api.get("/healthcheck")
            .then((res) => {
                console.log("Backend response:", res.data);
                setMessage(res.data.status);
            })
            .catch((err) => {
                console.error("Error connecting to backend:", err);
                setMessage("Connection failed ❌");
            });
    }, []);

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 18 }}>Server Response:</Text>
            <Text style={{ fontSize: 22, fontWeight: "bold", color: "green" }}>
                {message}
            </Text>
        </View>
    );
}
