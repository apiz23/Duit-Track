import { cn } from "@/lib/utils";
import React from "react";
import { TextInput, TextInputProps } from "react-native";

interface Props extends TextInputProps {
    className?: string;
}

export const Input = ({ className, ...props }: Props) => {
    return (
        <TextInput
            {...props}
            className={cn(
                "min-h-[48px] w-full rounded-lg border border-gray-300 dark:border-gray-700",
                "bg-white dark:bg-gray-800 px-4 py-3 text-base text-black dark:text-white",
                "placeholder:text-gray-500 dark:placeholder:text-gray-400",
                "focus:border-blue-500 focus:ring-2 focus:ring-blue-300",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                className
            )}
            placeholderTextColor={props.placeholderTextColor || "#888"}
        />
    );
};
