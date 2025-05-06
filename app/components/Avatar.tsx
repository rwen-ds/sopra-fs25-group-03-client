// components/Avatar.tsx
import React from "react";
import classNames from "classnames";

interface AvatarProps {
    name: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}

const gradients = [
    "from-pink-500 to-yellow-500",
    "from-green-400 to-blue-500",
    "from-purple-500 to-pink-500",
    "from-indigo-500 to-teal-400",
    "from-orange-400 to-red-500",
];

export const Avatar: React.FC<AvatarProps> = ({ name, size = "md", className }) => {
    const initials = name?.[0]?.toUpperCase() || "";
    const gradient = gradients[name.charCodeAt(0) % gradients.length];

    const sizeClasses = {
        sm: "w-10 h-10 text-base",
        md: "w-16 h-16 text-lg",
        lg: "w-20 h-20 text-xl",
    };

    return (
        <div
            className={classNames(
                "rounded-full flex items-center justify-center text-white font-semibold bg-gradient-to-br",
                sizeClasses[size],
                `bg-gradient-to-br ${gradient}`,
                className
            )}
        >
            {initials}
        </div>
    );
};
