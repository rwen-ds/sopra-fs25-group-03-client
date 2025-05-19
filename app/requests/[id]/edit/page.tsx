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
import useAuthRedirect from "@/hooks/useAuthRedirect";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";

const libraries: Libraries = ["places"];

const EditRequest: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();
    const apiService = useApi();
    const [requestData, setRequestData] = useState<Request | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [formData, setFormData] = useState<Request>({
        id: null,
        title: "",
        description: "",
        contactInfo: "",
        volunteerId: null,
        location: "",
        rating: null,
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
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { value: token } = useLocalStorage<string | null>('token', null);
    const { isLoading } = useAuthRedirect(token)
    const [originalLocation, setOriginalLocation] = useState("");

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
        const fetchUserInfo = async () => {
            try {
                const response = await apiService.get<User>("/users/me");
                setUserEmail(response.email);
            } catch (error) {
                console.error("Failed to fetch user information:", error);
            }
        };

        fetchUserInfo();
    }, [apiService]);

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
                setOriginalLocation(data.location ?? "");
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

    const handleAutoFillEmail = () => {
        if (userEmail) {
            setFormData(prev => ({ ...prev, contactInfo: userEmail }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isLocationChanged = formData.location !== originalLocation;
        const hasValidCoordinates = formData.latitude !== null && formData.longitude !== null;

        if (isLocationChanged && !hasValidCoordinates) {
            setErrorMessage("Please select a valid address from the dropdown list");
            return;
        }
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

    if (isLoading || !requestData) return <span className="loading loading-dots loading-xs"></span>;

    return (
        <>
            <BackButton />
            <div className="flex h-[calc(100vh-80px)]">
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
                            <div className="form-control">
                                <label className="label font-medium block">
                                    Title
                                    <span className="label-text-alt ml-2">
                                        {formData.title?.length || 0}/100
                                    </span>
                                </label>
                                <input
                                    name="title"
                                    value={formData.title ?? ""}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Short title for your request"
                                    className={`input input-bordered w-full ${(formData.title?.length || 0) > 100 ? "input-error" : ""
                                        }`}
                                    maxLength={100}
                                    required
                                />
                                {(formData.title?.length || 0) > 100 && (
                                    <span className="text-error text-xs mt-1">
                                        Title cannot exceed 100 characters
                                    </span>
                                )}
                            </div>
                            <div className="form-control">
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
                                /></div>

                            <div className="form-control">
                                <label className="label font-medium block">Contact Information</label>
                                <div className="relative w-full">
                                    <input
                                        name="contactInfo"
                                        value={formData.contactInfo ?? ""}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Email / Phone etc."
                                        className="input input-bordered w-full pr-24"
                                    />
                                    <div className="absolute inset-y-0 right-1 flex items-center">
                                        <button
                                            type="button"
                                            className="btn btn-sm text-xs"
                                            onClick={handleAutoFillEmail}
                                        >
                                            Auto Fill Email
                                        </button>
                                    </div>
                                </div>
                            </div>

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
                                            onChange={(e) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    location: e.target.value,
                                                    // 如果用户手动输入而不是从下拉菜单选择，清空坐标
                                                    ...(e.target.value !== originalLocation && {
                                                        latitude: null,
                                                        longitude: null,
                                                        countryCode: ""
                                                    })
                                                }));
                                            }}
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
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

        </>
    );
};

export default EditRequest;