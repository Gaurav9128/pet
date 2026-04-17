import React from 'react';
import { ShieldCheck, Truck, Sparkles } from 'lucide-react';

const TrustBadge = ({ icon: Icon, title, description }) => (
  /* py-14 (Vertical) aur px-10 (Horizontal) padding for maximum size */
  <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-14 bg-[#F9F7F9] rounded-[2rem] flex-1 min-w-[380px] transition-all hover:shadow-md border border-transparent hover:border-gray-200">
    <div className="text-[#B33B2B] shrink-0">
      {/* Icon size bumped to 64 for a bold look */}
      <Icon size={64} strokeWidth={1} />
    </div>
    <div className="text-center md:text-left">
      <h3 className="text-2xl font-black text-gray-900 leading-none tracking-tight">
        {title}
      </h3>
      <p className="text-lg text-gray-500 mt-4 font-normal leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

const TrustBar = () => {
  const badges = [
    {
      icon: ShieldCheck,
      title: "Secure Checkout",
      description: "Safe and protected payments for all customers.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick and reliable shipping worldwide.",
    },
    {
      icon: Sparkles,
      title: "Premium Quality",
      description: "Top-rated & trusted products guaranteed.",
    },
  ];

  return (
    /* max-w-screen-2xl for extra wide layouts */
    <div className="w-full max-w-[1600px] mx-auto p-10">
      <div className="flex flex-wrap xl:flex-nowrap gap-10 justify-center">
        {badges.map((badge, index) => (
          <TrustBadge key={index} {...badge} />
        ))}
      </div>
    </div>
  );
};

export default TrustBar;