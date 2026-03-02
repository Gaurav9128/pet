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

  const handleReject = (orderId, productId) => {
    const reason = prompt("Enter rejection reason");
    if (!reason) return toast.error("Rejection reason required");
    updateStatus(orderId, productId, "Rejected", reason);
  };

  useEffect(() => {
    loadReturns();
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">
        Return Requests
      </h2>

      {returns.map((req) => {
        const isProcessing =
          loadingAction === `${req.orderId}-${req.item.productId}`;

        const quantity = req.item.returnQuantity || req.item.quantity;
        const price = req.item.price;
        const returnAmount = quantity * price;

        return (
          <div
            key={`${req.orderId}-${req.item.productId}`}
            className="border rounded-lg p-5 mb-6 shadow-sm bg-white"
          >
            <div className="flex flex-col sm:flex-row gap-6">
              
              {/* Product Image */}
              <img
                src={req.item.image[0]}
                alt={req.item.name}
                className="w-32 h-32 object-cover rounded"
              />

              {/* Product Details */}
              <div className="flex-1">

                <h3 className="text-lg font-bold mb-2">
                  {req.item.name}
                </h3>

                <div className="bg-gray-50 p-3 rounded text-sm space-y-1">

                  <p>
                    <span className="font-semibold">Order ID:</span>{" "}
                    {req.orderUniqueId}
                  </p>

                  <p>
                    <span className="font-semibold">Quantity:</span>{" "}
                    {quantity}
                  </p>

                  <p>
                    <span className="font-semibold">Size:</span>{" "}
                    {req.item.size || "N/A"}
                  </p>

                  <p>
                    <span className="font-semibold">Price (per item):</span>{" "}
                    ₹{price}
                  </p>

                  <p className="font-semibold text-red-600">
                    Return Amount: ₹{returnAmount}
                  </p>

                  {req.orderTotal && (
                    <>
                      <p>
                        <span className="font-semibold">
                          Original Order Total:
                        </span>{" "}
                        ₹{req.orderTotal}
                      </p>

                      <p className="font-semibold text-green-600">
                        Updated Total After Return: ₹
                        {req.updatedTotal || req.orderTotal - returnAmount}
                      </p>
                    </>
                  )}

                  <p className="mt-2">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        req.item.returnStatus === "Approved"
                          ? "text-green-600"
                          : req.item.returnStatus === "Rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {req.item.returnStatus}
                    </span>
                  </p>
                </div>

                {/* ACTION BUTTONS */}
                {req.item.returnStatus === "Pending" && (
                  <div className="mt-4 flex gap-4 flex-wrap">
                    <button
                      disabled={isProcessing}
                      onClick={() =>
                        updateStatus(
                          req.orderId,
                          req.item.productId,
                          "Approved"
                        )
                      }
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      {isProcessing ? "Processing..." : "Approve"}
                    </button>

                    <button
                      disabled={isProcessing}
                      onClick={() =>
                        handleReject(req.orderId, req.item.productId)
                      }
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminReturnRequests;