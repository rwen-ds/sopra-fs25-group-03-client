"use client";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SideBar from "@/components/SideBar";
import { Request } from "@/types/request";
import ErrorAlert from "@/components/ErrorAlert";
import BackButton from "@/components/BackButton";
import { useLoadScript, Libraries } from "@react-google-maps/api";
import { Autocomplete } from "@react-google-maps/api";
import "@/styles/globals.css";

const libraries: Libraries = ["places"];

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
        publishedAt: null,
        updatedAt: null,
        posterUsername: "",
        volunteerUsername: "",
        latitude: null,
        longitude: null,
        countryCode: ""
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [deleteReason, setDeleteReason] = useState<string>("");

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries,
    });

    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

    const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
        setAutocomplete(autocomplete);
    };

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();

            const addressComponents = place.address_components || [];
            const countryComponent = addressComponents.find(
                (component: google.maps.GeocoderAddressComponent) =>
                    component.types.includes("country")
            );

            const countryCode = countryComponent?.short_name || "";
            const location = place.geometry?.location;

            setFormData(prev => ({
                ...prev,
                location: place.formatted_address || "",
                latitude: location?.lat() || null,
                longitude: location?.lng() || null,
                countryCode: countryCode
            }));
        }
    };

    useEffect(() => {
        if (loadError) {
            setErrorMessage("Failed to load Google Maps services. Please refresh the page or try again later.");
        }
    }, [loadError]);

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
            await apiService.put(`/requests/${id}/delete`, {
                reason: deleteReason,
            });
            router.push("/requests/my-requests");
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(`Error deleting request: ${error.message}`);
            } else {
                console.error("Error deleting request:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!requestData) return <div className="text-center py-8">Loading...</div>;

    return (
        <>
            <BackButton />
            <div className="flex h-[calc(100vh-80px)] overflow-hidden">
                <SideBar />
                <div className="relative flex-1 p-10 flex justify-center items-center">
                    <ErrorAlert
                        message={errorMessage}
                        onClose={() => setErrorMessage(null)}
                        duration={5000}
                        type="error"
                    />
                    <form onSubmit={handleSubmit} className="card bg-base-200 rounded-2xl shadow-lg p-8 w-full max-w-xl overflow-y-auto">
                        <h2 className="text-xl font-bold text-center">Edit Request</h2>

                        <div className="form-control w-full mt-6 space-y-4">
                            <label className="label">
                                <span className="label-text">Title</span>
                            </label>
                            <input
                                name="title"
                                type="text"
                                placeholder="Short title for your request"
                                className="input input-bordered w-full"
                                value={formData.title ?? ""}
                                onChange={handleChange}
                                required
                            />

                            <label className="label">
                                <span className="label-text">Description</span>
                            </label>
                            <textarea
                                name="description"
                                className="textarea textarea-bordered w-full"
                                placeholder="Describe the request in detail"
                                rows={5}
                                value={formData.description ?? ""}
                                onChange={handleChange}
                                required
                            />

                            <label className="label">
                                <span className="label-text">Contact Information</span>
                            </label>
                            <input
                                name="contactInfo"
                                type="text"
                                placeholder="Email / Phone etc."
                                className="input input-bordered w-full"
                                value={formData.contactInfo ?? ""}
                                onChange={handleChange}
                                required
                            />

                            <div className="form-control">
                                <label className="label font-medium block">Location</label>
                                {isLoaded ? (
                                    <Autocomplete
                                        onLoad={onLoad}
                                        onPlaceChanged={onPlaceChanged}
                                        options={{
                                            componentRestrictions: {
                                                country: ["ch", "de", "it", "fr"]
                                            },
                                            types: ["geocode"]
                                        }}>
                                        <input
                                            name="location"
                                            value={formData.location ?? ""}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="e.g. Zurich City Center"
                                            className="input input-bordered w-full"
                                        />
                                    </Autocomplete>
                                ) : (
                                    <input
                                        name="location"
                                        value={formData.location ?? ""}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="e.g. Zurich City Center"
                                        className="input input-bordered w-full"
                                    />
                                )}
                            </div>

                            <label className="label">
                                <span className="label-text">Emergency Level</span>
                            </label>
                            <select
                                name="emergencyLevel"
                                className="select select-bordered w-full"
                                value={formData.emergencyLevel ?? "MEDIUM"}
                                onChange={handleSelectChange}
                                required
                            >
                                <option value="HIGH">High</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="LOW">Low</option>
                            </select>

                            <div className="flex justify-between mt-6">
                                <button type="submit" className="btn btn-primary w-[48%]">
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-error btn-outline w-[48%]"
                                    onClick={() => {
                                        const modal = document.getElementById("delete_modal") as HTMLDialogElement;
                                        modal?.showModal();
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Delete confirmation modal */}
            <dialog id="delete_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Confirm Deletion</h3>
                    <p className="py-2">Please optionally provide a reason for deletion:</p>
                    <textarea
                        className="textarea textarea-bordered w-full"
                        placeholder="Reason (optional)"
                        rows={3}
                        value={deleteReason}
                        onChange={(e) => setDeleteReason(e.target.value)}
                    />
                    <div className="modal-action">
                        <form method="dialog" className="space-x-2">
                            <button className="btn">Cancel</button>
                            <button
                                className={`btn btn-error ${loading ? "loading" : ""}`}
                                onClick={handleDelete}
                            >
                                Confirm
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>

        </>
    );
};

export default EditRequest;