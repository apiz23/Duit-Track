import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import AddDebtModal from "../components/debt/AddDebtModal";
import DebtFilterPicker from "../components/debt/DebtFilterPicker";
import DebtList from "../components/debt/DebtList";
import EditDebtModal from "../components/debt/EditDebtModal";
import {
    getDebts,
    saveDebt,
    updateDebt,
    updateDebtStatus,
} from "../storage/debts";
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

    const [addModalVisible, setAddModalVisible] = useState(false);
    const [addForm, setAddForm] = useState<{
        name: string;
        amount: number;
        reason: string;
        status: Debt["status"];
    }>({
        name: "",
        amount: 0,
        reason: "",
        status: "pending",
    });

    const openAddModal = () => {
        setAddForm({ name: "", amount: 0, reason: "", status: "pending" });
        setAddModalVisible(true);
    };
    const closeAddModal = () => setAddModalVisible(false);

    const handleAddDebt = async () => {
        if (!addForm.name || !addForm.amount || !addForm.reason) {
            Alert.alert("Missing fields");
            return;
        }
        const newDebt: Debt = {
            ...addForm,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: addForm.status as Debt["status"],
        };
        await saveDebt(newDebt);
        closeAddModal();
        loadDebts();
    };

    return (
        <View className="flex-1 bg-black">
            <View className="flex-row justify-between items-center p-6 pb-4 bg-black border-b border-gray-800">
                <Text className="text-2xl font-bold text-white">
                    Duit Track
                </Text>
            </View>
            <View className="flex-row justify-end items-center m-4">
                <DebtFilterPicker value={activeFilter} onChange={setFilter} />
            </View>
            <DebtList
                debts={filteredDebts}
                selectedIds={selectedIds}
                onSelect={toggleSelect}
                onEdit={openEditModal}
                formatDate={formatDate}
            />
            {/* Add Button */}
            <TouchableOpacity
                className="absolute bottom-12 right-8 bg-blue-600 w-16 h-16 rounded-full items-center justify-center"
                style={{ elevation: 5 }}
                onPress={openAddModal}
            >
                <Text className="text-white text-3xl font-bold">+</Text>
            </TouchableOpacity>
            {/* Add Debt Modal */}
            <AddDebtModal
                visible={addModalVisible}
                form={addForm}
                onClose={closeAddModal}
                onChange={setAddForm}
                onSave={handleAddDebt}
            />
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
