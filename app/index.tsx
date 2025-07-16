import { Link, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import DebtFilterPicker from "../components/debt/DebtFilterPicker";
import DebtList from "../components/debt/DebtList";
import EditDebtModal from "../components/debt/EditDebtModal";
import { getDebts, updateDebt, updateDebtStatus } from "../storage/debts";
import { Debt } from "../types/debt";

export default function Index() {
    const [debts, setDebts] = useState<Debt[]>([]);
    const [activeFilter, setFilter] = useState<"all" | "paid" | "pending">(
        "all"
    );
    const [drawerFilter, setDrawerFilter] = useState<
        "all" | "paid" | "pending"
    >("pending");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const loadDebts = async () => {
        const data = await getDebts();
        setDebts(data);
    };

    useFocusEffect(
        useCallback(() => {
            loadDebts();
        }, [])
    );

    const filteredDebts = debts.filter((d) =>
        activeFilter === "all" ? true : d.status === activeFilter
    );

    const toggleStatus = async (id: string, current: "paid" | "pending") => {
        const newStatus = current === "pending" ? "paid" : "pending";
        await updateDebtStatus(id, newStatus);
        loadDebts();
    };

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const updateMultipleStatus = async (status: "paid" | "pending") => {
        const updates = selectedIds.map((id) => updateDebtStatus(id, status));
        await Promise.all(updates);
        setSelectedIds([]);
        loadDebts();
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "No date";
        try {
            const date = new Date(dateString);
            return `${date.getDate().toString().padStart(2, "0")}/${(
                date.getMonth() + 1
            )
                .toString()
                .padStart(2, "0")}/${date.getFullYear()}`;
        } catch {
            return dateString;
        }
    };

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);

    const openEditModal = (debt: Debt) => {
        setSelectedDebt(debt);
        setModalVisible(true);
    };

    const closeEditModal = () => {
        setModalVisible(false);
        setSelectedDebt(null);
    };

    const handleModalUpdate = async () => {
        if (!selectedDebt) return;
        if (
            !selectedDebt.name ||
            !selectedDebt.amount ||
            !selectedDebt.reason
        ) {
            Alert.alert("Missing fields");
            return;
        }

        try {
            await updateDebt({
                ...selectedDebt,
                updated_at: new Date().toISOString(),
            });
            closeEditModal();
            loadDebts();
        } catch (err) {
            Alert.alert("Failed", "Could not update debt.");
        }
    };

    return (
        <View className="flex-1 bg-black">
            <View className="flex-row justify-between items-center p-6 pb-4 bg-black border-b border-gray-800">
                <Text className="text-2xl font-bold text-white">
                    Duit Track
                </Text>
            </View>
            <View className="flex-row justify-end items-center px-4 py-6">
                <DebtFilterPicker value={activeFilter} onChange={setFilter} />
            </View>
            <DebtList
                debts={filteredDebts}
                selectedIds={selectedIds}
                onSelect={toggleSelect}
                onEdit={openEditModal}
                formatDate={formatDate}
            />
            <Link href="/screens/AddDebt" asChild>
                <TouchableOpacity
                    className="absolute bottom-12 right-8 bg-blue-600 w-16 h-16 rounded-full items-center justify-center"
                    style={{ elevation: 5 }}
                >
                    <Text className="text-white text-3xl font-bold">+</Text>
                </TouchableOpacity>
            </Link>
            {selectedIds.length > 0 && (
                <View className="flex-row justify-around p-4 bg-gray-900 border-t border-gray-700">
                    <TouchableOpacity
                        className="bg-green-600 px-4 py-2 rounded-lg"
                        onPress={() => updateMultipleStatus("paid")}
                    >
                        <Text className="text-white font-bold">
                            Mark as Paid
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-yellow-600 px-4 py-2 rounded-lg"
                        onPress={() => updateMultipleStatus("pending")}
                    >
                        <Text className="text-white font-bold">
                            Mark as Pending
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
            <EditDebtModal
                visible={modalVisible}
                debt={selectedDebt}
                onClose={closeEditModal}
                onChange={(debt) => setSelectedDebt(debt)}
                onSave={handleModalUpdate}
            />
        </View>
    );
}
