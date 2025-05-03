"use client";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/LoggedIn";
import { Request } from "@/types/request";

const EditRequest: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();
    const apiService = useApi();
    const [requestData, setRequestData] = useState<Request | null>(null);
    const [formData, setFormData] = useState<Request>({
        id: null,
        title: "",
        description: "",
        contactInfo: "",
        volunteerId: null,
        location: "",
        feedback: null,
        status: null,
        emergencyLevel: "MEDIUM",
        creationDate: null,
        posterId: null,
    });
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRequestData = async () => {
            try {
                const data = await apiService.get<Request>(`/requests/${id}`);
                setRequestData(data);
                setFormData({
                    ...data,
                    title: data.title ?? "",
                    description: data.description ?? "",
                    contactInfo: data.contactInfo ?? "",
                    location: data.location ?? "",
                    emergencyLevel: data.emergencyLevel ?? "MEDIUM",
                });
            } catch (error) {
                console.error("Error fetching request data:", error);
            }
        };
        if (id) {
            fetchRequestData();
        }
    }, [apiService, id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, emergencyLevel: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiService.put<Request>(`/requests/${id}`, formData);
            router.push("/requests/my-requests");
        } catch (error) {
            console.error("Error updating request:", error);
            router.push("/");
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await apiService.delete(`/requests/${id}`);
            setDeleteModalOpen(false);
            router.push("/requests/my-requests");
        } catch (error) {
            console.error("Error deleting request:", error);
            setDeleteModalOpen(false);
        } finally {
            setLoading(false);
        }
    };

    if (!requestData) return <div className="text-center py-8">Loading...</div>;

    return (
        <>
            <div className="background-sea-layer" />
            <Header />

            <div className="max-w-3xl mx-auto p-8">
                <form onSubmit={handleSubmit} className="card w-full max-w-2xl bg-base-200 shadow-xl p-8 space-y-6">
                    <h2 className="text-2xl font-bold text-center">Edit Request</h2>

                    <div className="form-control">
                        <label className="label block">Title</label>
                        <input
                            name="title"
                            type="text"
                            placeholder="Short title for your request"
                            className="input input-bordered w-full"
                            value={formData.title ?? ""}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label block">Description</label>
                        <textarea
                            name="description"
                            className="textarea textarea-bordered w-full"
                            placeholder="Describe the request in detail"
                            rows={5}
                            value={formData.description ?? ""}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label block">Contact Information</label>
                        <input
                            name="contactInfo"
                            type="text"
                            placeholder="Email / Phone etc."
                            className="input input-bordered w-full"
                            value={formData.contactInfo ?? ""}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label block">Location</label>
                        <input
                            name="location"
                            type="text"
                            placeholder="e.g. Zurich City Center"
                            className="input input-bordered w-full"
                            value={formData.location ?? ""}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label block">Emergency Level</label>
                        <select
                            name="emergencyLevel"
                            className="select select-bordered w-full"
                            value={formData.emergencyLevel ?? "MEDIUM"}
                            onChange={handleSelectChange}
                            required
                        >
                            <option value="HIGH">HIGH</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="LOW">LOW</option>
                        </select>
                    </div>

                    <div className="flex justify-center gap-4">
                        <button type="submit" className="btn btn-primary">Submit</button>
                        <button
                            type="button"
                            className="btn btn-error"
                            onClick={() => setDeleteModalOpen(true)}
                        >
                            Delete
                        </button>
                    </div>
                </form>
            </div>

            {/* Delete confirmation modal */}
            {isDeleteModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Are you sure?</h3>
                        <p className="py-4">This action is permanent and cannot be undone.</p>
                        <div className="modal-action">
                            <button
                                onClick={handleDelete}
                                className={`btn btn-error ${loading ? "loading" : ""}`}
                            >
                                Confirm
                            </button>
                            <button onClick={() => setDeleteModalOpen(false)} className="btn">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EditRequest;
