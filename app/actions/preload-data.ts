"use server";

import { fetch_with_auth } from "../../services/api/auth";
import { get_property_types } from "./property-types";

// Simple location cache with minimal functionality
const locationCache: Record<string, any> = {};

/**
 * Get the location cache
 */
export async function getLocationCache(): Promise<Record<string, any>> {
  return locationCache;
}

/**
 * Fetch location details by ID, with caching
 */
export async function getLocationById(locationId: number | string): Promise<any> {
  if (!locationId) return null;
  
  const id = typeof locationId === 'string' ? locationId : String(locationId);
  
  // Check cache first
  if (locationCache[id]) {
    return locationCache[id];
  }
  
  // Fetch from API if not in cache
  try {
    const response = await fetch_with_auth(`/locations/api/v1/locations/${id}/`);
    
    if (!response.ok) {
      return null;
    }
    
    const location = await response.json();
    
    // Add to cache
    locationCache[id] = location;
    
    return location;
  } catch (error) {
    return null;
  }
}

/**
 * Get a formatted location string from a location ID
 * Uses the cache to avoid extra API calls
 */
export async function getLocationString(locationId: number | string | null | undefined): Promise<string> {
  if (!locationId) return 'Unknown Location';
  
  const location = await getLocationById(locationId);
  
  if (!location) return 'Unknown Location';
  
  // Format location string from cache
  if (location.suburb && location.area) {
    return `${location.suburb}, ${location.area}`;
  } else if (location.area) {
    return location.area;
  } else if (location.suburb) {
    return location.suburb;
  } else if (location.province) {
    return location.province;
  }
  
  return 'Unknown Location';
}

/**
 * Process an array of properties to add location information
 * Only fetches what's needed, with minimal API calls
 */
export async function get_locations_for_properties(properties: any[]) {
  if (!properties || properties.length === 0) {
    return properties;
  }
  
  try {
    // Get unique location IDs that need to be fetched
    const locationIds = [...new Set(
      properties
        .map(prop => prop.location)
        .filter(loc => loc && (typeof loc === 'number' || (typeof loc === 'string' && !isNaN(Number(loc)))))
    )];
    
    // Fetch all needed locations in parallel
    if (locationIds.length > 0) {
      const fetchPromises = locationIds
        .filter(id => !locationCache[id])
        .map(id => getLocationById(id));
      
      await Promise.all(fetchPromises);
    }
    
    // Add location information to properties
    return properties.map(property => {
      if (!property.location) {
        return {
          ...property,
          locationString: 'Unknown Location'
        };
      }
      
      const locationId = property.location;
      const locationDetail = locationCache[locationId];
      
      let locationString = 'Unknown Location';
      
      if (locationDetail) {
        if (locationDetail.suburb && locationDetail.area) {
          locationString = `${locationDetail.suburb}, ${locationDetail.area}`;
        } else if (locationDetail.area) {
          locationString = locationDetail.area;
        } else if (locationDetail.suburb) {
          locationString = locationDetail.suburb;
        } else if (locationDetail.province) {
          locationString = locationDetail.province;
        }
      } else if (typeof property.location === 'string' && isNaN(Number(property.location))) {
        locationString = property.location;
      }
      
      return {
        ...property,
        locationString
      };
    });
  } catch (error) {
    // On error, return properties with basic location handling
    return properties.map(prop => ({
      ...prop,
      locationString: typeof prop.location === 'string' && isNaN(Number(prop.location)) 
        ? prop.location 
        : 'Unknown Location'
    }));
  }
}

/**
 * Preload property types - simplified to reduce API calls
 */
export async function preloadPropertyTypes(): Promise<void> {
  try {
    await get_property_types();
  } catch (error) {
    // Silent fail
  }
}

// Legacy functions kept for compatibility - do nothing now
export async function preloadCommonLocations() {
  return { cached: Object.keys(locationCache).length };
}

export async function refreshLocationCache() {
  return { success: true };
}