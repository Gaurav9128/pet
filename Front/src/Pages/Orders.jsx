import React, { useContext, useEffect, useState } from "react";
import Title from "../Components/Title";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import OrderTracker from "../Components/OrderTracker";

const Orders = () => {

  const { backendUrl, token, currency } = useContext(StoreContext);

  const [orderData, setOrderData] = useState([]);

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnQuantity, setReturnQuantity] = useState(1);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // LOAD ORDERS
  const loadOrderData = async () => {

    try {

      if (!token) return;

      const res = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {

        const allItems = [];

        res.data.orders.forEach((order) => {

          const orderFinalAmount = Number(order.amount || 0);

          const orderSubTotal = order.items.reduce(
            (sum, i) => sum + Number(i.price || 0) * Number(i.quantity || 0),
            0
          );

          order.items.forEach((item) => {

            const itemTotal =
              Number(item.price || 0) * Number(item.quantity || 0);

            const itemFinal =
              orderSubTotal > 0
                ? (orderFinalAmount / orderSubTotal) * itemTotal
                : itemTotal;

            allItems.push({
              ...item,
              status: order.status,
              paymentMethod: order.paymentMethod,
              date: order.date,
              mongoOrderId: order._id,
              uniqueOrderId: order.orderUniqueId,
              returnStatus: item.returnStatus || "",
              finalPrice: Number(itemFinal.toFixed(2)),
            });

          });

        });

        setOrderData(allItems.reverse());

      }

    } catch (err) {
      console.log(err);
    }

  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  // PAGINATION LOGIC

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

  const currentOrders = orderData.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orderData.length / ordersPerPage);

  // SUBMIT RETURN

  const submitReturnRequest = async () => {

    if (!returnReason) {
      alert("Please select return reason");
      return;
    }

    try {

      const res = await axios.post(
        backendUrl + "/api/order/returnRequest",
        {
          orderId: selectedItem.mongoOrderId,
          itemId: selectedItem._id,
          reason: returnReason,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {

        setShowReturnModal(false);
        setReturnReason("");
        setSelectedItem(null);

        loadOrderData();

      }

    } catch (err) {
      console.log(err);
    }

  };

  return (

    <div className="border-t pt-16 bg-gray-50 min-h-screen">

      <div className="text-2xl mb-8 text-center">
        <Title text1="MY" text2="ORDERS" />
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-6">

        {currentOrders.map((item, index) => (

          <div
            key={index}
            className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition grid grid-cols-1 lg:grid-cols-[280px_1fr_180px] gap-6 items-center"
          >

            {/* PRODUCT INFO */}

            <div className="flex items-center gap-4">

              <img
                className="w-20 h-20 object-cover rounded-lg border"
                src={
                  Array.isArray(item.image)
                    ? item.image[0]
                    : item.image || "/placeholder.png"
                }
                alt={item.name}
              />

              <div>

                <p className="font-semibold text-gray-800">
                  {item.name}
                </p>

                <p className="text-sm text-gray-500">
                  Order ID :
                  <span className="text-blue-600 ml-1">
                    {item.uniqueOrderId}
                  </span>
                </p>

                <p className="text-sm text-gray-600">
                  Qty : {item.quantity}
                  {item.size && ` | Size: ${item.size}`}
                </p>

                <p className="text-xs text-gray-400">
                  {new Date(item.date).toDateString()}
                </p>

              </div>

            </div>

            {/* ORDER TRACKER */}

            <div className="px-4">
              <OrderTracker status={item.status} />
            </div>

            {/* PRICE */}

            <div className="flex flex-col items-end gap-3 pr-6">

              <div className="text-right">

                <p className="text-xs text-gray-500 line-through">
                  {currency}
                  {(Number(item.price || 0) *
                    Number(item.quantity || 0)).toFixed(2)}
                </p>

                <p className="text-sm font-semibold">
                  Total :
                  <span className="text-green-600 ml-1">
                    {currency}
                    {Number(item.finalPrice).toFixed(2)}
                  </span>
                </p>

              </div>

              {!item.returnStatus && (

                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setShowReturnModal(true);
                  }}
                  className="px-5 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition whitespace-nowrap"
                >
                  Request Return
                </button>

              )}

              {item.returnStatus && (

                <span
                  className={`text-sm font-medium ${item.returnStatus === "Pending"
                      ? "text-yellow-600"
                      : item.returnStatus === "Approved"
                        ? "text-green-600"
                        : item.returnStatus === "Rejected"
                          ? "text-red-600"
                          : "text-gray-600"
                    }`}
                >
                  {item.returnStatus}
                </span>

              )}

            </div>

          </div>

        ))}

      </div>
      &nbsp;

   {/* PAGINATION */}

{totalPages > 1 && (

  <div className="flex justify-center items-center mt-14 pt-6 border-t">

    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">

      {/* PREV BUTTON */}
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
        className={`px-4 py-2 rounded-md text-sm font-medium transition
        ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "hover:bg-gray-100"
        }`}
      >
        Prev
      </button>

      {/* PAGE NUMBERS */}

      {[...Array(totalPages)].map((_, i) => {

        const page = i + 1;

        return (

          <button
            key={i}
            onClick={() => setCurrentPage(page)}
            className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-semibold transition
            ${
              currentPage === page
                ? "bg-orange-500 text-white shadow"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>

        );

      })}

      {/* NEXT BUTTON */}

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
        className={`px-4 py-2 rounded-md text-sm font-medium transition
        ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "hover:bg-gray-100"
        }`}
      >
        Next
      </button>

    </div>

  </div>

)}

      {/* RETURN MODAL */}

      {showReturnModal && selectedItem && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

          <div className="bg-white p-6 md:p-8 w-[90%] md:w-[450px] rounded-2xl shadow-lg border">

            <h2 className="text-xl font-bold mb-5 text-center">
              Return Product
            </h2>

            {(() => {

              const totalPaid = Number(selectedItem.finalPrice || 0);
              const totalQty = Number(selectedItem.quantity || 1);

              const perUnitFinalPrice =
                totalQty > 0 ? totalPaid / totalQty : 0;

              const refundAmount =
                returnQuantity * perUnitFinalPrice;

              return (
                <>
                  <div className="text-sm mb-4 space-y-1 bg-gray-50 p-3 rounded-lg">

                    <p><b>Product:</b> {selectedItem.name}</p>
                    <p><b>Order ID:</b> {selectedItem.uniqueOrderId}</p>
                    <p><b>Size:</b> {selectedItem.size || "N/A"}</p>

                    <p className="text-green-600 font-semibold">
                      Total Paid : ₹{totalPaid.toFixed(2)}
                    </p>

                    <p><b>Available Qty:</b> {totalQty}</p>

                  </div>

                  <div className="mb-4">

                    <label className="block text-sm mb-1">
                      Return Quantity
                    </label>

                    <input
                      type="number"
                      min="1"
                      max={totalQty}
                      value={returnQuantity}
                      onChange={(e) => {

                        const value = Number(e.target.value);

                        if (value > 0 && value <= totalQty) {
                          setReturnQuantity(value);
                        }

                      }}
                      className="w-full border p-3 rounded-lg"
                    />

                  </div>

                  <div className="mb-4 text-sm font-semibold text-red-600">
                    Refund Amount : ₹{refundAmount.toFixed(2)}
                  </div>
                </>
              );

            })()}

            <select
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="w-full border p-3 rounded-lg mb-5"
            >

              <option value="">Select Return Reason</option>
              <option value="Damaged Product">Damaged Product</option>
              <option value="Wrong Item Received">Wrong Item Received</option>
              <option value="Size Issue">Size Issue</option>
              <option value="Quality Not Good">Quality Not Good</option>
              <option value="Other">Other</option>

            </select>

            <div className="flex justify-end gap-4">

              <button
                onClick={() => setShowReturnModal(false)}
                className="px-5 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={submitReturnRequest}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default Orders;