"use client";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Request } from "@/types/request";
import ErrorAlert from "@/components/ErrorAlert";
import { useLoadScript, Libraries } from "@react-google-maps/api";
import { Autocomplete } from "@react-google-maps/api";
import "@/styles/globals.css";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import useLocalStorage from "@/hooks/useLocalStorage";
import AdminSideBar from "@/components/AdminSideBar";
import { User } from "@/types/user";

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
        countryCode: null
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { value: token } = useLocalStorage<string | null>('token', null);
    const { isLoading } = useAuthRedirect(token)
    const [originalLocation, setOriginalLocation] = useState("");
    const { value: user } = useLocalStorage<User | null>('user', null);


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
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value === "" ? null : value,
            ...(name === "location" && value === null && {
                latitude: null,
                longitude: null,
                countryCode: null,
            })
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, emergencyLevel: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isLocationChanged = formData.location !== originalLocation;
        const hasValidCoordinates = formData.latitude !== null && formData.longitude !== null;
        const isLocationEmpty = formData.location === "";

        if (isLocationChanged && !hasValidCoordinates && !isLocationEmpty) {
            setErrorMessage("Please select a valid address from the dropdown list or keep it empty");
            return;
        }
        try {
            await apiService.put<Request>(`/requests/${id}`, formData);
            router.push("/admin/requests");
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(`Error updating request: ${error.message}`);
            } else {
                console.error("Error updating request:", error);
            }
        }
    };

    if (isLoading || !requestData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-dots loading-xs"></span>
            </div>
        );
    }

    if (!user?.isAdmin) {
        router.push("/login")
    }

    return (
        <>
            <div className="flex h-screen">
                <AdminSideBar />
                <div className="flex-1 p-8 overflow-y-auto relative">
                    <ErrorAlert
                        message={errorMessage}
                        onClose={() => setErrorMessage(null)}
                        duration={5000}
                        type="error"
                    />
                    <form onSubmit={handleSubmit} className="card w-full max-w-xl bg-base-200 shadow-sm p-8 space-y-6 mx-auto mt-10">
                        <h2 className="text-xl font-bold text-center">Edit Request</h2>

                        <div className="form-control w-full mt-6 space-y-4">
                            <div className="form-control">
                                <label className="label font-medium block">
                                    Title
                                </label>
                                <input
                                    name="title"
                                    value={formData.title ?? ""}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Short title for your request"
                                    className={"input input-bordered w-full"}
                                    maxLength={250}
                                    required
                                />
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
                                    maxLength={2000}
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
                                        maxLength={100}
                                    />
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
                                                    ...(e.target.value !== originalLocation && {
                                                        latitude: null,
                                                        longitude: null,
                                                        countryCode: ""
                                                    })
                                                }));
                                            }}
                                            type="text"
                                            placeholder="e.g. Zurich"
                                            className="input input-bordered w-full"
                                        />
                                    </Autocomplete>
                                ) : (
                                    <input
                                        name="location"
                                        value={formData.location ?? ""}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="e.g. Zurich"
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

                            <div className="flex justify-center gap-4 pt-4">
                                <button type="submit" className="btn btn-neutral w-32">
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline w-32"
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