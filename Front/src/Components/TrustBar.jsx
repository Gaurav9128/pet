import React from 'react';
import { ShieldCheck, Truck, Sparkles } from 'lucide-react';

const TrustBadge = ({ icon: Icon, title, description }) => (
  /* py-10 aur px-8 se box ka size kafi badh jayega */
  <div className="flex items-center gap-6 p-10 bg-[#F9F7F9] rounded-2xl flex-1 min-w-[320px] border border-gray-100 shadow-sm">
    <div className="text-[#B33B2B] shrink-0">
      {/* Icon size increased to 52 */}
      <Icon size={52} strokeWidth={1.3} />
    </div>
    <div>
      <h3 className="text-xl font-bold text-gray-900 leading-tight tracking-tight">
        {title}
      </h3>
      <p className="text-base text-gray-500 mt-2 font-medium">
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
      description: "Safe and protected payments",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick and reliable shipping",
    },
    {
      icon: Sparkles,
      title: "Premium Quality",
      description: "Top-rated & trusted products",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* gap-6 for more space between boxes */}
      <div className="flex flex-wrap lg:flex-nowrap gap-6 justify-center">
        {badges.map((badge, index) => (
          <TrustBadge key={index} {...badge} />
        ))}
      </div>
    </div>
  );
};

export default TrustBar;