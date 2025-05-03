"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import Header from "@/components/LoggedIn";
import SideBar from "@/components/SideBar";

const Profile: React.FC = () => {
  const apiService = useApi();
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await apiService.get<User>("/users/me");
        setUserData(user);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [apiService]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const handleLogout = () => {
    apiService.put("/users/logout", {});
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
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
          <div className="flex-1 p-10 flex justify-center items-center">
            <div className="card bg-base-200 shadow-xl w-full max-w-2xl p-8">
              <div className="flex flex-col items-center">
                <div className="avatar placeholder">
                  <div className="bg-gradient-to-br from-blue-500 via-white-500 to-gray-500 rounded-full w-24 h-24">
                  </div>
                </div>

                <h2 className="text-2xl font-semibold text-primary mt-4">
                  {userData?.username}
                </h2>
              </div>

              <div className="mt-6 space-y-2 text-base text-gray-600">
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
