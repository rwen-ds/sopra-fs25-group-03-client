import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const useAuthRedirect = (token: string | null) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        if (token === null && !isLoading) {
            // If no token, redirect to login
            router.push("/login");
        } else {
            setIsLoading(false); // Token exists, no need to redirect
        }
    }, [token, router, isLoading]);

    return { isLoading };
};

export default useAuthRedirect;