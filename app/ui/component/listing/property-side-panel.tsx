import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

interface PropertySidePanelProps {
    price: number;
    agent: {
        name: string;
        image: string;
        contact: string;
        email?: string;
    };
}

export default function PropertySidePanel({ price, agent }: PropertySidePanelProps) {
    const router = useRouter();

    const handle_affordability_click = () => {
        router.push('/calculator/affordability');
    };

    const handle_bond_costs_click = () => {
        router.push('/calculator/bond-and-transfer');
    };

    return (
      <aside className="bg-white p-4 rounded-md h-fit border-4 shadow-lg" style={{ borderColor: '#D1DA68' }}>
        {/* Price */}
        <div className="mb-4">
          <h2 className="text-4xl text-gray-800" style={{ fontWeight: 900, textShadow: '0.5px 0.5px 0px #000000', letterSpacing: '2px' }}>
            R{Number(price).toLocaleString('en-ZA')}
          </h2>
          
          {/* Monthly Bond Heading */}
          <h3 className="font-bold mt-3 mb-1" style={{ color: '#D1DA68' }}>
            Monthly Bond
          </h3>
          
          <p className="text-sm text-gray-500">Calculated over 20 years @ 11.5% with no deposit</p>
          
          {/* Monthly Levy and Rates - Side by Side */}
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <h4 className="font-bold mb-1" style={{ color: '#D1DA68' }}>
                Monthly Levy
              </h4>
              <p className="text-sm text-gray-500">R7,720</p>
            </div>
            <div>
              <h4 className="font-bold mb-1" style={{ color: '#D1DA68' }}>
                Monthly Rates
              </h4>
              <p className="text-sm text-gray-500">R2,872</p>
            </div>
          </div>
          
          {/* Calculator Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button 
              className="py-2 px-3 rounded text-black text-sm font-medium shadow-md hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#D1DA68' }}
              onClick={handle_affordability_click}
            >
              Calculate Affordability
            </button>
            <button 
              className="py-2 px-3 rounded text-black text-sm font-medium shadow-md hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#D1DA68' }}
              onClick={handle_bond_costs_click}
            >
              Bond & Transfer Costs
            </button>
          </div>
        </div>
  
        {/* Property Agent Section */}
        <div className="mt-6">
          <h3 className="font-bold text-black mb-3">Property Agent</h3>
          
          {/* Agent Details Box */}
          <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
            <div className="flex gap-3">
              {/* Agent Image - Left Side */}
              <div className="relative w-24 h-24 flex-shrink-0">
                {agent.image && agent.image.trim() !== "" && !agent.image.includes('/house1.jpeg') ? (
                  <Image
                    src={agent.image}
                    alt={agent.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-gray-600 text-lg font-medium">
                      {agent.name.split(' ').map(name => name.charAt(0)).join('').toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Agent Details - Right Side */}
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <p className="font-semibold text-black">{agent.name}</p>
                  <p className="text-sm text-gray-600">Property Agent</p>
                  
                  {/* Contact Details */}
                  <div className="mt-2 space-y-1">
                    {agent.contact && agent.contact !== agent.email && (
                      <a 
                        href={`tel:${agent.contact}`}
                        className="block text-xs text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {agent.contact}
                      </a>
                    )}
                  </div>
                </div>
                
                {/* Contact Me Button */}
                <a 
                  href={`mailto:${agent.email || agent.contact}`}
                  className="text-white py-1.5 rounded text-sm font-medium mt-2 block text-center hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#D1DA68' }}
                  onClick={(e) => {
                    const email = agent.email || agent.contact;
                    console.log("Email clicked:", email);
                    
                    // Check if mailto will work, if not copy to clipboard
                    setTimeout(() => {
                      // If user is still on the page after 1 second, mailto probably didn't work
                      if (document.hasFocus()) {
                        navigator.clipboard.writeText(email).then(() => {
                          alert(`Email client didn't open. Email copied to clipboard: ${email}`);
                        }).catch(() => {
                          alert(`Please email the agent at: ${email}`);
                        });
                      }
                    }, 1000);
                  }}
                >
                  Contact Me
                </a>
              </div>
            </div>
          </div>
        </div>
      </aside>
    );
}
