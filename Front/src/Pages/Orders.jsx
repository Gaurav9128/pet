import React, { useContext, useEffect, useState } from "react";
import Title from "../Components/Title";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import OrderTracker from "../Components/OrderTracker";
import { Minus, Plus, AlertCircle } from "lucide-react";

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
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-300">
    <div className="bg-white w-full max-w-[480px] rounded-[1rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden border border-gray-100">
      
      {/* Top Header */}
      <div className="px-8 pt-8 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900 leading-tight text-center">Return</h2>
          <p className="text-gray-400 text-sm font-medium">Order: #{selectedItem.uniqueOrderId?.split('-').pop()}</p>
        </div>
        <button 
          onClick={() => setShowReturnModal(false)}
          className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div className="px-8 pb-8 space-y-8">
        {(() => {
          const totalPaid = Number(selectedItem.finalPrice || 0);
          const totalQty = Number(selectedItem.quantity || 1);
          const refundAmount = (returnQuantity * (totalPaid / totalQty)).toFixed(0);

          return (
            <>
              {/* Product Info Block */}
              <div className="flex items-center gap-4 py-4 border-b border-gray-50">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-50">
                  {selectedItem.image ? (
                    <img src={selectedItem.image} alt="product" className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 truncate">{selectedItem.name}</h3>
                  <p className="text-xs font-semibold text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded-md mt-1">
                    {selectedItem.size || "Standard Size"}
                  </p>
                </div>
              </div>

              {/* Interaction Controls */}
              <div className="space-y-5">
                {/* Quantity Control */}
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-bold text-gray-700">How many to return?</span>
                  <div className="flex items-center bg-gray-100 rounded-2xl p-1 shadow-inner">
                    <button 
                      onClick={() => setReturnQuantity(Math.max(1, returnQuantity - 1))}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-lg font-bold hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                    >−</button>
                    <span className="w-12 text-center font-black text-gray-800 text-lg">{returnQuantity}</span>
                    <button 
                      onClick={() => setReturnQuantity(Math.min(totalQty, returnQuantity + 1))}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-lg font-bold hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                    >+</button>
                  </div>
                </div>

                {/* Reason Selection */}
                <div className="space-y-2">
                  <span className="text-[15px] font-bold text-gray-700 ml-1">Reason for Return</span>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full bg-gray-50 border-none ring-1 ring-gray-200 text-gray-700 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer appearance-none font-medium"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'3\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', backgroundSize: '1rem' }}
                  >
                    <option value="">Choose one...</option>
                    <option value="Damaged Product">📦 Damaged Product</option>
                    <option value="Wrong Item Received">🔄 Wrong Item Received</option>
                    <option value="Size Issue">📏 Size Issue</option>
                    <option value="Other">📝 Other Reason</option>
                  </select>
                </div>
              </div>
              &nbsp;
              {/* Refund Summary - BIG & BOLD */}
              <div className="bg-gray-900  p-6 text-white relative overflow-hidden group">
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1 text-center">Refund Amount</p>
                    <p className="text-4xl font-black tracking-tighter text-blue-400">₹{refundAmount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] text-gray-400 font-medium leading-tight">Instant refund <br/>to source wallet</p>
                  </div>
                </div>
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-blue-500/20"></div>
              </div>
              &nbsp;
              {/* Final Action */}
              <div className="pt-2">
                <button
                  onClick={submitReturnRequest}
                  disabled={!returnReason}
                  className="w-full py-5 bg-blue-600 text-white font-black text-lg rounded-[1.5rem] hover:bg-blue-700 hover:shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all active:scale-[0.97] disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none shadow-xl shadow-blue-100"
                >
                  Initiate Return
                </button>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  </div>
)}
    </div>

  );

};

export default Orders;