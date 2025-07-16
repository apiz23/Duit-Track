import { supabase } from "@/lib/supabase";
import { Debt } from "../types/debt";

// -------------------- GET --------------------

export const getDebts = async (): Promise<Debt[]> => {
    const { data, error } = await supabase.from("debts").select("*");
    if (error) {
        console.error("❌ Supabase fetch failed", error);
        return [];
    }
    return data as Debt[];
};

// -------------------- SAVE SINGLE --------------------

export const saveDebt = async (debt: Debt) => {
    try {
        const { error } = await supabase.from("debts").insert({
            id: debt.id,
            name: debt.name,
            amount: debt.amount,
            reason: debt.reason,
            status: debt.status,
            created_at: debt.created_at ?? new Date().toISOString(),
            updated_at: debt.updated_at ?? new Date().toISOString(),
        });

        if (error?.code === "23505") {
            console.warn("⚠️ Duplicate ID. Skipping insert.");
            return;
        }

        if (error) throw error;
    } catch (err) {
        console.error("❌ Supabase insert failed", err);
    }
};

// -------------------- UPDATE SINGLE --------------------

export const updateDebt = async (updated: Debt) => {
    try {
        const { error } = await supabase
            .from("debts")
            .update({
                name: updated.name,
                amount: updated.amount,
                reason: updated.reason,
                status: updated.status,
                updated_at: new Date().toISOString(),
            })
            .eq("id", updated.id);

        if (error) throw error;
    } catch (err) {
        console.error("❌ Supabase update failed", err);
    }
};

// -------------------- UPDATE STATUS ONLY --------------------

export const updateDebtStatus = async (
    id: string,
    status: "paid" | "pending"
) => {
    try {
        const { error } = await supabase
            .from("debts")
            .update({ status, updated_at: new Date().toISOString() })
            .eq("id", id);

        if (error) throw error;
    } catch (err) {
        console.error("❌ Supabase status update failed", err);
    }
};

// -------------------- DELETE --------------------

export const deleteDebt = async (id: string) => {
    try {
        const { error } = await supabase.from("debts").delete().eq("id", id);
        if (error) throw error;
    } catch (err) {
        console.error("❌ Supabase delete failed", err);
    }
};
