import React from "react";
import classNames from "classnames";

interface AvatarProps {
    name: string;
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ name, className }) => {
    const initials = name?.[0]?.toUpperCase() || "";

    return (
        <div className="avatar avatar-placeholder">
            <div
                className={classNames(
                    "bg-neutral text-neutral-content w-20 rounded-full",
                    className
                )}
            >
                <span className="text-2xl">{initials}</span>
            </div>
        </div>
    );
};
