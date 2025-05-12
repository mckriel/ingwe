"use server";

import { fetch_with_auth } from "../../services/api/auth";

// Define a type for property types
export interface PropertyType {
  id: number;
  name: string;
  display_name?: string; // This might be different from name in some cases
}

// Cache for property types
let property_types_cache: PropertyType[] | null = null;

/**
 * Fetch property types from the API
 * This function is intended to be called once to populate the cache
 */
export async function fetch_property_types(): Promise<PropertyType[]> {
  // If we already have property types cached, return them
  if (property_types_cache) {
    return property_types_cache;
  }

  try {
    // First attempt: Try dedicated property types endpoint
    try {
      console.log("Attempting to fetch from dedicated property types endpoint...");

      // Try different possible endpoint patterns
      const endpoints = [
        "/mashup/api/v1/property-types/",
        "/listings/api/v1/property-types/",
        "/propertydata/api/v1/property-types/"
      ];

      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          const response = await fetch_with_auth(endpoint);

          // Log the status to understand what's happening
          console.log(`Endpoint ${endpoint} response status:`, response.status);

          if (response.ok) {
            // Log the content type
            console.log(`Content-Type:`, response.headers.get('content-type'));

            // Parse the response
            const responseText = await response.text();
            console.log(`Response text sample:`, responseText.substring(0, 200));

            // Try to parse as JSON
            let data;
            try {
              data = JSON.parse(responseText);
            } catch (jsonError) {
              console.error(`Failed to parse response as JSON:`, jsonError);
              continue;
            }

            // Check if we have results array or if the data is already an array
            const resultsArray = Array.isArray(data) ? data : data.results;

            if (!resultsArray || !Array.isArray(resultsArray)) {
              console.log(`Endpoint ${endpoint} didn't return an array or results property:`, data);
              continue;
            }

            console.log(`Found ${resultsArray.length} property types from endpoint ${endpoint}`);

            // Try to process and format the property types
            // First, log a sample to understand the structure
            if (resultsArray.length > 0) {
              console.log(`Sample property type object:`, JSON.stringify(resultsArray[0], null, 2));
            }

            // Process the results - adapt to different possible structures
            const formatted_types = resultsArray.map((type: any, index: number) => {
              // If type is a string, use it directly
              if (typeof type === 'string') {
                return {
                  id: index + 1,
                  name: type,
                  display_name: type
                };
              }

              // If type is an object, try to extract relevant fields
              if (typeof type === 'object' && type !== null) {
                return {
                  id: type.id || index + 1,
                  name: type.name || type.type || type.value || `Type ${index + 1}`,
                  display_name: type.display_name || type.displayName || type.name || type.type || type.value || `Type ${index + 1}`
                };
              }

              // Fallback for other cases
              return {
                id: index + 1,
                name: `Type ${String(type)}`,
                display_name: `Type ${String(type)}`
              };
            });

            // Cache the results
            property_types_cache = formatted_types;
            console.log(`Successfully cached ${formatted_types.length} property types from endpoint ${endpoint}`);

            return formatted_types;
          }
        } catch (endpointError) {
          console.error(`Error trying endpoint ${endpoint}:`, endpointError);
          // Continue to the next endpoint
        }
      }

      // If we reach here, all endpoints failed
      console.error("All property types endpoints failed");
    } catch (directEndpointError) {
      console.error("Property types endpoint error:", directEndpointError);
      // Continue to alternative approach
    }

    // Second attempt: Extract property types from residential listings
    console.log("Attempting to extract property types from residential listings");
    const listingsResponse = await fetch_with_auth("/mashup/api/v1/residential/?limit=100");

    if (!listingsResponse.ok) {
      console.error(`Failed to fetch residential listings: ${listingsResponse.status} ${listingsResponse.statusText}`);
      return []; // Return empty array if there's an error
    }

    const listingsData = await listingsResponse.json();

    // Extract unique property types from listings
    const property_types_set = new Set<string>();
    const object_property_types: any[] = [];

    console.log(`Analyzing property_type field in ${listingsData.results.length} properties...`);

    listingsData.results.forEach((property: any) => {
      if (!property.property_type) {
        return; // Skip if no property_type
      }

      // Case 1: property_type is a string (most likely case)
      if (typeof property.property_type === 'string') {
        property_types_set.add(property.property_type);
      }
      // Case 2: property_type is an object
      else if (typeof property.property_type === 'object' && property.property_type !== null) {
        console.log(`Found property_type as object:`, property.property_type);
        object_property_types.push(property.property_type);

        // Try to extract properties that might contain the type name
        if (property.property_type.name) {
          property_types_set.add(property.property_type.name);
        } else if (property.property_type.type) {
          property_types_set.add(property.property_type.type);
        } else if (property.property_type.display_name) {
          property_types_set.add(property.property_type.display_name);
        } else {
          // If we can't find an obvious name property, log the object for inspection
          console.log(`Object property_type without obvious name field:`,
            JSON.stringify(property.property_type));
        }
      }
      // Case 3: property_type is a number (could be an ID)
      else if (typeof property.property_type === 'number') {
        console.log(`Found property_type as number:`, property.property_type);
        // We'll need to handle this case if it occurs
        // For now, convert to string to avoid losing the information
        property_types_set.add(`Type ${property.property_type}`);
      }
    });

    // If we found object property types, analyze their structure
    if (object_property_types.length > 0) {
      console.log(`Found ${object_property_types.length} property types as objects`);

      // Analyze first object to understand structure
      const firstObject = object_property_types[0];
      console.log(`Sample object property_type structure:`,
        JSON.stringify(firstObject, null, 2));

      // Extract common keys that might contain type information
      const keyFrequency: {[key: string]: number} = {};
      object_property_types.forEach(obj => {
        Object.keys(obj).forEach(key => {
          keyFrequency[key] = (keyFrequency[key] || 0) + 1;
        });
      });

      console.log(`Common keys in property_type objects:`, keyFrequency);
    }

    // Convert to array and format
    const property_types_array = Array.from(property_types_set);
    console.log(`Extracted ${property_types_array.length} unique property types from listings:`,
      property_types_array);

    const formatted_types = property_types_array.map((type, index) => ({
      id: index + 1,
      name: type,
      display_name: type
    }));

    // If we found property types, cache them
    if (formatted_types.length > 0) {
      console.log(`Extracted ${formatted_types.length} property types from listings`);
      property_types_cache = formatted_types;
      return formatted_types;
    }

    // If we get here, both approaches failed
    console.error("Could not retrieve property types from any source");
    return [];
  } catch (error) {
    console.error("Error fetching property types:", error);
    return []; // Return empty array if there's an error
  }
}

