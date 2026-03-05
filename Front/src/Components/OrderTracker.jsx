import React from "react";

const OrderTracker = ({ status }) => {

  const steps = [
    "Order Placed",
    "Packing",
    "Shipped",
    "Out for delivery",
    "Delivered"
  ];

  const currentStep = steps.indexOf(status);

  return (
    <div className="w-full mt-3">

      <div className="flex justify-between items-center relative">

        {steps.map((step, index) => (

          <div key={index} className="flex-1 flex flex-col items-center relative">

            {/* LINE */}
            {index !== 0 && (
              <div
                className={`absolute left-[-50%] top-3 w-full h-[2px]
                ${index <= currentStep ? "bg-green-500" : "bg-gray-300"}`}
              />
            )}

            {/* DOT */}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
              ${index <= currentStep ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}`}
            >
              {index + 1}
            </div>

            {/* TEXT */}
            <p className="text-[11px] text-center mt-2 text-gray-600">
              {step}
            </p>

          </div>

        ))}
      </div>

    </div>
  );
};

export default OrderTracker;