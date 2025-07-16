import { Input } from "@/components/input";
import { saveDebt } from "@/storage/debts";
import { Debt } from "@/types/debt";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function AddDebt() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState<Omit<Debt, "id" | "status" | "date">>({
        name: "",
        amount: 0,
        reason: "",
    });

    const handleChange = (key: keyof typeof form, value: string) => {
        setForm((prev) => ({
            ...prev,
            [key]: key === "amount" ? Number(value) : value,
        }));
    };

    const handleSubmit = async () => {
        if (!form.name || !form.amount || !form.reason) {
            Alert.alert("Please fill in all fields.");
            return;
        }

        setIsSubmitting(true);

        const newDebt: Debt = {
            ...form,
            id: Date.now().toString(),
            status: "pending",
        };

        await saveDebt(newDebt);
        router.back();
    };

    return (
        <View className="flex-1 bg-gray-50 dark:bg-black p-6">
            <View className="flex-row items-center mb-6">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mb-4 flex-row items-center space-x-2"
                >
                    <Ionicons name="arrow-back" size={24} color="#3b82f6" />
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white ml-2">
                        Add New Debt
                    </Text>
                </TouchableOpacity>
            </View>

            <View className="space-y-5">
                <Input
                    placeholder="Friend's Name"
                    value={form.name}
                    onChangeText={(text: string) => handleChange("name", text)}
                    className="mb-2 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                />

                <Input
                    placeholder="Amount (RM)"
                    keyboardType="numeric"
                    value={form.amount ? String(form.amount) : ""}
                    onChangeText={(text: string) =>
                        handleChange("amount", text)
                    }
                    className="mb-2 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                />

                <Input
                    placeholder="Reason"
                    value={form.reason}
                    onChangeText={(text: string) =>
                        handleChange("reason", text)
                    }
                    className="mb-2 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                />
            </View>

            <TouchableOpacity
                onPress={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-600 p-4 rounded-xl items-center mt-8"
            >
                <Text className="text-white font-bold text-lg">
                    {isSubmitting ? "Saving..." : "Save Debt"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
