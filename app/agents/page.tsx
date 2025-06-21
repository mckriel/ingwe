'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { get_agents } from '@/app/actions/property-actions';

// Cache for agents data
let agents_cache: Agent[] | null = null;
let cache_timestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface Agent {
    id: number;
    name: string;
    image: string | null;
    listings_count: number;
    email?: string;
    phone?: string;
    branch?: any;
}

export default function AgentsPage() {
    const [agents, set_agents] = useState<Agent[]>([]);
    const [loading, set_loading] = useState(true);
    const [error, set_error] = useState<string | null>(null);

    // Set page title
    useEffect(() => {
        document.title = 'Our Agents | Ingwe | The Property Company';
    }, []);

    // Fetch agents data with caching
    useEffect(() => {
        const fetch_agents = async () => {
            try {
                set_loading(true);
                
                // Check if we have valid cached data
                const now = Date.now();
                const is_cache_valid = agents_cache && (now - cache_timestamp) < CACHE_DURATION;
                
                if (is_cache_valid) {
                    // Use cached data
                    set_agents(agents_cache!);
                    set_error(null);
                    set_loading(false);
                    return;
                }
                
                // Fetch fresh data
                const data = await get_agents({
                    site: 217, // Ingwe site ID
                    limit: 50,
                    order_by: 'first_name'
                });
                
                // Update cache
                agents_cache = data.results;
                cache_timestamp = now;
                
                set_agents(data.results);
                set_error(null);
            } catch (err) {
                console.error('Error fetching agents:', err);
                set_error('Failed to load agents');
                
                // If we have cached data, use it even if it's expired
                if (agents_cache) {
                    set_agents(agents_cache);
                    set_error(null);
                }
            } finally {
                set_loading(false);
            }
        };

        fetch_agents();
    }, []);


    if (loading) {
        return (
            <div className="min-h-screen bg-transparent pt-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-8 border-[#B8C332] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading agents...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-[#B8C332] text-white px-4 py-2 rounded-lg hover:bg-[#a6b02e]"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-12">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
                        Our Agents
                    </h1>
                </div>

                {/* Agents Grid */}
                {agents.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">
                            No agents found.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {agents.map((agent) => (
                            <Link 
                                key={agent.id} 
                                href={`/agents/${agent.id}`}
                                className="group block"
                            >
                                <div className="bg-white">
                                    {/* Agent Photo */}
                                    <div className="relative aspect-square">
                                        {agent.image ? (
                                            <img 
                                                src={agent.image} 
                                                alt={agent.name}
                                                className="w-full h-full object-cover rounded-2xl"
                                                onError={(e) => {
                                                    // Fallback to placeholder if image fails to load
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.nextElementSibling?.setAttribute('style', 'display: flex');
                                                }}
                                            />
                                        ) : null}
                                        {/* Placeholder agent photo with gradient background */}
                                        <div 
                                            className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center rounded-2xl"
                                            style={{ display: agent.image ? 'none' : 'flex' }}
                                        >
                                            <div className="w-20 h-20 bg-gray-400 rounded-full flex items-center justify-center">
                                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                                </svg>
                                            </div>
                                        </div>
                                        
                                        {/* Listings Badge */}
                                        <div className="absolute top-3 right-3">
                                            <span className="bg-[#B8C332] text-white px-3 py-1 rounded-full text-sm font-medium">
                                                {agent.listings_count} Listings
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Agent Info */}
                                    <div className="p-4 text-center">
                                        <h3 className="font-semibold text-gray-900 text-lg">
                                            {agent.name}
                                        </h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}