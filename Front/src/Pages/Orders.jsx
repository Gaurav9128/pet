import React, { useContext, useEffect, useState } from 'react';
import Title from '../Components/Title';
import axios from 'axios';
import { StoreContext } from '../context/StoreContext';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(StoreContext);
  const [orderData, setOrderData] = useState([]);

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [returnReason, setReturnReason] = useState('');

  // LOAD ORDERS
  const loadOrderData = async () => {
    try {
      if (!token) return;

      const res = await axios.post(
        backendUrl + '/api/order/userorders',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const allItems = [];

        res.data.orders.forEach(order => {
          const orderFinalAmount = Number(order.amount || 0);
          const orderSubTotal = order.items.reduce(
            (sum, i) => sum + Number(i.price || 0) * Number(i.quantity || 0),
            0
          );

          order.items.forEach(item => {
            const itemTotal = Number(item.price || 0) * Number(item.quantity || 0);
            const itemFinal =
              orderSubTotal > 0 ? (orderFinalAmount / orderSubTotal) * itemTotal : itemTotal;

            allItems.push({
              ...item,
              status: order.status,
              paymentMethod: order.paymentMethod,
              date: order.date,
              mongoOrderId: order._id,
              uniqueOrderId: order.orderUniqueId,
              returnStatus: item.returnStatus || '',
              finalPrice: Number(itemFinal.toFixed(2))
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

  // SUBMIT RETURN REQUEST
  const submitReturnRequest = async () => {
    if (!returnReason) {
      alert('Please select a return reason');
      return;
    }

    try {
      const res = await axios.post(
        backendUrl + '/api/order/returnRequest',
        {
          orderId: selectedItem.mongoOrderId,
          itemId: selectedItem._id,
          reason: returnReason
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setShowReturnModal(false);
        setReturnReason('');
        setSelectedItem(null);
        loadOrderData();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="border-t pt-16 bg-gray-50 min-h-screen">
      <div className="text-2xl mb-6">
        <Title text1="MY" text2="ORDERS" />
      </div>

      <div className="space-y-4">
        {orderData.map((item, index) => (
          <div
            key={index}
            className="py-4 px-4 md:px-6 border rounded-xl shadow-sm flex flex-col md:flex-row md:justify-between gap-4 bg-white"
          >
            {/* LEFT */}
            <div className="flex gap-6 text-sm items-center">
              <img
                className="w-16 sm:w-20 rounded-lg"
                src={Array.isArray(item.image) ? item.image[0] : item.image || '/placeholder.png'}
                alt={item.name}
              />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-500 mt-1">
                  Order ID: <span className="text-blue-600">{item.uniqueOrderId}</span>
                </p>
                <p className="mt-1 text-gray-600">
                  Qty: {item.quantity} {item.size && `| Size: ${item.size}`}
                </p>
                <p className="mt-1 text-xs text-gray-400">{new Date(item.date).toDateString()}</p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col justify-between md:items-end gap-3 pr-3">
              {/* PRICE */}
              <div className="text-right">
                <p className="text-xs text-gray-500 line-through">
                  {currency}{(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}
                </p>
                <p className="text-sm font-semibold mt-1">
                  Total: <span className="text-green-600">{currency}{Number(item.finalPrice).toFixed(2)}</span>
                </p>
              </div>

              {/* RETURN BUTTON / STATUS */}
              {!item.returnStatus && (
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setShowReturnModal(true);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Request Return
                </button>
              )}

              {item.returnStatus && (
                <span className={`text-sm font-medium ${
                  item.returnStatus === 'Pending' ? 'text-yellow-600' :
                  item.returnStatus === 'Approved' ? 'text-green-600' :
                  item.returnStatus === 'Rejected' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {item.returnStatus}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* RETURN MODAL */}
      {showReturnModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 md:p-8 w-[90%] md:w-[450px] rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-5 text-center text-gray-800">Return Product</h2>

            <div className="text-sm text-gray-700 mb-5 space-y-1">
              <p><span className="font-medium">Product:</span> {selectedItem.name}</p>
              <p><span className="font-medium">Qty:</span> {selectedItem.quantity}</p>
              <p><span className="font-medium">Order ID:</span> {selectedItem.uniqueOrderId}</p>
            </div>

            <select
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={submitReturnRequest}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
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
