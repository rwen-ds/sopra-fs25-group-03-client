"use client";

import "@ant-design/v5-patch-for-react-19";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Request } from "@/types/request";
import { useEffect, useState } from "react";
import ErrorAlert from "@/components/ErrorAlert";
import SideBar from "@/components/SideBar";
import BackButton from "@/components/BackButton";
import { useLoadScript, Libraries } from "@react-google-maps/api";
import { Autocomplete } from "@react-google-maps/api";
import "@/styles/globals.css";
import useAuthRedirect from "@/hooks/useAuthRedirect";

const libraries: Libraries = ["places"];

const PostRequest: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const { value: user } = useLocalStorage<User | null>("user", null);
  const userId = user?.id ?? null;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { value: token } = useLocalStorage<string | null>('token', null);


  const { isLoading } = useAuthRedirect(token)

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

  const [formData, setFormData] = useState<Request>({
    id: null,
    title: "",
    description: "",
    contactInfo: "",
    volunteerId: null,
    location: "",
    rating: null,
    feedback: "",
    status: "WAITING",
    emergencyLevel: "MEDIUM", // default to MEDIUM
    creationDate: null,
    posterId: userId,
    publishedAt: "",
    updatedAt: "",
    posterUsername: "",
    volunteerUsername: "",
    latitude: null,
    longitude: null,
    countryCode: ""
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, emergencyLevel: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // validation
    if (formData.location && (formData.latitude === null || formData.longitude === null)) {
      setErrorMessage("Please select a valid address from the dropdown list or keep it empty");
      return;
    }
    try {
      await apiService.post<Request>(`/requests?posterId=${userId}`, formData);
      router.push("/logged-in");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(`Error while posting the request: ${error.message}`);
      } else {
        console.error("Error:", error);
      }
    }
  };

  const handleAutoFillEmail = () => {
    if (userEmail) {
      setFormData(prev => ({ ...prev, contactInfo: userEmail }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-dots loading-xs"></span>
      </div>
    );
  }

  return (
    <>
      <BackButton />
      <div className="flex h-screen">
        {/* Sidebar */}
        <SideBar />


        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto relative">
          <ErrorAlert
            message={errorMessage}
            onClose={() => setErrorMessage(null)}
            duration={5000}
            type="error"
          />

          <form
            onSubmit={handleSubmit}
            className="card w-full max-w-xl bg-base-200 shadow-sm p-8 space-y-6 mx-auto mt-10"
          >
            <h2 className="text-xl font-bold text-center">Post a New Request</h2>

            <div className="form-control">
              <label className="label font-medium block">
                Title <span className="text-red-500">*</span>
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
              <label className="label font-medium block">Description
                <span className="text-red-500">*</span>
                <span className="label-text-alt ml-2">{(formData.description?.length || 0)}/250</span>
              </label>
              <textarea
                name="description"
                value={formData.description ?? ""}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={5}
                placeholder="Describe the request in detail"
                required
                maxLength={250}
              ></textarea>

              {(formData.description?.length || 0) > 250 && (
                <span className="text-error text-xs mt-1">
                  Description cannot exceed 250 characters
                </span>
              )}
            </div>

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
                    onChange={handleChange}
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

            <div className="form-control">
              <label className="label font-medium block">Emergency Level <span className="text-red-500">*</span></label>
              <select
                name="emergencyLevel"
                value={formData.emergencyLevel ?? ""}
                onChange={handleSelectChange}
                className="select select-bordered w-full invalid:border-red-500"
                required
              >
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button type="submit" className="btn btn-neutral w-32">
                Submit
              </button>
              <button
                type="button"
                className="btn btn-outline w-32"
                onClick={() => router.push("/logged-in")}
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
