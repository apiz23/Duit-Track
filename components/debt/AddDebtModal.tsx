import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { Debt } from "../../types/debt";
import { Input } from "../input";
import { Textarea } from "../textarea";

interface AddDebtModalProps {
    visible: boolean;
    form: {
        name: string;
        amount: number;
        reason: string;
        status: Debt["status"];
    };
    onClose: () => void;
    onChange: (form: AddDebtModalProps["form"]) => void;
    onSave: () => void;
}

const AddDebtModal: React.FC<AddDebtModalProps> = ({
    visible,
    form,
    onClose,
    onChange,
    onSave,
}) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <Pressable
                onPress={onClose}
                className="flex-1 justify-end bg-black/40"
            >
                <View className="bg-neutral-900 p-6 max-h-[85%] rounded-lg border-x-2 border-t-2 border-neutral-700">
                    <View className="flex-row justify-between items-center mb-6 rounded-lg">
                        <Text className="text-white text-xl font-bold">
                            Add Debt
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
                                value={form.name}
                                onChangeText={(text) =>
                                    onChange({ ...form, name: text })
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
                                value={form.amount ? String(form.amount) : ""}
                                onChangeText={(text) =>
                                    onChange({ ...form, amount: Number(text) })
                                }
                                className="bg-gray-700 text-white"
                            />
                        </View>
                        <View>
                            <Text className="text-gray-300 mb-1">Reason</Text>
                            <Textarea
                                placeholder="Reason for debt"
                                value={form.reason}
                                onChangeText={(text) =>
                                    onChange({ ...form, reason: text })
                                }
                                className="bg-gray-700 text-white min-h-[70px]"
                            />
                        </View>
                        <View>
                            <Text className="text-gray-300 mb-1">Status</Text>
                            <View className="bg-gray-700 rounded-lg overflow-hidden">
                                <Picker
                                    selectedValue={form.status}
                                    onValueChange={(value) =>
                                        onChange({ ...form, status: value })
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
                                Add Debt
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
};

export default AddDebtModal;
