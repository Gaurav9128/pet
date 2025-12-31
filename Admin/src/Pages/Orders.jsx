import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterDate, setFilterDate] = useState('');

  // Retrieve removed orders from local storage
  const getRemovedOrders = () => {
    const removed = localStorage.getItem('removedOrders');
    return removed ? JSON.parse(removed) : [];
  };

  const [removedOrders, setRemovedOrders] = useState(getRemovedOrders());

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        const ordersData = response.data.orders.reverse();
        // Filter out removed orders
        const visibleOrders = ordersData.filter(
          (order) => !removedOrders.includes(order._id)
        );
        setOrders(ordersData);
        setFilteredOrders(visibleOrders); // Initialize with visible orders
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
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleFilter = () => {
    if (!filterDate) {
      setFilteredOrders(orders.filter((order) => !removedOrders.includes(order._id)));
      return;
    }

    const selectedDate = new Date(filterDate).toDateString();
    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.date).toDateString();
      return orderDate === selectedDate && !removedOrders.includes(order._id);
    });

    setFilteredOrders(filtered);
  };

  const handleRemoveOrder = (orderId) => {
    // Add the removed order ID to the state and local storage
    const updatedRemovedOrders = [...removedOrders, orderId];
    setRemovedOrders(updatedRemovedOrders);
    localStorage.setItem('removedOrders', JSON.stringify(updatedRemovedOrders));

    // Update the filtered orders
    const updatedOrders = filteredOrders.filter((order) => order._id !== orderId);
    setFilteredOrders(updatedOrders);
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3>Order Page</h3>

      {/* Date Filter Section */}
      <div className="mb-5">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border border-gray-300 p-2 rounded mr-2"
        />
        <button
          onClick={handleFilter}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Filter
        </button>
      </div>

      <div>
        {filteredOrders.map((order, index) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700 relative"
            key={index}
          >
            <img className="w-12" src={assets.parcel_icon} alt="" />
            <div>
              <div>
                {order.items.map((item, index) => (
                  <p className="py-0.5" key={index}>
                    {item.name} x {item.quantity} <span>{item.size}</span>
                    {index !== order.items.length - 1 && ','}
                  </p>
                ))}
              </div>
              <p className="mt-3 mb-2 font-medium">
                {order.address.firstName + ' ' + order.address.lastName}
              </p>
              <div>
                <p>{order.address.street + ','}</p>
                <p>
                  {order.address.city +
                    ', ' +
                    order.address.state +
                    ', ' +
                    order.address.country +
                    ', ' +
                    order.address.zipcode}
                </p>
              </div>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p className="text-sm sm:text-[15px]">
                Items : {order.items.length}
              </p>
              <p className="mt-3">Method : {order.paymentMethod}</p>
              <p>Payment : {order.payment ? 'Done' : 'Pending'}</p>
              <p>Date : {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className="text-sm sm:text-[15px]">
              {currency}
              {order.amount}
            </p>
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className="p-2 font-semibold"
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
            {/* Cross Icon for Removing Order */}
            <button
              onClick={() => handleRemoveOrder(order._id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
