// hooks/useLogout.ts
import { useRouter } from "next/navigation";
import useLocalStorage from "./useLocalStorage";
import { User } from "@/types/user";

export function useLogout() {
    const router = useRouter();
    const tokenStorage = useLocalStorage<string>("token", "");
    const userStorage = useLocalStorage<User | null>("user", null);

    return () => {
        tokenStorage.clear();
        userStorage.clear();
        router.push("/");
    };
}
