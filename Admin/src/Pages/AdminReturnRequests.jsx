import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminReturnRequests = ({ backendUrl, adminToken }) => {
  const [returns, setReturns] = useState([]);
  const [loadingAction, setLoadingAction] = useState(null);

  // LOAD RETURN REQUESTS
  const loadReturns = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/admin/return-requests",
        { headers: { token: adminToken } }
      );

      if (data.success) {
        const sorted = [...data.returnRequests].sort((a, b) => {
          if (a.item.returnStatus === "Pending") return -1;
          if (b.item.returnStatus === "Pending") return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setReturns(sorted);
      }
    } catch {
      toast.error("Failed to load return requests");
    }
  };

  // UPDATE STATUS
  const updateStatus = async (orderId, productId, status, reason = "") => {
    const actionKey = `${orderId}-${productId}`;

    try {
      setLoadingAction(actionKey);

      const { data } = await axios.post(
        backendUrl + "/api/admin/update-return-status",
        { orderId, productId, status, reason },
        { headers: { token: adminToken } }
      );

      if (data.success) {
        toast.success(data.message);
        loadReturns();
      }
    } catch {
      toast.error("Action failed");
    } finally {
      setLoadingAction(null);
    }
  };

  // REJECT HANDLER
  const handleReject = (orderId, productId) => {
    const reason = prompt("Enter rejection reason");
    if (!reason) return toast.error("Rejection reason required");
    updateStatus(orderId, productId, "Rejected", reason);
  };

  useEffect(() => {
    loadReturns();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Return Requests</h2>

      {returns.map((req) => {
        const isProcessing =
          loadingAction === `${req.orderId}-${req.item.productId}`;

        return (
          <div
            key={`${req.orderId}-${req.item.productId}`}
            className="border rounded-lg p-4 mb-4 flex gap-4"
          >
            <img
              src={req.item.image[0]}
              alt={req.item.name}
              className="w-24 h-24 object-cover rounded"
            />

            <div className="flex-1">
              <p className="font-bold text-lg">{req.item.name}</p>
              <p>Order ID: {req.orderUniqueId}</p>
              <p>Price: ₹{req.item.price}</p>
              <p>
                Status:{" "}
                <b className="capitalize">{req.item.returnStatus}</b>
              </p>

              {req.item.returnStatus === "Pending" && (
                <div className="mt-3 flex gap-3">
                  <button
                    disabled={isProcessing}
                    onClick={() =>
                      updateStatus(
                        req.orderId,
                        req.item.productId,
                        "Approved"
                      )
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Approve
                  </button>

                  <button
                    disabled={isProcessing}
                    onClick={() =>
                      handleReject(req.orderId, req.item.productId)
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminReturnRequests;
