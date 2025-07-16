import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { Debt } from "../../types/debt";
import { Input } from "../input";
import { Textarea } from "../textarea";

interface EditDebtModalProps {
    visible: boolean;
    debt: Debt | null;
    onClose: () => void;
    onChange: (debt: Debt) => void;
    onSave: () => void;
}

const EditDebtModal: React.FC<EditDebtModalProps> = ({
    visible,
    debt,
    onClose,
    onChange,
    onSave,
}) => {
    if (!debt) return null;
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <Pressable
                className="flex-1 justify-end bg-black/40"
                onPress={onClose}
            >
                <View className="bg-neutral-900 p-6 max-h-[85%]">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-white text-xl font-bold">
                            Edit Debt
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View className="gap-4">
                        <View>
                            <Text className="text-gray-300 mb-1">Name</Text>
                            <Input
                                placeholder="Friend's name"
                                value={debt.name}
                                onChangeText={(text) =>
                                    onChange({ ...debt, name: text })
                                }
                                className="bg-gray-700 text-white"
                            />
                        </View>
                        <View>
                            <Text className="text-gray-300 mb-1">
                                Amount (RM)
                            </Text>
                            <Input
                                placeholder="0.00"
                                keyboardType="numeric"
                                value={String(debt.amount || "")}
                                onChangeText={(text) =>
                                    onChange({ ...debt, amount: Number(text) })
                                }
                                className="bg-gray-700 text-white"
                            />
                        </View>
                        <View>
                            <Text className="text-gray-300 mb-1">Reason</Text>
                            <Textarea
                                placeholder="Reason for debt"
                                value={debt.reason}
                                onChangeText={(text) =>
                                    onChange({ ...debt, reason: text })
                                }
                                className="bg-gray-700 text-white min-h-[100px]"
                            />
                        </View>
                        <View>
                            <Text className="text-gray-300 mb-1">Status</Text>
                            <View className="bg-gray-700 rounded-lg overflow-hidden">
                                <Picker
                                    selectedValue={debt.status}
                                    onValueChange={(value) =>
                                        onChange({ ...debt, status: value })
                                    }
                                    dropdownIconColor="white"
                                    style={{ color: "white" }}
                                >
                                    <Picker.Item
                                        label="Pending"
                                        value="pending"
                                    />
                                    <Picker.Item label="Paid" value="paid" />
                                </Picker>
                            </View>
                        </View>
                    </View>
                    <View className="flex-row gap-4 mt-8">
                        <TouchableOpacity
                            onPress={onClose}
                            className="flex-1 bg-gray-600 p-4 rounded-xl items-center"
                        >
                            <Text className="text-white font-bold">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onSave}
                            className="flex-1 bg-blue-600 p-4 rounded-xl items-center"
                        >
                            <Text className="text-white font-bold">
                                Save Changes
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
};

export default EditDebtModal;
