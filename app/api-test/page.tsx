'use client';

import { useEffect, useState } from 'react';
import { get_residential_listings } from '@/app/actions/property-actions';

export default function ApiTestPage() {
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        setLoading(true);
        // Fetch a sample of properties
        const data = await get_residential_listings({
          limit: 100 // Get a good sample
        });
        
        // Extract unique property types
        const typesSet = new Set<string>();
        data.results.forEach((property: any) => {
          if (property.property_type && typeof property.property_type === 'string') {
            typesSet.add(property.property_type);
          }
        });

        // Convert to array and sort alphabetically
        const types = Array.from(typesSet).sort();
        setPropertyTypes(types);
        
        console.log(`Found ${types.length} unique property types:`);
        console.log(types);
      } catch (err) {
        console.error('Error fetching property types:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyTypes();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Property Types Test</h1>
      
      {loading ? (
        <p>Loading property types...</p>
      ) : error ? (
        <div className="text-red-500">
          <p>Error: {error}</p>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-2">Found {propertyTypes.length} Property Types:</h2>
          <ul className="list-disc pl-5">
            {propertyTypes.map((type, index) => (
              <li key={index} className="mb-1">{type}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}