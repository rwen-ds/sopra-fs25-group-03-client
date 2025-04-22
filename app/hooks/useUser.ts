// hooks/useUser.ts
export function useUser() {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
}
