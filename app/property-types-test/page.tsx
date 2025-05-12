"use client";

import { useEffect, useState } from "react";
import { fetch_property_types, get_fallback_property_types, PropertyType } from "@/app/actions/property-types";
import { test_get_properties } from "@/app/actions/property-actions";

export default function PropertyTypesTestPage() {
  const [apiPropertyTypes, setApiPropertyTypes] = useState<PropertyType[]>([]);
  const [extractedPropertyTypes, setExtractedPropertyTypes] = useState<{[key: string]: any}[]>([]);
  const [fallbackPropertyTypes, setFallbackPropertyTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Add state for API documentation
  const [apiDocs, setApiDocs] = useState<any>(null);
  const [apiEndpoints, setApiEndpoints] = useState<string[]>([]);
  const [specificEndpoints, setSpecificEndpoints] = useState<{[key: string]: any}>({});

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // 0. Try to get API documentation to discover endpoints
        try {
          const apiDocsResponse = await fetch("/api/check-api-docs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({})
          });

          if (apiDocsResponse.ok) {
            const docsData = await apiDocsResponse.json();
            setApiDocs(docsData);

            // Store specific endpoints data
            if (docsData.specificEndpoints) {
              setSpecificEndpoints(docsData.specificEndpoints);
            }

            // Extract endpoints that might be related to property types
            if (docsData.endpoints && typeof docsData.endpoints === 'object') {
              try {
                const relevantEndpoints = Object.keys(docsData.endpoints)
                  .filter(endpoint =>
                    endpoint.toLowerCase().includes('property') &&
                    endpoint.toLowerCase().includes('type')
                  );
                setApiEndpoints(relevantEndpoints);
              } catch (error) {
                console.error("Error extracting property type endpoints:", error);
              }
            }
          }
        } catch (error) {
          console.error("Failed to fetch API documentation:", error);
        }

        // 1. Try getting property types from the API
        console.log("Attempting to fetch property types from API...");
        const types = await fetch_property_types();
        setApiPropertyTypes(types);

        // 2. Get fallback property types for comparison
        const fallbackTypes = await get_fallback_property_types();
        setFallbackPropertyTypes(fallbackTypes);

        // 3. Get raw property data to examine the property_type field structure
        console.log("Fetching properties to examine property_type structure...");
        const propertiesData = await test_get_properties();
        setApiResponse(propertiesData);

        if (propertiesData && propertiesData.properties) {
          // Extract and analyze property_type fields from each property
          const extractedTypes = propertiesData.properties.map((property: any) => {
            // Create a detailed analysis of the property_type field
            return {
              propertyId: property.id,
              propertyType: property.property_type,
              propertyTypeType: typeof property.property_type,
              isObject: typeof property.property_type === 'object' && property.property_type !== null,
              isString: typeof property.property_type === 'string',
              isNumber: typeof property.property_type === 'number',
              isEmpty: !property.property_type,
              // If it's an object, show its keys and values
              ...(typeof property.property_type === 'object' && property.property_type !== null
                ? {
                    keys: Object.keys(property.property_type),
                    objectValues: Object.keys(property.property_type).reduce((acc: any, key: string) => {
                      acc[key] = property.property_type[key];
                      return acc;
                    }, {})
                  }
                : {})
            };
          });

          setExtractedPropertyTypes(extractedTypes);
        }
      } catch (err) {
        console.error("Error in property types test:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading property types data...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Property Types Test - Error</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Count how many properties have each type of property_type data structure
  const typeStructureCounts = {
    string: extractedPropertyTypes.filter(p => p.isString).length,
    object: extractedPropertyTypes.filter(p => p.isObject).length,
    number: extractedPropertyTypes.filter(p => p.isNumber).length,
    empty: extractedPropertyTypes.filter(p => p.isEmpty).length
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Property Types Test</h1>

      {Object.keys(specificEndpoints).length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Specific API Endpoints Tested</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Endpoint</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Content Type</th>
                  <th className="px-4 py-2 border">Details</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(specificEndpoints).map(([endpoint, data], index) => (
                  <tr key={index} className={data.ok ? "bg-green-50" : "bg-red-50"}>
                    <td className="px-4 py-2 border">{endpoint}</td>
                    <td className="px-4 py-2 border">
                      {data.ok ? (
                        <span className="text-green-600">OK ({data.status})</span>
                      ) : (
                        <span className="text-red-600">Failed ({data.status || "Error"})</span>
                      )}
                    </td>
                    <td className="px-4 py-2 border">{data.contentType || "N/A"}</td>
                    <td className="px-4 py-2 border">
                      {data.error ? (
                        <span className="text-red-500">{data.error}</span>
                      ) : data.structure ? (
                        <details>
                          <summary className="cursor-pointer text-blue-600">View structure</summary>
                          <pre className="text-xs mt-1 bg-gray-50 p-1 rounded">
                            {JSON.stringify(data.structure, null, 2)}
                          </pre>
                        </details>
                      ) : (
                        "No details available"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {apiEndpoints.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">API Documentation - Property Type Endpoints</h2>
          <p className="mb-2">Found {apiEndpoints.length} potential property type endpoints:</p>
          <ul className="list-disc ml-6 mb-4">
            {apiEndpoints.map((endpoint, index) => (
              <li key={index}>{endpoint}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">API Property Types</h2>
        {apiPropertyTypes.length > 0 ? (
          <div>
            <p className="mb-2">Successfully retrieved {apiPropertyTypes.length} property types from API:</p>
            <ul className="list-disc ml-6 mb-4">
              {apiPropertyTypes.map(type => (
                <li key={type.id}>
                  {type.display_name || type.name} (ID: {type.id})
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-amber-700">No property types retrieved from API.</p>
        )}
      </div>
      
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Property Type Structure Analysis</h2>
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h3 className="font-medium mb-2">Structure Counts:</h3>
          <ul className="list-disc ml-6">
            <li>String: {typeStructureCounts.string}</li>
            <li>Object: {typeStructureCounts.object}</li>
            <li>Number: {typeStructureCounts.number}</li>
            <li>Empty/Null/Undefined: {typeStructureCounts.empty}</li>
          </ul>
        </div>
        
        <h3 className="font-medium mb-2">Sample Properties:</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Property ID</th>
                <th className="px-4 py-2 border">Property Type</th>
                <th className="px-4 py-2 border">Data Type</th>
                <th className="px-4 py-2 border">Details</th>
              </tr>
            </thead>
            <tbody>
              {extractedPropertyTypes.map((property, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border">{property.propertyId}</td>
                  <td className="px-4 py-2 border">
                    {property.isObject ? (
                      <span className="text-blue-600">Object</span>
                    ) : property.isString ? (
                      <span>{property.propertyType}</span>
                    ) : property.isEmpty ? (
                      <span className="text-gray-400">Empty</span>
                    ) : (
                      String(property.propertyType)
                    )}
                  </td>
                  <td className="px-4 py-2 border">{property.propertyTypeType}</td>
                  <td className="px-4 py-2 border">
                    {property.isObject && (
                      <div>
                        <p>Keys: {property.keys.join(', ')}</p>
                        <pre className="text-xs mt-1 bg-gray-50 p-1 rounded">
                          {JSON.stringify(property.objectValues, null, 2)}
                        </pre>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Fallback Property Types</h2>
        <ul className="list-disc ml-6">
          {fallbackPropertyTypes.map(type => (
            <li key={type.id}>
              {type.display_name || type.name} (ID: {type.id})
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Raw API Response</h2>
        <details>
          <summary className="cursor-pointer text-blue-600 mb-2">Click to expand raw API response</summary>
          <pre className="text-xs bg-gray-50 p-4 rounded max-h-96 overflow-y-auto">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}