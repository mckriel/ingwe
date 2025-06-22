'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import AgentContactModal from '@/app/ui/component/agent-contact-modal';
import PropertyListingGrid from '@/app/ui/component/property-listing-grid';
import { get_agent_details, get_formatted_properties } from '@/app/actions/property-actions';

// Cache for agent details and their properties
interface AgentCache {
  agent: Agent;
  properties: Property[];
  timestamp: number;
}

const agent_cache = new Map<string, AgentCache>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface AgentPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface Property {
  id: number;
  image: string;
  title: string;
  price: string;
  beds: number;
  baths: number;
  size: number;
  propertyId?: number;
  description?: string;
  reference?: string;
  propertyType?: string;
  location?: string | number;
  locationString?: string;
  locationDetail?: any;
}

interface Agent {
  id: number;
  name: string;
  email?: string;
  phone_number?: string;
  image_url?: string;
  listings_count?: number;
  branch?: any;
}

export default function AgentPage({ params }: AgentPageProps) {
  const [is_contact_modal_open, set_is_contact_modal_open] = useState(false);
  const [agent_id, set_agent_id] = useState<string>('');
  const [agent, set_agent] = useState<Agent | null>(null);
  const [properties, set_properties] = useState<Property[]>([]);
  const [loading, set_loading] = useState(true);
  const [properties_loading, set_properties_loading] = useState(false);
  const [error, set_error] = useState<string | null>(null);
  const [offset, set_offset] = useState(0);
  const [has_more, set_has_more] = useState(true);
  const [listings_count_from_url, set_listings_count_from_url] = useState<number | null>(null);
  const PAGE_SIZE = 12;

  const open_contact_modal = () => set_is_contact_modal_open(true);
  const close_contact_modal = () => set_is_contact_modal_open(false);

  useEffect(() => {
    params.then((resolved_params) => {
      set_agent_id(resolved_params.id);
    });
    
    // Read listings count from URL parameters
    const url_params = new URLSearchParams(window.location.search);
    const listings_param = url_params.get('listings');
    if (listings_param) {
      set_listings_count_from_url(parseInt(listings_param));
    }
  }, [params]);

  // Load agent details and initial properties
  useEffect(() => {
    if (!agent_id) return;

    const load_agent_data = async () => {
      try {
        set_loading(true);
        set_error(null);

        // Check if we have valid cached data
        const now = Date.now();
        const cached_data = agent_cache.get(agent_id);
        const is_cache_valid = cached_data && (now - cached_data.timestamp) < CACHE_DURATION;

        if (is_cache_valid) {
          console.log(`📦 Using cached data for agent ${agent_id}`);
          // Use cached data but update listings count from URL if available
          const cached_agent = { 
            ...cached_data.agent, 
            listings_count: listings_count_from_url || cached_data.agent.listings_count 
          };
          set_agent(cached_agent);
          set_properties(cached_data.properties);
          set_offset(PAGE_SIZE);
          set_has_more(cached_data.properties.length === PAGE_SIZE);
          set_error(null);
          set_loading(false);
          return;
        }

        console.log(`🔄 Fetching fresh data for agent ${agent_id}`);

        // Get agent details
        const agent_data = await get_agent_details(parseInt(agent_id));
        if (!agent_data) {
          set_error('Agent not found');
          return;
        }

        // Create agent object with proper name formatting
        const formatted_agent: Agent = {
          id: agent_data.id,
          name: `${agent_data.first_name || ''} ${agent_data.last_name || ''}`.trim() || agent_data.username || 'Agent',
          email: agent_data.email,
          phone_number: agent_data.phone_number,
          image_url: agent_data.image_url,
          listings_count: listings_count_from_url || agent_data.listings_count || 0, // Use URL count first, fallback to API
          branch: agent_data.branch
        };

        // Get agent's properties (both sale and rental)
        const agent_properties = await get_formatted_properties({
          limit: PAGE_SIZE,
          offset: 0,
          agent: agent_data.id, // Filter by this specific agent
          site: 217 // Ingwe site ID
        });

        // Cache the data
        agent_cache.set(agent_id, {
          agent: formatted_agent,
          properties: agent_properties,
          timestamp: now
        });

        console.log(`💾 Cached data for agent ${agent_id}`);

        set_agent(formatted_agent);
        set_properties(agent_properties);
        set_offset(PAGE_SIZE);
        set_has_more(agent_properties.length === PAGE_SIZE);

      } catch (error) {
        console.error('Error loading agent data:', error);
        set_error('Failed to load agent information');
        
        // If we have cached data, use it even if it's expired
        const cached_data = agent_cache.get(agent_id);
        if (cached_data) {
          console.log(`📦 Using expired cached data for agent ${agent_id} due to error`);
          const cached_agent = { 
            ...cached_data.agent, 
            listings_count: listings_count_from_url || cached_data.agent.listings_count 
          };
          set_agent(cached_agent);
          set_properties(cached_data.properties);
          set_offset(PAGE_SIZE);
          set_has_more(cached_data.properties.length === PAGE_SIZE);
          set_error(null);
        }
      } finally {
        set_loading(false);
      }
    };

    load_agent_data();
  }, [agent_id]);

  // Load more properties
  const load_more_properties = async () => {
    if (properties_loading || !has_more || !agent_id) return;

    set_properties_loading(true);

    try {
      console.log(`🔄 Loading more properties for agent ${agent_id} (offset: ${offset})`);
      
      const more_properties = await get_formatted_properties({
        limit: PAGE_SIZE,
        offset: offset,
        agent: parseInt(agent_id), // Filter by this specific agent
        site: 217
      });

      const updated_properties = [...properties, ...more_properties];
      set_properties(updated_properties);
      set_offset(prev => prev + PAGE_SIZE);
      set_has_more(more_properties.length === PAGE_SIZE);

      // Update cache with the new properties
      const cached_data = agent_cache.get(agent_id);
      if (cached_data) {
        agent_cache.set(agent_id, {
          ...cached_data,
          properties: updated_properties,
          timestamp: Date.now() // Update timestamp when we add more properties
        });
        console.log(`💾 Updated cache for agent ${agent_id} with more properties`);
      }

    } catch (error) {
      console.error('Error loading more properties:', error);
    } finally {
      set_properties_loading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-8 border-[#B8C332] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading agent information...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !agent) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center min-h-[400px] flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Agent Not Found</h1>
            <p className="text-gray-600 mb-8">{error || 'The agent you are looking for could not be found.'}</p>
            <Link href="/agents" className="inline-block bg-[#B8C332] hover:bg-[#a6b02e] text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Back to All Agents
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Agent Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl py-8 px-6">
              {/* Agent Photo - Main part of the box */}
              <div className="relative w-full h-64 mb-4">
                {agent.image_url ? (
                  <Image
                    src={agent.image_url}
                    alt={agent.name}
                    fill
                    className="object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                    <div className="w-20 h-20 bg-gray-400 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  </div>
                )}
                
                {/* Listings Badge */}
                <div className="absolute top-3 right-3">
                  <span className="bg-[#B8C332] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {agent.listings_count} Listings
                  </span>
                </div>
              </div>

              {/* Agent Name - Bold, left aligned */}
              <h1 className="text-xl font-bold text-gray-900 text-left mb-2 pl-2">
                {agent.name}
              </h1>

              {/* Email - Left aligned, directly under name */}
              {agent.email && (
                <p className="text-sm text-gray-600 text-left mb-4 pl-2">
                  {agent.email}
                </p>
              )}

              {/* Contact Button */}
              <button 
                onClick={open_contact_modal}
                className="w-full bg-[#B8C332] hover:bg-[#a6b02e] text-white py-3 px-6 rounded-full font-medium transition-colors mb-6"
              >
                Contact Now
              </button>

              {/* Additional Contact Information */}
              {agent.phone_number && (
                <div className="text-sm text-gray-600 text-left mb-4">
                  <p>{agent.phone_number}</p>
                </div>
              )}

              {/* Branch Information */}
              {agent.branch && (
                <div className="text-sm text-gray-600 text-left">
                  <p className="font-medium text-gray-900 mb-1">Branch</p>
                  <p>{agent.branch.name || 'Ingwe'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Property Listings Section */}
          <div className="lg:col-span-3">
            <PropertyListingGrid
              properties={properties}
              listingType="mixed" // Since agents can have both sale and rental properties
              onLoadMore={load_more_properties}
              hasMore={has_more}
              loading={properties_loading}
            />
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