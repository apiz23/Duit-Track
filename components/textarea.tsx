import { cn } from "@/lib/utils";
import React from "react";
import { TextInput, TextInputProps } from "react-native";

interface Props extends TextInputProps {
    className?: string;
}

export const Textarea = ({ className, ...props }: Props) => {
    return (
        <TextInput
            {...props}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className={cn(
                "min-h-[120px] w-full rounded-md border border-input bg-white dark:bg-gray-800 px-3 py-2 text-base text-black dark:text-white",
                "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                "focus:border-blue-500 focus:ring-2 focus:ring-blue-300",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                className
            )}
            placeholderTextColor={props.placeholderTextColor || "#888"}
        />
    );
};
