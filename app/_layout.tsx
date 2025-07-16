import { enableScreens } from "react-native-screens";
enableScreens();

import AuthGate from "@/components/authgate";
import Constants from "expo-constants";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, View } from "react-native";
import "../global.css";

export default function RootLayout() {
    return (
        <AuthGate>
            <View className="flex-1">
                <View
                    className="bg-black py-6"
                    style={{
                        height:
                            Platform.OS === "android"
                                ? Constants.statusBarHeight
                                : 0,
                    }}
                />
                <StatusBar style="light" />

                <Stack
                    screenOptions={{
                        headerShown: false,
                        animation: "slide_from_right",
                    }}
                />
            </View>
        </AuthGate>
    );
}
