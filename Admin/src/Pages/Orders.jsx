import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterOrderId, setFilterOrderId] = useState('');

  const getRemovedOrders = () => {
    const removed = localStorage.getItem('removedOrders');
    return removed ? JSON.parse(removed) : [];
  };
  const [removedOrders, setRemovedOrders] = useState(getRemovedOrders());

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        const ordersData = response.data.orders.reverse();
        const visibleOrders = ordersData.filter(
          (order) => !removedOrders.includes(order._id)
        );
        setOrders(ordersData);
        setFilteredOrders(visibleOrders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) fetchAllOrders();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFilter = () => {
    let filtered = orders.filter(order => !removedOrders.includes(order._id));

    // Filter by date
    if (filterDate) {
      const selectedDate = new Date(filterDate).toDateString();
      filtered = filtered.filter(
        order => new Date(order.date).toDateString() === selectedDate
      );
    }

    // Filter by status
    if (filterStatus) {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    // Filter by Order ID safely
    if (filterOrderId) {
      filtered = filtered.filter(order =>
        order.orderUniqueId?.toLowerCase().includes(filterOrderId.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const handleRemoveOrder = (orderId) => {
    const updatedRemovedOrders = [...removedOrders, orderId];
    setRemovedOrders(updatedRemovedOrders);
    localStorage.setItem('removedOrders', JSON.stringify(updatedRemovedOrders));

    setFilteredOrders(
      filteredOrders.filter((order) => order._id !== orderId)
    );
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-5">Order Page</h3>

      {/* Filter */}
      <div className="mb-6 flex gap-3 flex-wrap">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="Order Placed">Order Placed</option>
          <option value="Packing">Packing</option>
          <option value="Shipped">Shipped</option>
          <option value="Out for delivery">Out for delivery</option>
          <option value="Delivered">Delivered</option>
        </select>

        <input
          type="text"
          placeholder="Search by Order ID"
          value={filterOrderId}
          onChange={(e) => setFilterOrderId(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        />

        <button
          onClick={handleFilter}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Filter
        </button>
      </div>

      {/* Orders */}
      {filteredOrders.map((order, index) => (
        <div
          key={index}
          className="
            grid grid-cols-1 
            lg:grid-cols-[60px_3fr_1.5fr_1fr_1fr]
            gap-6
            border border-gray-200
            rounded-lg
            p-6
            mb-6
            bg-white
            relative
          "
        >
          {/* Icon */}
          <img
            src={assets.parcel_icon}
            alt="parcel"
            className="w-12 h-12 object-contain"
          />

          {/* Items + Address */}
          <div>
            {/* Items Table */}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-[3fr_1fr_2fr] text-xs font-semibold text-gray-500 border-b pb-2 mb-3">
                <span>Product</span>
                <span>Qty</span>
                <span>Size</span>
              </div>

              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[3fr_1fr_2fr] gap-2 text-sm mb-2"
                >
                  <p className="text-gray-800 leading-snug">{item.name}</p>
                  <p className="font-medium">{item.quantity}</p>
                  <p className="text-gray-600">{item.size || '-'}</p>
                </div>
              ))}
            </div>

            {/* Address */}
            <p className="mt-4 font-medium text-gray-900">
              {order.address.firstName} {order.address.lastName}
            </p>
            <p>{order.address.street}</p>
            <p>
              {order.address.city}, {order.address.state},{' '}
              {order.address.country} - {order.address.zipcode}
            </p>
            <p className="mt-1">{order.address.phone}</p>
          </div>

          {/* Order Info */}
          <div className="text-sm space-y-1">
            <p className="font-semibold text-gray-800">
              Order ID :
              <span className="ml-1 text-blue-600">{order.orderUniqueId}</span>
            </p>
            <p className="font-medium">Items : {order.items.length}</p>
            <p>Method : {order.paymentMethod}</p>
            <p>Payment : {order.payment ? 'Done' : 'Pending'}</p>
            <p>Date : {new Date(order.date).toLocaleDateString()}</p>
          </div>

          {/* Amount */}
          <p className="text-lg font-semibold text-gray-900">
            {currency}
            {order.amount}
          </p>

          {/* STATUS BUTTON */}
          <select
            value={order.status}
            onChange={(e) => statusHandler(e, order._id)}
            className={`
              w-40 h-10 px-3 rounded-full text-sm font-semibold cursor-pointer
              border focus:outline-none
              ${
                order.status === 'Order Placed'
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : order.status === 'Packing'
                  ? 'bg-yellow-50 text-yellow-700 border-yellow-300'
                  : order.status === 'Shipped'
                  ? 'bg-purple-50 text-purple-700 border-purple-300'
                  : order.status === 'Out for delivery'
                  ? 'bg-orange-50 text-orange-700 border-orange-300'
                  : 'bg-green-50 text-green-700 border-green-300'
              }
            `}
          >
            <option value="Order Placed">Order Placed</option>
            <option value="Packing">Packing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for delivery">Out for delivery</option>
            <option value="Delivered">Delivered</option>
          </select>

          {/* Remove */}
          <button
            onClick={() => handleRemoveOrder(order._id)}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-lg"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default Orders;
