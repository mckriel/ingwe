'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import AgentContactModal from '@/app/ui/component/agent-contact-modal';

interface AgentPageProps {
  params: {
    id: string;
  };
}

export default function AgentPage({ params }: AgentPageProps) {
  const [is_contact_modal_open, set_is_contact_modal_open] = useState(false);

  const open_contact_modal = () => set_is_contact_modal_open(true);
  const close_contact_modal = () => set_is_contact_modal_open(false);

  // Sample agent data - in real app this would come from API
  const agent = {
    id: params.id,
    name: "Noeleen Naidoo",
    bio: "In hac habitasse platea dictumst. Aliquam nec venenatis lorem. Pellentesque congue volutpat ex vitae consectetur. Pellentesque convallis. Pellentesque orci velit posuere lorem fermentum, tempus quis eu viverra gravida. Quisque rutrum dignissim elit ut varuius mauris rutcusr et tristique eros blandit vehicula. Lorem ipsum dolor sit amet consectetur adipiscing elit. Vivamus gravida.",
    image: "/house1.jpeg", // Placeholder image
    listings_count: 6
  };

  // Sample property listings
  const properties = [
    {
      id: 1,
      title: "3 Bedroom Freehold For Sale",
      price: "R12,950,000",
      image: "/house1.jpeg",
      bedrooms: 3,
      type: "Freehold"
    },
    {
      id: 2,
      title: "3 Bedroom Freehold For Sale", 
      price: "R12,950,000",
      image: "/house1.jpeg",
      bedrooms: 3,
      type: "Freehold"
    },
    {
      id: 3,
      title: "3 Bedroom Freehold For Sale",
      price: "R12,950,000", 
      image: "/house1.jpeg",
      bedrooms: 3,
      type: "Freehold"
    },
    {
      id: 4,
      title: "3 Bedroom Freehold For Sale",
      price: "R12,950,000",
      image: "/house1.jpeg", 
      bedrooms: 3,
      type: "Freehold"
    },
    {
      id: 5,
      title: "3 Bedroom Freehold For Sale",
      price: "R12,950,000",
      image: "/house1.jpeg",
      bedrooms: 3,
      type: "Freehold"
    },
    {
      id: 6,
      title: "3 Bedroom Freehold For Sale",
      price: "R12,950,000",
      image: "/house1.jpeg",
      bedrooms: 3,
      type: "Freehold"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="text-sm text-gray-600 mb-8">
          <Link href="/agents" className="hover:text-[#B8C332]">All Agents</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Agent Listings</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Agent Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              {/* Agent Photo */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <div className="w-20 h-20 bg-gray-400 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                </div>
                
                {/* Listings Badge */}
                <div className="absolute -top-2 -right-2">
                  <span className="bg-[#B8C332] text-white px-3 py-1 rounded-full text-sm font-medium">
                    Listings
                  </span>
                </div>
              </div>

              {/* Agent Name */}
              <h1 className="text-xl font-bold text-gray-900 text-center mb-4">
                {agent.name}
              </h1>

              {/* Contact Button */}
              <button 
                onClick={open_contact_modal}
                className="w-full bg-[#B8C332] hover:bg-[#a6b02e] text-white py-3 px-6 rounded-full font-medium transition-colors mb-6"
              >
                Contact Now
              </button>

              {/* Agent Bio */}
              <div className="text-sm text-gray-600 leading-relaxed">
                <p>{agent.bio}</p>
              </div>
            </div>
          </div>

          {/* Property Listings Section */}
          <div className="lg:col-span-3">
            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Link 
                  key={property.id}
                  href={`/listing/${property.id}`}
                  className="group block"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {/* Property Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={property.image}
                        alt={property.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Property Details */}
                    <div className="p-4">
                      {/* Property Title */}
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {property.title}
                      </h3>
                      
                      {/* Property Price */}
                      <p className="text-[#B8C332] font-bold text-lg">
                        {property.price}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-8">
              <button className="bg-[#B8C332] hover:bg-[#a6b02e] text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Load More Properties
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Contact Modal */}
      <AgentContactModal 
        is_open={is_contact_modal_open} 
        on_close={close_contact_modal} 
        agent_name={agent.name}
      />
    </div>
  );
}