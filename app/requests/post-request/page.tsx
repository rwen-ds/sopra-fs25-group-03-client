"use client";

import "@ant-design/v5-patch-for-react-19";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import LoggedIn from "@/components/LoggedIn";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Request } from "@/types/request";
import { useState } from "react";

const PostRequest: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const { value: user } = useLocalStorage<User | null>("user", null);
  const userId = user?.id ?? null;

  const [formData, setFormData] = useState<Request>({
    id: null,
    title: "",
    description: "",
    contactInfo: "",
    volunteerId: null,
    location: "",
    feedback: "",
    status: "OPEN",
    emergencyLevel: "MEDIUM", // default to MEDIUM
    creationDate: null,
    posterId: userId,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, emergencyLevel: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.post<Request>(`/requests?posterId=${userId}`, formData);
      router.push("/requests/my-requests");
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong while posting the request.");
      router.push("/");
    }
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        <LoggedIn />
        <div className="flex items-center justify-center px-4 py-8">
          <form
            onSubmit={handleSubmit}
            className="card w-full max-w-2xl bg-base-200 shadow-xl p-8 space-y-6"
          >
            <h2 className="text-2xl font-bold text-center">Post a New Request</h2>

            <div className="form-control">
              <label className="label font-medium block">Title</label>
              <input
                name="title"
                value={formData.title ?? ""}
                onChange={handleChange}
                type="text"
                placeholder="Short title for your request"
                className="input validator input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label font-medium block">Description</label>
              <textarea
                name="description"
                value={formData.description ?? ""}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={5}
                placeholder="Describe the request in detail"
                required
              ></textarea>
            </div>

            <div className="form-control">
              <label className="label font-medium block">Contact Information</label>
              <input
                name="contactInfo"
                value={formData.contactInfo ?? ""}
                onChange={handleChange}
                type="text"
                placeholder="Email / Phone etc."
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label font-medium block">Location</label>
              <input
                name="location"
                value={formData.location ?? ""}
                onChange={handleChange}
                type="text"
                placeholder="e.g. Zurich City Center"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label font-medium block">Emergency Level</label>
              <select
                name="emergencyLevel"
                value={formData.emergencyLevel ?? ""}
                onChange={handleSelectChange}
                className="select select-bordered w-full invalid:border-red-500"
                required
              >
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button type="submit" className="btn btn-primary w-32">
                Submit
              </button>
              <button
                type="button"
                className="btn btn-outline w-32"
                onClick={() => router.push("/requests")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PostRequest;
