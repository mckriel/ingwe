"use client";

import { get_location_suggestions } from './location-actions';

// Client-side location cache
type LocationCache = {
  suggestions: Record<string, Array<any>>;
  lastFetch: number;
};

// Initialize the client-side cache
const clientLocationCache: LocationCache = {
  suggestions: {},
  lastFetch: 0
};

// Cache configuration
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes in milliseconds

/**
 * Client-side wrapper for getting location suggestions
 * Handles caching to reduce API calls
 */
export async function getLocationSuggestions(query: string) {
  if (!query || query.trim().length < 2) {
    return [];
  }
  
  const trimmedQuery = query.trim().toLowerCase();
  
  // Check client-side cache first
  if (
    clientLocationCache.suggestions[trimmedQuery] && 
    Date.now() - clientLocationCache.lastFetch < CACHE_TTL
  ) {
    return clientLocationCache.suggestions[trimmedQuery];
  }
  
  // If not in cache or cache is stale, fetch from server
  try {
    const suggestions = await get_location_suggestions(trimmedQuery);
    
    // Update cache
    clientLocationCache.suggestions[trimmedQuery] = suggestions;
    clientLocationCache.lastFetch = Date.now();
    
    return suggestions;
  } catch (error) {
    console.error("Error fetching location suggestions:", error);
    return [];
  }
}

/**
 * Prefetch common location search terms to improve UX
 * This can be called when the location search field is focused
 */
export async function prefetchCommonLocationTerms() {
  // Common prefixes for South African locations
  const commonPrefixes = ['jo', 'ca', 'du', 'pr', 'bl', 'pe', 'ce', 'st'];
  
  // Don't prefetch if cache is still fresh
  if (Date.now() - clientLocationCache.lastFetch < CACHE_TTL) {
    return;
  }
  
  // Prefetch in parallel
  await Promise.all(
    commonPrefixes.map(async (prefix) => {
      try {
        // Only prefetch if not already in cache
        if (!clientLocationCache.suggestions[prefix]) {
          const suggestions = await get_location_suggestions(prefix);
          clientLocationCache.suggestions[prefix] = suggestions;
        }
      } catch (error) {
        // Silently fail for prefetch - it's just an optimization
        console.log(`Prefetch for "${prefix}" failed:`, error);
      }
    })
  );
  
  // Update last fetch time
  clientLocationCache.lastFetch = Date.now();
}

/**
 * Clear the client-side location cache
 * Useful when user performs a new search session
 */
export function clearLocationCache() {
  clientLocationCache.suggestions = {};
  clientLocationCache.lastFetch = 0;
}