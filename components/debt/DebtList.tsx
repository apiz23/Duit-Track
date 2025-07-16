import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Debt } from "../../types/debt";

interface DebtListProps {
    debts: Debt[];
    selectedIds: string[];
    onSelect: (id: string) => void;
    onEdit: (debt: Debt) => void;
    formatDate: (dateString: string | undefined) => string;
}

const DebtList: React.FC<DebtListProps> = ({
    debts,
    selectedIds,
    onSelect,
    onEdit,
    formatDate,
}) => (
    <FlatList
        data={debts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
            <TouchableOpacity
                onPress={() => onEdit(item)}
                onLongPress={() => onSelect(item.id)}
                className={`p-5 rounded-lg mb-4 relative ${
                    item.status === "paid"
                        ? "bg-gray-900 border-l-4 border-green-500"
                        : "bg-gray-900 border-l-4 border-yellow-500"
                }`}
            >
                {selectedIds.includes(item.id) && (
                    <View className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full" />
                )}
                <View className="flex-row justify-between mb-2">
                    <Text className="text-white font-semibold text-lg">
                        {item.name}
                    </Text>
                    <Text className="text-white font-bold">
                        RM {item.amount.toFixed(2)}
                    </Text>
                </View>
                <Text className="text-gray-300 mb-2">{item.reason}</Text>
                <View className="flex-row justify-between items-center">
                    <Text className="text-xs text-gray-400">
                        {formatDate(item.created_at)}
                    </Text>
                    <Text
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            item.status === "paid"
                                ? "bg-green-800 text-green-300"
                                : "bg-yellow-800 text-yellow-300"
                        }`}
                    >
                        {item.status.toUpperCase()}
                    </Text>
                </View>
            </TouchableOpacity>
        )}
        ListEmptyComponent={
            <View className="items-center justify-center py-10">
                <Text className="text-gray-400">No debts recorded yet</Text>
            </View>
        }
    />
);

export default DebtList;
