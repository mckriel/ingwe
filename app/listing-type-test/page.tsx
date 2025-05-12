"use client";

import { useEffect, useState } from "react";
import { test_get_properties, test_location_data } from "@/app/actions/property-actions";

export default function TestPage() {
  // For listing type data
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // For location data test
  const [locationResults, setLocationResults] = useState<any>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await test_get_properties();
        setData(result);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const testLocationData = async () => {
    setLocationLoading(true);
    try {
      const results = await test_location_data();
      setLocationResults(results);
    } catch (error) {
      console.error("Error testing location data:", error);
      setLocationResults({ error: "Failed to test location data" });
    } finally {
      setLocationLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading listing type data...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">API Tests</h1>
      
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Listing Type Test</h2>
        <p className="mb-4">Check the console for complete listing_type data</p>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Reference</th>
                <th className="px-4 py-2 border">Listing Type</th>
                <th className="px-4 py-2 border">Purpose</th>
                <th className="px-4 py-2 border">Sale or Rent</th>
                <th className="px-4 py-2 border">Property Type</th>
                <th className="px-4 py-2 border">Price</th>
              </tr>
            </thead>
            <tbody>
              {data?.properties.map((property: any) => (
                <tr key={property.id}>
                  <td className="px-4 py-2 border">{property.id}</td>
                  <td className="px-4 py-2 border">{property.reference || 'N/A'}</td>
                  <td className="px-4 py-2 border">{property.listing_type || 'N/A'}</td>
                  <td className="px-4 py-2 border">{property.purpose || 'N/A'}</td>
                  <td className="px-4 py-2 border">{property.sale_or_rent || 'N/A'}</td>
                  <td className="px-4 py-2 border">{property.property_type || 'N/A'}</td>
                  <td className="px-4 py-2 border">{typeof property.price === 'number' ? `R${property.price.toLocaleString()}` : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Location Data Test</h2>
        
        <button
          onClick={testLocationData}
          disabled={locationLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6"
        >
          {locationLoading ? "Testing..." : "Test Location Data"}
        </button>

        {locationResults && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Test Results</h3>
            
            {locationResults.success ? (
              <div>
                <p className="mb-4">Success: {locationResults.property_count} properties analyzed</p>
                
                <h4 className="text-md font-medium mt-6 mb-2">Property Location Data</h4>
                <div className="overflow-x-auto">
                  <pre className="bg-gray-100 p-4 rounded">
                    {JSON.stringify(locationResults.location_data, null, 2)}
                  </pre>
                </div>
                
                <h4 className="text-md font-medium mt-6 mb-2">Location Details (if ID-based)</h4>
                <div className="overflow-x-auto">
                  <pre className="bg-gray-100 p-4 rounded">
                    {JSON.stringify(locationResults.location_details, null, 2)}
                  </pre>
                </div>
                
                <h4 className="text-md font-medium mt-6 mb-2">Sample of All Locations</h4>
                <div className="overflow-x-auto">
                  <pre className="bg-gray-100 p-4 rounded">
                    {JSON.stringify(locationResults.all_locations_sample, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-red-500">
                <p>Error: {locationResults.error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}