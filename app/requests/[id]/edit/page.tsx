"use client";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/LoggedIn";
import { Request } from "@/types/request";
import ErrorAlert from "@/components/ErrorAlert";

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
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
                if (error instanceof Error) {
                    setErrorMessage(`Error fetching request data: ${error.message}`);
                } else {
                    console.error("Error fetching request data:", error);
                }
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
            if (error instanceof Error) {
                setErrorMessage(`Error updating request: ${error.message}`);
            } else {
                console.error("Error updating request:", error);
            }
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await apiService.delete(`/requests/${id}`);
            setDeleteModalOpen(false);
            router.push("/requests/my-requests");
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(`Error deleting request: ${error.message}`);
            } else {
                console.error("Error deleting request:", error);
            }
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
            <div className="relative flex items-center justify-center px-4 py-8">
                <ErrorAlert
                    message={errorMessage}
                    onClose={() => setErrorMessage(null)}
                    duration={5000}
                    type="error"
                />
                <form onSubmit={handleSubmit} className="card w-full max-w-xl bg-base-200 shadow-sm p-8 space-y-6">
                    <h2 className="text-xl font-bold text-center">Edit Request</h2>

                    <div className="form-control">
                        <label className="label block">Title</label>
                        <input
                            name="title"
                            type="text"
                            placeholder="Short title for your request"
                            className="input w-full"
                            value={formData.title ?? ""}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label block">Description</label>
                        <textarea
                            name="description"
                            className="textarea w-full"
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
                            className="input w-full"
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
                            className="input w-full"
                            value={formData.location ?? ""}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label block">Emergency Level</label>
                        <select
                            name="emergencyLevel"
                            className="select w-full"
                            value={formData.emergencyLevel ?? "MEDIUM"}
                            onChange={handleSelectChange}
                            required
                        >
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
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
