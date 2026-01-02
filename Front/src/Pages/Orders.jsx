import React, { useContext, useEffect, useState } from 'react';
import Title from '../Components/Title';
import axios from 'axios';
import { StoreContext } from '../context/StoreContext';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(StoreContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) {
        console.warn('No token found. User might not be logged in.');
        return;
      }

      // // Safe log for token debugging
      // console.log('Sending request with token:', token?.substring(0, 10) + '...');

      const response = await axios.post(
        backendUrl + '/api/order/userorders',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date;
            item['shippingFees'] = order.shippingFees || 0;
            item['returnStatus'] = order.returnStatus || '';
            item['orderId'] = order._id;
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  const calculateTotalPrice = (item) => {
    return item.price * item.quantity + (item.shippingFees || 50);
  };

  const handleReturnRequest = async (orderId, itemId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/returnRequest',
        { orderId, itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        loadOrderData();
      }
    } catch (error) {
      console.error('Error while submitting return request:', error);
    }
  };

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div>
        {orderData.map((item, index) => (
          <div
            key={index}
            className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <img
                className="w-16 sm:w-20"
                src={item.image?.[0] ? `${backendUrl}/uploads/${item.image[0]}` : '/placeholder.png'}
                alt={item.name || 'Product'}
              />
              <div>
                <p className="sm:text-base font-medium">{item.name}</p>

                {/* Quantity & Size together */}
                <p className="text-sm text-gray-500 mt-1">
                  Qty: <span className="text-gray-700">{item.quantity}</span>
                  {item.size && (
                    <>
                      {' | '}Size: <span className="text-gray-700">{item.size}</span>
                    </>
                  )}
                </p>

                <p className="mt-1 text-base text-gray-700">
                  Price: {currency}
                  {(item.price * item.quantity).toFixed(2)} + {item.shippingFees || 50} shipping
                </p>

                <p className="mt-1">
                  Date: <span className="text-gray-400">{new Date(item.date).toDateString()}</span>
                </p>
                <p className="mt-1">
                  Payment: <span className="text-gray-400">{item.paymentMethod}</span>
                </p>
              </div>
            </div>

            <div className="md:w-1/2 flex justify-between mt-4 md:mt-0">
              <div className="flex items-center gap-2">
                <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                <p className="text-sm md:text-base">{item.status}</p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm md:text-base">
                  Total: {currency}
                  {calculateTotalPrice(item).toFixed(2)}
                </p>

                {item.returnStatus === 'Pending' ? (
                  <button
                    disabled
                    className="bg-gray-500 text-white px-4 py-2 text-sm font-medium rounded-sm"
                  >
                    Return Pending
                  </button>
                ) : item.returnStatus === 'Approved' ? (
                  <button
                    disabled
                    className="bg-green-500 text-white px-4 py-2 text-sm font-medium rounded-sm"
                  >
                    Return Approved
                  </button>
                ) : (
                  <button
                    onClick={() => handleReturnRequest(item.orderId, item._id)}
                    className="border px-4 py-2 text-sm font-medium rounded-sm"
                  >
                    Request Return
                  </button>
                )}

                <button
                  onClick={loadOrderData}
                  className="border px-4 py-2 text-sm font-medium rounded-sm"
                >
                  Track Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
