"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Request } from "@/types/request";
import { useApi } from "@/hooks/useApi";
import SideBar from "@/components/SideBar";
import ErrorAlert from "@/components/ErrorAlert";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import useLocalStorage from "@/hooks/useLocalStorage";


const MyRequest: React.FC = () => {
  const apiService = useApi();
  const [requests, setRequests] = useState<Request[]>([]);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterEmergencyLevel, setFilterEmergencyLevel] = useState("All");
  const [search, setSearch] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteReason, setDeleteReason] = useState<string>("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { value: token } = useLocalStorage<string | null>('token', null);

  const { isLoading } = useAuthRedirect(token)

  useEffect(() => {
    if (isLoading) return;
    const fetchRequests = async () => {
      const res = await apiService.get<Request[]>("/requests/me");
      const filteredRequests = res
        .filter(req => req.status !== "DELETED")
        .reverse();
      setRequests(filteredRequests);
    };
    fetchRequests();
  }, [apiService, isLoading]);

  const handleDone = async (requestId: number | null) => {
    try {
      await apiService.put(`/requests/${requestId}/done`, {});
      router.push(`/requests/${requestId}/feedback`);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(`Failed to complete request: ${error.message}`);
      } else {
        console.error("Failed to complete request:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (deleteTargetId == null) return;
    setLoadingDelete(true);
    try {
      await apiService.put(`/requests/${deleteTargetId}/delete`, {
        reason: deleteReason,
      });
      setRequests(prev => prev.filter(r => r.id !== deleteTargetId));
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(`Error deleting request: ${error.message}`);
      } else {
        console.error("Error deleting request:", error);
      }
    } finally {
      setLoadingDelete(false);
      setDeleteTargetId(null);
      setDeleteReason("");
      const modal = document.getElementById("delete_modal") as HTMLDialogElement;
      modal?.close();
    }
  };


  // Apply search and filter logic
  const filteredRequests = requests.filter((req) => {
    // Search filter
    const matchesSearch =
      req.title?.toLowerCase().includes(search.toLowerCase()) ||
      req.description?.toLowerCase().includes(search.toLowerCase());

    // Emergency level filter
    const matchesEmergency =
      filterEmergencyLevel === "All" ||
      req.emergencyLevel?.toLowerCase() === filterEmergencyLevel.toLowerCase();

    return matchesSearch && matchesEmergency;
  });

  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="flex">
          <SideBar />
          <div className="relative p-8 flex-1">
            <ErrorAlert
              message={errorMessage}
              onClose={() => setErrorMessage(null)}
              duration={5000}
              type="error"
            />
            <div className="text-left mb-8 mt-10">
              <h2 className="text-xl font-bold text-left mb-8">My Requests</h2>
            </div>

            {/* Search & Filter */}
            <div className="grid sm:grid-cols-2 md:flex md:flex-wrap gap-4 items-center mb-6">
              <input
                type="text"
                className="input w-full sm:w-64"
                placeholder="Search title or description"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="select w-full sm:w-48"
                value={filterEmergencyLevel}
                onChange={(e) => setFilterEmergencyLevel(e.target.value)}
              >
                <option value="All">All Emergency Levels</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <button
                className="btn btn-outline btn-sm w-full sm:w-auto"
                onClick={() => {
                  setSearch('');
                  setFilterEmergencyLevel('All');
                }}
              >
                Clear Filters
              </button>
            </div>

            {/* Table */}
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Emergency Level</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => {
                  if (req.id == null) return null;
                  return (
                    <tr key={req.id}
                      className="hover:bg-gray-50 group relative cursor-pointer"
                      onClick={(e) => {
                        if (!(e.target instanceof HTMLButtonElement)) {
                          router.push(`/requests/${req.id}`);
                        }
                      }}
                    >
                      <td className="max-w-xs truncate">
                        {req.title}
                      </td>
                      <td className="max-w-xs truncate">{req.description || "N/A"}</td>
                      <td>
                        <div className="flex flex-col">
                          <span className={`badge badge-outline badge-sm px-2 ${req.emergencyLevel === 'HIGH'
                            ? 'badge-error'
                            : req.emergencyLevel === 'MEDIUM'
                              ? 'badge-warning'
                              : 'badge-success'}`}
                          >
                            {req.emergencyLevel || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <span className={`badge badge-outline badge-sm px-2 ${req.status === 'DONE'
                            ? 'badge-success'
                            : 'badge-primary'}`}
                          >
                            {req.status || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td>
                        {req.creationDate
                          ? new Date(req.creationDate).toLocaleDateString()
                          : null}
                      </td>
                      <td className="flex gap-2">
                        {req.status !== "DONE" && req.status !== "COMPLETED" && (
                          <button
                            onClick={() => router.push(`/requests/${req.id}/edit`)}
                            className="btn btn-outline btn-sm"
                          >
                            Edit
                          </button>
                        )}
                        {req.status === "COMPLETED" && (
                          <button
                            onClick={() => handleDone(req.id)}
                            className="btn btn-primary btn-sm"
                          >
                            Done
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setDeleteTargetId(req.id);
                            const modal = document.getElementById("delete_modal") as HTMLDialogElement;
                            modal?.showModal();
                          }}
                          className="btn btn-error btn-outline btn-sm"
                        >
                          Delete
                        </button>

                        {req.status === "DONE" && !req.rating && (
                          <button
                            onClick={() => router.push(`/requests/${req.id}/feedback`)}
                            className="btn btn-warning btn-outline btn-sm"
                          >
                            Feedback
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

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
                      type="button"
                      onClick={handleDelete}
                      className={`btn btn-error ${loadingDelete ? "loading" : ""}`}
                    >
                      Confirm
                    </button>
                  </form>
                </div>
              </div>
            </dialog>

          </div>
        </div>
      </div >
    </>
  );
};

export default MyRequest;
