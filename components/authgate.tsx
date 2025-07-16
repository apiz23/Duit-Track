import * as LocalAuthentication from "expo-local-authentication";
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Button, Alert } from "react-native";

export default function AuthGate({ children }: { children: React.ReactNode }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const authenticate = async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const supported = await LocalAuthentication.supportedAuthenticationTypesAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();

        if (!hasHardware || !enrolled) {
            Alert.alert("Device doesn't support biometric authentication");
            setLoading(false);
            return;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Authenticate to access the app",
            fallbackLabel: "Use Passcode",
        });

        if (result.success) {
            setAuthenticated(true);
        } else {
            Alert.alert("Authentication failed");
        }

        setLoading(false);
    };

    useEffect(() => {
        authenticate();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-black">
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    if (!authenticated) {
        return (
            <View className="flex-1 justify-center items-center bg-black">
                <Text className="text-white text-lg mb-4">Authentication Required</Text>
                <Button title="Try Again" onPress={authenticate} />
            </View>
        );
    }

    return <>{children}</>;
}
