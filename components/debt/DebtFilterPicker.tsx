import { Picker } from "@react-native-picker/picker";
import React from "react";
import { View } from "react-native";

interface DebtFilterPickerProps {
    value: "all" | "pending" | "paid";
    onChange: (value: "all" | "pending" | "paid") => void;
}

const DebtFilterPicker: React.FC<DebtFilterPickerProps> = ({
    value,
    onChange,
}) => (
    <View className="bg-gray-800 w-[150px] h-fit rounded-lg overflow-hidden">
        <Picker
            selectedValue={value}
            onValueChange={onChange}
            dropdownIconColor="white"
            style={{ color: "white", backgroundColor: "transparent" }}
        >
            <Picker.Item label="All" value="all" />
            <Picker.Item label="Pending" value="pending" />
            <Picker.Item label="Paid" value="paid" />
        </Picker>
    </View>
);

export default DebtFilterPicker;