/**
 * Get property types for the UI
 * This function will use cached values if available
 */
export async function get_property_types(): Promise<PropertyType[]> {
  // Return cached property types or fetch them if not yet cached
  return property_types_cache || await fetch_property_types();
}

/**
 * Fallback property types in case API fails
 * This ensures we always have something to display
 * Note: Using a function to comply with 'use server' rules (only async functions can be exported)
 *
 * This list is based on common South African property types
 */
const fallback_types: PropertyType[] = [
  { id: 1, name: "House", display_name: "House" },
  { id: 2, name: "Apartment", display_name: "Apartment" },
  { id: 3, name: "Townhouse", display_name: "Townhouse" },
  { id: 4, name: "Villa", display_name: "Villa" },
  { id: 5, name: "Duplex", display_name: "Duplex" },
  { id: 6, name: "Cluster", display_name: "Cluster" },
  { id: 7, name: "Estate", display_name: "Estate" },
  { id: 8, name: "Farm", display_name: "Farm" },
  { id: 9, name: "Land", display_name: "Land" },
  { id: 10, name: "Commercial", display_name: "Commercial" },
  { id: 11, name: "Industrial", display_name: "Industrial" },
  { id: 12, name: "Retail", display_name: "Retail" },
  { id: 13, name: "Office", display_name: "Office" },
  { id: 14, name: "Retirement", display_name: "Retirement" },
  { id: 15, name: "Student Accommodation", display_name: "Student Accommodation" }
];

/**
 * Get fallback property types
 */
export async function get_fallback_property_types(): Promise<PropertyType[]> {
  return fallback_types;
}

/**
 * Get property types - never returns an empty array
 * Will fall back to default types if API fails
 */
export async function get_safe_property_types(): Promise<PropertyType[]> {
  const types = await get_property_types();
  return types.length > 0 ? types : await get_fallback_property_types();
}