import { Input } from "@/components/input";
import { Textarea } from "@/components/textarea";
import { deleteDebt, getDebts, updateDebt } from "@/storage/debts"; // ✅ updateDebt added
import { Debt, DebtStatus } from "@/types/debt";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function EditDebt() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [debt, setDebt] = useState<Debt | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadDebt = async () => {
        const all = await getDebts();
        const selected = all.find((d) => String(d.id) === String(id));

        if (!selected) {
            Alert.alert("Debt not found.");
            router.back();
            return;
        }
        setDebt(selected);
    };

    const handleUpdate = async () => {
        if (isSubmitting || !debt) return;

        if (!debt.name || !debt.amount || !debt.reason) {
            Alert.alert(
                "Missing Information",
                "Please fill in all required fields."
            );
            return;
        }

        setIsSubmitting(true);

        try {
            await updateDebt({
                ...debt,
                updated_at: new Date().toISOString(),
            });
            router.back();
        } catch (error) {
            Alert.alert("Error", "Failed to update debt. Please try again.");
            setIsSubmitting(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Debt",
            "Are you sure you want to delete this debt?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            if (debt) {
                                await deleteDebt(debt.id);
                                router.back();
                            }
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete debt.");
                        }
                    },
                },
            ]
        );
    };

    useEffect(() => {
        loadDebt();
    }, []);

    if (!debt) return null;

    return (
        <View className="flex-1 bg-gray-50 dark:bg-black p-6">
            {/* Header with Back Button */}
            <View className="flex-row items-center mb-2">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mb-4 flex-row items-center space-x-2"
                >
                    <Ionicons name="arrow-back" size={24} color="#3b82f6" />
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white ml-2">
                        Edit Debt
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Debt ID */}
            <View className="bg-blue-50 dark:bg-blue-600/20 p-3 rounded-lg mb-6">
                <Text className="text-blue-800 dark:text-blue-200 text-sm font-medium">
                    Debt ID: {id}
                </Text>
            </View>

            {/* Form */}
            <View className="gap-4 mb-8">
                <View>
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Friend's Name
                    </Text>
                    <Input
                        placeholder="Enter name"
                        value={debt.name}
                        onChangeText={(text) =>
                            setDebt({ ...debt, name: text })
                        }
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                    />
                </View>

                <View>
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Amount (RM)
                    </Text>
                    <Input
                        placeholder="0.00"
                        keyboardType="numeric"
                        value={String(debt.amount)}
                        onChangeText={(text) =>
                            setDebt({ ...debt, amount: Number(text) })
                        }
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                    />
                </View>

                <View>
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Reason
                    </Text>
                    <Textarea
                        placeholder="Enter reason"
                        value={debt.reason}
                        onChangeText={(text) =>
                            setDebt({ ...debt, reason: text })
                        }
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 min-h-[70px]"
                    />
                </View>

                <View>
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                    </Text>
                    <View className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <Picker
                            selectedValue={debt.status}
                            onValueChange={(value: DebtStatus) =>
                                setDebt({ ...debt, status: value })
                            }
                            style={{
                                color: "black",
                                backgroundColor: "white",
                            }}
                            dropdownIconColor="black"
                        >
                            <Picker.Item label="Pending" value="pending" />
                            <Picker.Item label="Paid" value="paid" />
                        </Picker>
                    </View>
                </View>
            </View>

            {/* Buttons */}
            <TouchableOpacity
                onPress={handleUpdate}
                disabled={isSubmitting}
                className={`bg-blue-600 p-4 rounded-xl items-center justify-center ${
                    isSubmitting ? "opacity-70" : ""
                }`}
            >
                <Text className="text-white font-bold text-lg">
                    {isSubmitting ? "Updating..." : "Update Debt"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleDelete}
                className="mt-4 bg-red-600 p-4 rounded-xl items-center justify-center"
            >
                <Text className="text-white font-bold text-lg">
                    Delete Debt
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    pickerContainer: {
        backgroundColor: "white",
        borderRadius: 8,
        overflow: "hidden",
        marginTop: 4,
    },
});
