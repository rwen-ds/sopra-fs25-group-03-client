"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import { useRouter } from "next/navigation"; // use NextJS router for navigation
import { useApi } from "@/hooks/useApi";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Request } from "@/types/request";
import ErrorAlert from "@/components/ErrorAlert";
import SideBar from "@/components/SideBar";
import BackButton from "@/components/BackButton";

const Feedback: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();
    const apiService = useApi();
    const [feedback, setFeedback] = useState("");
    const [rating, setRating] = useState<number>(0); // Add rating state (1-5)
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [ratingError, setRatingError] = useState<string | null>(null); // New state for rating error

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if rating is selected
        if (rating === 0) {
            setRatingError("Rating is required."); // Show error if rating is not selected
            return;
        }

        try {
            // Submit feedback with rating
            await apiService.put<Request>(`/requests/${id}/feedback`, { feedback, rating });

            // Navigate to the user overview
            router.push("/requests/my-requests");
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(`Error giving feedback: ${error.message}`);
            } else {
                console.error("Error giving feedback:", error);
            }
        }
    };

    return (
        <>
            <BackButton />
            <div className="flex h-screen">
                <SideBar />
                <div className="flex-1 p-6 overflow-auto">
                    <div className="relative card max-w-4xl mx-auto mt-10 p-8 bg-base-200 rounded-xl shadow-sm">
                        <ErrorAlert
                            message={errorMessage}
                            onClose={() => setErrorMessage(null)}
                            duration={5000}
                            type="error"
                        />
                        <div className="space-y-6">
                            <h3 className="text-3xl font-bold text-center">Feedback</h3>

                            <form onSubmit={handleSubmit}>
                                {/* DaisyUI Rating Section */}
                                <div className="form-control mt-6">
                                    <label htmlFor="rating" className="label font-semibold">
                                        Rate your experience
                                    </label>
                                    <div className="rating rating-lg flex justify-center gap-3 mb-6">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <input
                                                key={star}
                                                type="radio"
                                                name="rating-1"
                                                className="mask mask-star-2"
                                                aria-label={`${star} star`}
                                                checked={rating === star}
                                                onChange={() => setRating(star)} // Update rating state
                                            />
                                        ))}
                                    </div>
                                    {ratingError && <p className="text-red-500 text-sm">{ratingError}</p>} {/* Display rating error */}
                                </div>

                                {/* Feedback Section */}
                                <div className="form-control">
                                    <label htmlFor="feedback" className="label font-semibold">
                                        Your Feedback
                                    </label>
                                    <textarea
                                        id="feedback"
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        rows={5}
                                        placeholder="Please share your thoughts here..."
                                        className="textarea textarea-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg p-3"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-center gap-6 mt-8">
                                    <button
                                        type="submit"
                                        className="btn btn-neutral transition duration-300 w-38"
                                        disabled={rating === 0} // Disable if no rating selected
                                    >
                                        Submit Feedback
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.push("/requests/my-requests")}
                                        className="btn btn-outline transition duration-300 w-38"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Feedback;
