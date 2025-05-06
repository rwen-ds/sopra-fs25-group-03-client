"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import Header from "@/components/LoggedIn";
import SideBar from "@/components/SideBar";
import ErrorAlert from "@/components/ErrorAlert";
import { useLogout } from "@/hooks/useLogout";
import { Avatar } from "@/components/Avatar";

const Profile: React.FC = () => {
  const apiService = useApi();
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const logout = useLogout();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await apiService.get<User>("/users/me");
        setUserData(user);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(`Error fetching profile data: ${error.message}`);
        } else {
          console.error("Error fetching profile data:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [apiService]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const handleLogout = async () => {
    try {
      await apiService.put("/users/logout", {});
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      logout();
    }
  };

  const handleEdit = () => {
    router.push("/profile/edit");
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <SideBar />
          <div className="flex-1 p-10 flex justify-center items-center relative">
            <ErrorAlert
              message={errorMessage}
              onClose={() => setErrorMessage(null)}
              duration={5000}
              type="error"
            />
            <div className="card bg-base-200 shadow-sm w-full max-w-xl p-8 -mt-40">
              <div className="flex flex-col items-center">
                <Avatar name={userData?.username || "Unknown"} />

                <h2 className="text-xl font-semibold text-base-content mt-4">
                  {userData?.username}
                </h2>
              </div>

              <div className="mt-6 space-y-2 text-base-content/70">
                <div><span className="font-semibold">Email:</span> {userData?.email}</div>
                <div><span className="font-semibold">Age:</span> {userData?.age ?? ""}</div>
                <div><span className="font-semibold">Language:</span> {userData?.language}</div>
                <div>
                  <span className="font-semibold">Gender:</span>{" "}
                  {userData?.gender === "MALE"
                    ? "Male"
                    : userData?.gender === "FEMALE"
                      ? "Female"
                      : userData?.gender === "OTHER"
                        ? "Other"
                        : ""}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button className="btn btn-primary flex-1" onClick={handleEdit}>
                  Edit
                </button>
                <button className="btn btn-outline flex-1" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
