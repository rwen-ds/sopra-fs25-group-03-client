"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

const BackButton: React.FC = () => {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="btn absolute top-7 left-30 z-50"
        >
            <ChevronLeftIcon className="w-5 h-5 mr-1" />
        </button>
    );
};

export default BackButton;
