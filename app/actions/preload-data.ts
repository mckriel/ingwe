"use server";

import { fetch_with_auth } from "../../services/api/auth";

// Global location cache
// This cache will be shared across the application
const locationCache: Record<string, any> = {};
let isPreloaded = false;
let lastPreloadTime = 0;

// Cache config
const CACHE_REFRESH_INTERVAL = 1000 * 60 * 60; // 1 hour in milliseconds
const MAX_CACHE_SIZE = 500; // Maximum number of locations to keep in cache

// Priority areas (most common/important locations in South Africa)
const PRIORITY_AREAS = [
  'Cape Town', 
  'Johannesburg', 
  'Pretoria', 
  'Durban', 
  'Sandton', 
  'Centurion', 
  'Port Elizabeth', 
  'Bloemfontein',
  'Stellenbosch'
];

/**
 * Preloads common locations into the cache
 * This should be called once when the app initializes
 */
export async function preloadCommonLocations() {
  const now = Date.now();
  
  // If already preloaded and cache is fresh, don't do it again
  if (isPreloaded && (now - lastPreloadTime) < CACHE_REFRESH_INTERVAL) {
    return { cached: Object.keys(locationCache).length, fresh: true };
  }
  
  try {
    // First preload priority areas
    await preloadPriorityLocations();
    
    // Then fetch a larger number of locations
    const response = await fetch_with_auth('/locations/api/v1/locations/?limit=100&country=South Africa');
    
    if (!response.ok) {
      console.error(`Failed to preload locations: ${response.status} ${response.statusText}`);
      return { error: `API error: ${response.status}` };
    }
    
    const data = await response.json();
    
    // Batch the results in the cache
    data.results.forEach((location: any) => {
      locationCache[location.id] = location;
    });
    
    // Mark as preloaded and update time
    isPreloaded = true;
    lastPreloadTime = now;
    
    // Enforce cache size limit (LRU-style)
    trimCache();
    
    return {
      success: true,
      cached: Object.keys(locationCache).length,
      message: `Preloaded ${data.results.length} locations`
    };
  } catch (error) {
    console.error("Error preloading locations:", error);
    return {
      success: false,
      cached: Object.keys(locationCache).length,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Preloads priority locations first
 * These are high-traffic areas that are likely to be searched often
 */
async function preloadPriorityLocations() {
  try {
    // Create promises for each priority area
    const priorityPromises = PRIORITY_AREAS.map(async (area) => {
      try {
        // Search for locations matching this area
        const response = await fetch_with_auth(
          `/locations/api/v1/locations/?search=${encodeURIComponent(area)}&limit=10`
        );
        
        if (!response.ok) return null;
        
        const data = await response.json();
        
        // Add each result to the cache with priority flag
        data.results.forEach((location: any) => {
          location.priority = true; // Mark as priority to avoid removal during cache trimming
          locationCache[location.id] = location;
        });
        
        return data.results.length;
      } catch (error) {
        console.error(`Error preloading priority area ${area}:`, error);
        return 0;
      }
    });
    
    // Wait for all priority area requests to complete
    await Promise.all(priorityPromises);
    
    return { success: true };
  } catch (error) {
    console.error("Error preloading priority locations:", error);
    return { success: false };
  }
}

/**
 * Trims the cache to prevent it from growing too large
 * Keeps priority locations and removes least recently used locations
 */
function trimCache() {
  const cacheSize = Object.keys(locationCache).length;
  
  if (cacheSize <= MAX_CACHE_SIZE) return;
  
  // Get all location entries
  const entries = Object.entries(locationCache);
  
  // Sort by priority (keep) and then by ID (as a proxy for age/usage)
  // In a more sophisticated implementation, we would track actual usage timestamps
  const sortedEntries = entries.sort((a, b) => {
    // Keep priority locations
    if (a[1].priority && !b[1].priority) return -1;
    if (!a[1].priority && b[1].priority) return 1;
    
    // Otherwise sort by ID (assuming newer IDs are higher/more recent)
    return parseInt(b[0]) - parseInt(a[0]);
  });
  
  // Calculate how many to remove
  const removeCount = cacheSize - MAX_CACHE_SIZE;
  
  // Remove oldest/least priority items
  sortedEntries.slice(-removeCount).forEach(([id]) => {
    delete locationCache[id];
  });
}

/**
 * Force refresh the location cache
 * This is useful after a long period of inactivity
 */
export async function refreshLocationCache() {
  // Clear non-priority locations
  Object.entries(locationCache).forEach(([id, loc]) => {
    if (!loc.priority) {
      delete locationCache[id];
    }
  });
  
  // Reset preloaded flag to force a fresh load
  isPreloaded = false;
  
  // Reload common locations
  return await preloadCommonLocations();
}

/**
 * Get a formatted location string from a location ID
 * Uses the shared cache to avoid extra API calls
 */
export async function getLocationString(locationId: number | string | null | undefined): Promise<string> {
  if (!locationId) return 'South Africa';
  
  const id = typeof locationId === 'string' ? locationId : String(locationId);
  const location = locationCache[id];
  
  if (!location) return 'South Africa';
  
  // Format location string from cache
  if (location.area && location.suburb) {
    return `${location.suburb}, ${location.area}`;
  } else if (location.area) {
    return location.area;
  } else if (location.suburb) {
    return location.suburb;
  } else if (location.province) {
    return location.province;
  }
  
  return 'South Africa';
}

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
    // Mark this location as accessed (in this simple implementation, we just toggle the priority flag)
    locationCache[id].priority = true;
    return locationCache[id];
  }
  
  // Fetch from API if not in cache
  try {
    const response = await fetch_with_auth(`/locations/api/v1/locations/${id}/`);
    
    if (!response.ok) {
      console.error(`Failed to fetch location ${id}: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const location = await response.json();
    
    // Add to cache
    locationCache[id] = location;
    
    // Trim cache if it's getting too large
    if (Object.keys(locationCache).length > MAX_CACHE_SIZE) {
      trimCache();
    }
    
    return location;
  } catch (error) {
    console.error(`Error fetching location ${locationId}:`, error);
    return null;
  }
}