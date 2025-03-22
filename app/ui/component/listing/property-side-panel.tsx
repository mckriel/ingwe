import Image from "next/image";
import React from "react";

interface PropertySidePanelProps {
    price: number;
    agent: {
        name: string;
        image: string;
        contact: string;
    };
}

export default function PropertySidePanel({ price, agent }: PropertySidePanelProps) {
    return (
      <aside className="bg-gray-50 p-4 rounded-md h-fit">
        {/* Price */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            R{price.toLocaleString()}
          </h2>
          <p className="text-sm text-gray-500">Calculated over 20 years @ 11.5% with no deposit</p>
          <p className="text-sm text-gray-500">
            Monthly Levy: R7,720 | Rates and Taxes: R2,872
          </p>
        </div>
  
        {/* Agent Info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-16 h-16">
            <Image
              src={agent.image}
              alt={agent.name}
              fill
              className="object-cover rounded-full"
            />
          </div>
          <div>
            <p className="font-semibold">{agent.name}</p>
            <p className="text-sm text-gray-500">{agent.contact}</p>
          </div>
        </div>
  
        {/* Contact Agent Button */}
        <button className="bg-green-500 hover:bg-green-600 text-white w-full py-2 rounded">
          Contact Agent
        </button>
      </aside>
    );
}
