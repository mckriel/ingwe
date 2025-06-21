'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AgentsPage() {
    const [active_filter, set_active_filter] = useState('All');

    // Set page title
    useEffect(() => {
        document.title = 'Our Agents | Ingwe | The Property Company';
    }, []);

    const filters = [
        'Houtbay',
        'Kunshe', 
        'Newlands',
        'Camps',
        'Parklands'
    ];

    const agents = [
        {
            id: 1,
            name: "Noeleen Naidoo",
            location: "Houtbay",
            image: "/house1.jpeg", // Using placeholder image
            listings_count: 12
        },
        {
            id: 2,
            name: "Noeleen Naidoo",
            location: "Kunshe",
            image: "/house1.jpeg",
            listings_count: 8
        },
        {
            id: 3,
            name: "Noeleen Naidoo", 
            location: "Newlands",
            image: "/house1.jpeg",
            listings_count: 15
        },
        {
            id: 4,
            name: "Noeleen Naidoo",
            location: "Camps",
            image: "/house1.jpeg",
            listings_count: 6
        },
        {
            id: 5,
            name: "Noeleen Naidoo",
            location: "Parklands",
            image: "/house1.jpeg",
            listings_count: 20
        },
        {
            id: 6,
            name: "Noeleen Naidoo",
            location: "Houtbay",
            image: "/house1.jpeg",
            listings_count: 9
        },
        {
            id: 7,
            name: "Noeleen Naidoo",
            location: "Kunshe",
            image: "/house1.jpeg",
            listings_count: 14
        },
        {
            id: 8,
            name: "Noeleen Naidoo",
            location: "Newlands",
            image: "/house1.jpeg",
            listings_count: 7
        },
        {
            id: 9,
            name: "Noeleen Naidoo",
            location: "Camps",
            image: "/house1.jpeg",
            listings_count: 11
        },
        {
            id: 10,
            name: "Noeleen Naidoo",
            location: "Parklands",
            image: "/house1.jpeg",
            listings_count: 18
        }
    ];

    const filtered_agents = active_filter === 'All' 
        ? agents 
        : agents.filter(agent => agent.location === active_filter);

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-12">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
                        Find Your Agent
                    </h1>
                    
                    {/* Filter Buttons */}
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        <button
                            onClick={() => set_active_filter('All')}
                            className={`px-6 py-3 rounded-full font-medium transition-colors ${
                                active_filter === 'All'
                                    ? 'bg-[#B8C332] text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            All Areas
                        </button>
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => set_active_filter(filter)}
                                className={`px-6 py-3 rounded-full font-medium transition-colors ${
                                    active_filter === filter
                                        ? 'bg-[#B8C332] text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Agents Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filtered_agents.map((agent) => (
                        <Link 
                            key={agent.id} 
                            href={`/agents/${agent.id}`}
                            className="group block"
                        >
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                {/* Agent Photo */}
                                <div className="relative aspect-square">
                                    {/* Placeholder agent photo with gradient background */}
                                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                        <div className="w-20 h-20 bg-gray-400 rounded-full flex items-center justify-center">
                                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                            </svg>
                                        </div>
                                    </div>
                                    
                                    {/* Listings Badge */}
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-[#B8C332] text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                            </svg>
                                            Listings
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Agent Info */}
                                <div className="p-4 text-center">
                                    <h3 className="font-semibold text-gray-900 text-lg">
                                        {agent.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {agent.location}
                                    </p>
                                    <p className="text-[#B8C332] text-sm mt-1 font-medium">
                                        {agent.listings_count} Listings
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Load More Button */}
                <div className="text-center mt-12">
                    <button className="bg-[#B8C332] hover:bg-[#a6b02e] text-white px-8 py-3 rounded-lg font-medium transition-colors">
                        Load More Agents
                    </button>
                </div>
            </div>
        </div>
    );
}