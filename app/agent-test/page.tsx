'use client';

import { useState, useEffect } from 'react';
import { get_listing_details, get_agent_details } from '@/app/actions/property-actions';

export default function AgentTestPage() {
  const [loading, set_loading] = useState(false);
  const [results, set_results] = useState<any>({});
  const [error, set_error] = useState<string | null>(null);

  // Set page title
  useEffect(() => {
    document.title = 'Agent Test | Ingwe | The Property Company';
  }, []);

  const test_listing_ids = ['2549731', '963962'];

  const fetch_agent_data = async () => {
    set_loading(true);
    set_error(null);
    const test_results: any = {};

    try {
      for (const listing_id of test_listing_ids) {
        console.log(`Fetching data for listing ${listing_id}...`);
        
        try {
          // Get listing details
          const listing_data = await get_listing_details(listing_id);
          
          if (listing_data) {
            test_results[listing_id] = {
              listing: listing_data,
              agent_details: null,
              raw_agent_data: listing_data.agent || null,
              site: listing_data.site || null,
              meta_agent: listing_data.meta?.agent || null
            };

            // If there's an agent ID, try to get full agent details
            if (listing_data.agent && typeof listing_data.agent === 'number') {
              try {
                const agent_details = await get_agent_details(listing_data.agent);
                test_results[listing_id].agent_details = agent_details;
              } catch (agent_error) {
                console.warn(`Failed to get agent details for agent ${listing_data.agent}:`, agent_error);
                test_results[listing_id].agent_error = agent_error;
              }
            }
          } else {
            test_results[listing_id] = {
              error: 'No listing data returned'
            };
          }
        } catch (listing_error) {
          console.error(`Error fetching listing ${listing_id}:`, listing_error);
          test_results[listing_id] = {
            error: (listing_error as Error).message || 'Failed to fetch listing'
          };
        }
      }

      set_results(test_results);
    } catch (general_error) {
      set_error((general_error as Error).message || 'Unknown error occurred');
    } finally {
      set_loading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Agent Data Test</h1>
        
        <div className="mb-6">
          <button
            onClick={fetch_agent_data}
            disabled={loading}
            className="bg-[#D1DA68] hover:bg-[#C5CE5F] text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Fetching Agent Data...' : 'Fetch Agent Data'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {Object.keys(results).length > 0 && (
          <div className="space-y-8">
            {test_listing_ids.map(listing_id => (
              <div key={listing_id} className="border border-gray-300 rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Listing ID: {listing_id}</h2>
                
                {results[listing_id]?.error ? (
                  <div className="text-red-600">
                    <strong>Error:</strong> {results[listing_id].error}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Basic Info */}
                    <div className="bg-gray-50 p-4 rounded">
                      <h3 className="font-semibold mb-2">Basic Info</h3>
                      <p><strong>Site:</strong> {results[listing_id]?.site || 'N/A'}</p>
                      <p><strong>Property Title:</strong> {results[listing_id]?.listing?.marketing_heading || results[listing_id]?.listing?.heading || 'N/A'}</p>
                    </div>

                    {/* Raw Agent Data */}
                    <div className="bg-blue-50 p-4 rounded">
                      <h3 className="font-semibold mb-2">Raw Agent Data from Listing</h3>
                      <pre className="text-sm bg-white p-2 rounded border overflow-x-auto">
                        {JSON.stringify(results[listing_id]?.raw_agent_data, null, 2)}
                      </pre>
                    </div>

                    {/* Meta Agent Data */}
                    {results[listing_id]?.meta_agent && (
                      <div className="bg-green-50 p-4 rounded">
                        <h3 className="font-semibold mb-2">Meta Agent Data</h3>
                        <pre className="text-sm bg-white p-2 rounded border overflow-x-auto">
                          {JSON.stringify(results[listing_id]?.meta_agent, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* Full Agent Details */}
                    {results[listing_id]?.agent_details && (
                      <div className="bg-yellow-50 p-4 rounded">
                        <h3 className="font-semibold mb-2">Full Agent Details (from get_agent_details)</h3>
                        <pre className="text-sm bg-white p-2 rounded border overflow-x-auto">
                          {JSON.stringify(results[listing_id]?.agent_details, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* Agent Error */}
                    {results[listing_id]?.agent_error && (
                      <div className="bg-red-50 p-4 rounded">
                        <h3 className="font-semibold mb-2">Agent Fetch Error</h3>
                        <pre className="text-sm bg-white p-2 rounded border overflow-x-auto">
                          {JSON.stringify(results[listing_id]?.agent_error, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}