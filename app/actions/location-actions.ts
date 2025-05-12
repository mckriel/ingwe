"use server";

import { fetch_with_auth } from "../../services/api/auth";
import { getLocationCache, getLocationById, preloadCommonLocations } from "./preload-data";

// In-memory cache for location suggestions
const locationSuggestionsCache: Record<string, any[]> = {};

/**
 * Search for location suggestions based on user input
 * Used for autocomplete in the location search field
 */
export async function get_location_suggestions(query: string) {
    try {
        // Ensure common locations are preloaded
        await preloadCommonLocations();
        
        // Don't search for very short queries
        if (!query || query.trim().length < 2) {
            return [];
        }
        
        const trimmedQuery = query.trim().toLowerCase();
        
        // Check cache first
        if (locationSuggestionsCache[trimmedQuery]) {
            return locationSuggestionsCache[trimmedQuery];
        }
        
        // Get the location cache
        const locationCache = await getLocationCache();
        
        // Try to find matches in the preloaded cache first
        const cacheMatches = Object.values(locationCache)
            .filter((loc: any) => {
                // Prepare searchable text
                const searchableText = [
                    loc.area, 
                    loc.suburb,
                    loc.province
                ].filter(Boolean).join(' ').toLowerCase();
                
                // Check if any part starts with the query
                // This will make the search more intuitive
                const parts = searchableText.split(' ');
                
                // First check if any word starts with the query (preferred matching)
                if (parts.some(part => part.startsWith(trimmedQuery))) {
                    return true;
                }
                
                // Then check if any part contains the query as a fallback
                return searchableText.includes(trimmedQuery);
            })
            .slice(0, 10)
            .map((loc: any) => {
                // Format display string
                let displayName = '';
                if (loc.suburb && loc.area) {
                    displayName = `${loc.suburb}, ${loc.area}`;
                } else if (loc.area) {
                    displayName = loc.area;
                } else if (loc.suburb) {
                    displayName = loc.suburb;
                } else if (loc.province) {
                    displayName = loc.province;
                } else {
                    displayName = `Location ID: ${loc.id}`;
                }
                
                return {
                    id: loc.id,
                    display: displayName,
                    area: loc.area || '',
                    suburb: loc.suburb || '',
                    province: loc.province || '',
                    full: loc
                };
            });
        
        // If we found matches in the cache, sort and use those
        if (cacheMatches.length >= 5) {
            // Sort cache matches the same way as API results
            const sortedCacheMatches = [...cacheMatches].sort((a, b) => {
                const aText = [a.suburb, a.area, a.province].filter(Boolean).join(' ').toLowerCase();
                const bText = [b.suburb, b.area, b.province].filter(Boolean).join(' ').toLowerCase();
                
                // Check if either text starts with the query
                const aStartsWith = aText.split(' ').some(part => part.startsWith(trimmedQuery));
                const bStartsWith = bText.split(' ').some(part => part.startsWith(trimmedQuery));
                
                // Prioritize items that start with the query
                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;
                
                // Secondary sort by text length (shorter results first)
                return aText.length - bText.length;
            });
            
            locationSuggestionsCache[trimmedQuery] = sortedCacheMatches;
            return sortedCacheMatches;
        }
        
        // Otherwise, make API request for location search
        const response = await fetch_with_auth(
            `/locations/api/v1/locations/?search=${encodeURIComponent(trimmedQuery)}&limit=10`
        );
        
        if (!response.ok) {
            console.error(`Failed to fetch location suggestions: ${response.status} ${response.statusText}`);
            return cacheMatches.length > 0 ? cacheMatches : [];
        }
        
        const data = await response.json();
        
        // Get location cache once before mapping
        const cache = await getLocationCache();
        
        // Format the suggestions and prioritize exact matches
        const suggestions = data.results.map((loc: any) => {
            // Store in cache
            cache[loc.id] = loc;
            
            // Format display string
            let displayName = '';
            if (loc.suburb && loc.area) {
                displayName = `${loc.suburb}, ${loc.area}`;
            } else if (loc.area) {
                displayName = loc.area;
            } else if (loc.suburb) {
                displayName = loc.suburb;
            } else if (loc.province) {
                displayName = loc.province;
            } else {
                displayName = `Location ID: ${loc.id}`;
            }
            
            // Return formatted suggestion
            return {
                id: loc.id,
                display: displayName,
                area: loc.area || '',
                suburb: loc.suburb || '',
                province: loc.province || '',
                full: loc
            };
        });
        
        // Sort suggestions to prioritize locations that start with the query
        const sortedSuggestions = [...suggestions].sort((a, b) => {
            const aText = [a.suburb, a.area, a.province].filter(Boolean).join(' ').toLowerCase();
            const bText = [b.suburb, b.area, b.province].filter(Boolean).join(' ').toLowerCase();
            
            // Check if either text starts with the query
            const aStartsWith = aText.split(' ').some(part => part.startsWith(trimmedQuery));
            const bStartsWith = bText.split(' ').some(part => part.startsWith(trimmedQuery));
            
            // Prioritize items that start with the query
            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;
            
            // Secondary sort by text length (shorter results first)
            return aText.length - bText.length;
        });
        
        // Cache the results
        locationSuggestionsCache[trimmedQuery] = sortedSuggestions;
        
        return sortedSuggestions;
    } catch (error) {
        console.error("Error fetching location suggestions:", error);
        return [];
    }
}