'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import { get_agents } from "@/app/actions/property-actions";

interface Agent {
    id: number;
    name: string;
    image: string | null;
    listings_count: number;
    email: string;
    phone: string;
    branch: any;
}

export default function AgentCarousel() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const agentData = await get_agents({
                    limit: 50, // Increase limit to match agents page
                    site: 217, // Filter for Ingwe agents
                    order_by: 'first_name' // Add order to match agents page
                });
                setAgents(agentData.results || []);
            } catch (error) {
                console.error('Error fetching agents:', error);
                setAgents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAgents();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B8C332]"></div>
            </div>
        );
    }

    if (agents.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">No agents available at the moment.</p>
            </div>
        );
    }

    return (
        <div className="max-w-screen-xl mx-auto relative">
            <Swiper
                modules={[Navigation]}
                navigation={{
                    nextEl: '.agent-carousel-next',
                    prevEl: '.agent-carousel-prev',
                }}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                    640: { slidesPerView: 1.5 },
                    768: { slidesPerView: 2.5 },
                    1024: { slidesPerView: 3.5 },
                    1280: { slidesPerView: 4 },
                }}
                className="agent-carousel"
            >
                {agents.map((agent) => (
                    <SwiperSlide key={agent.id}>
                        <Link href={`/agents/${agent.id}`}>
                            <div className="bg-white cursor-pointer h-full">
                                <div className="relative h-64 bg-gray-200 rounded-xl overflow-hidden">
                                    {agent.image ? (
                                        <Image
                                            src={agent.image}
                                            alt={agent.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                            onError={(e) => {
                                                // Hide image on error and show placeholder
                                                const imgElement = e.currentTarget;
                                                imgElement.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-xl">
                                            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                                                <svg className="w-10 h-10 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L12 2L3 7V9H21ZM21 10H3V15H8V13H16V15H21V10Z"/>
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                    {/* Listings count badge */}
                                    <div className="absolute top-3 right-3 bg-[#B8C332] text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {agent.listings_count} listings
                                    </div>
                                </div>
                                <div className="p-6 text-center">
                                    <h3 className="text-xl font-medium text-gray-800 mb-2">{agent.name}</h3>
                                    <p className="text-gray-600 text-sm mb-1">{agent.email}</p>
                                    {agent.phone && (
                                        <p className="text-gray-600 text-sm">{agent.phone}</p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
            
            {/* Custom Navigation Buttons */}
            <button className="agent-carousel-prev absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-[#B8C332] hover:bg-[#a6b02e] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            
            <button className="agent-carousel-next absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-[#B8C332] hover:bg-[#a6b02e] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}