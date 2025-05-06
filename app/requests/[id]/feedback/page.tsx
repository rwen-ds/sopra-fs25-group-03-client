"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import { useRouter } from "next/navigation"; // use NextJS router for navigation
import { useApi } from "@/hooks/useApi";
import { useParams } from "next/navigation";
import { useState } from "react";
import LoggedIn from "@/components/LoggedIn";
import { Request } from "@/types/request";
import ErrorAlert from "@/components/ErrorAlert";

const Feedback: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();
    const apiService = useApi();
    const [feedback, setFeedback] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async () => {
        try {
            await apiService.put<Request>(`/requests/${id}/feedback`, { feedback });

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
            <div className="background-sea-layer" />
            <LoggedIn />
            <div className="relative card max-w-4xl mx-auto mt-10 p-6 bg-base-200 rounded-lg shadow-md">
                <ErrorAlert
                    message={errorMessage}
                    onClose={() => setErrorMessage(null)}
                    duration={5000}
                    type="error"
                />
                <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-center">Feedback</h3>
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        <div className="form-control">
                            <label htmlFor="feedback" className="label">
                                <span className="text">Feedback</span>
                            </label>
                            <textarea
                                id="feedback"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows={5}
                                placeholder="Please input your feedback!"
                                className="textarea textarea-bordered w-full"
                            />
                        </div>

                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Submit
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push("/requests/my-requests")}
                                className="btn"
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

export default Feedback;
