// app/actions/property-actions.ts

"use server";

import { get_token, fetch_with_auth } from "../../services/api/auth";

/**
 * Test the authentication and API connection
 */
export async function test_auth() {
	try {
		// Test getting a token
		const token = await get_token();
		
		// Test making an authenticated request to the residential listings endpoint
		const response = await fetch_with_auth("/listings/api/v1/residential/");
		
		// Parse the response if it was successful
		let data = null;
		if (response.ok) {
			try {
				data = await response.json();
			} catch (e) {
				console.error("Failed to parse response data:", e);
			}
		}
		
		return {
			success: true,
			token_received: !!token,
			token_preview: token.substring(0, 10) + "...", // Just show part of the token for security
			api_response: response.ok,
			status_code: response.status,
			data_preview: data ? "Data received successfully" : "No data or parsing failed"
		};
	} catch (error) {
		console.error("test_auth error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error"
		};
	}
}

/**
 * Test function to fetch a limited number of properties
 */
export async function test_get_properties() {
	try {
		// Get 10 properties
		const data = await get_residential_listings({
			limit: 10,
			order_by: "-created" // Most recent first
		});
		
		// Log listing_type values
		console.log("Listing types:", data.results.map((property: any) => ({
			id: property.id,
			listing_type: property.listing_type,
			purpose: property.purpose,
			sale_or_rent: property.sale_or_rent,
			// Log a few other fields that might indicate sale/rent status
			status: property.status,
			price_type: property.price_type
		})));
		
		// Return a simplified version for display
		return {
			success: true,
			total_count: data.count,
			results_count: data.results.length,
			properties: data.results.map((property: any) => ({
				id: property.id,
				reference: property.web_ref,
				description: property.description ? property.description.substring(0, 100) + "..." : "No description",
				price: property.price,
				bedrooms: property.bedrooms,
				bathrooms: property.bathrooms,
				property_type: property.property_type,
				location: property.location,
				created: property.created,
				listing_images: property.listing_images,
				header_images: property.header_images,
				listing_type: property.listing_type,
				purpose: property.purpose,
				sale_or_rent: property.sale_or_rent
			}))
		};
	} catch (error) {
		console.error("test_get_properties error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error"
		};
	}
}

/**
 * Special test function to extract company information from properties
 */
export async function test_company_info() {
	try {
		// Get a mix of properties with different company information
		const data = await get_residential_listings({
			limit: 10,
			order_by: "-created"
		});
		
		// Extract more detailed company/agent info from properties
		const propertyInfo = data.results.slice(0, 10).map((property: any) => {
			// Collect all fields that might contain company information
			const companyFields = {
				propertyId: property.id,
				site: property.site,
				branch: property.branch,
				branch_name: property.branch_name || null,
				agent: property.agent,
				agent_name: property.agent_name || null,
				company_name: null,
				managing_agent: property.managing_agent || null,
				managing_agent_email: property.managing_agent_email || null,
				managing_agent_telephone_number: property.managing_agent_telephone_number || null,
				// Include raw data fields that might contain company info
				web_ref: property.web_ref || null,
				// Extract any other identifiers
				residential_id: property.residential || null,
				generic_id: property.generic || null,
				model: property.model || null
			};
			
			// Look for company name in various fields
			if (property.meta?.branch?.name) {
				companyFields.company_name = property.meta.branch.name;
			} else if (property.meta?.agent?.branch?.name) {
				companyFields.company_name = property.meta.agent.branch.name;
			}
			
			// Check branch info if available
			if (property.meta?.branch) {
				companyFields.branch_name = property.meta.branch.name;
			}
			
			// Check agent info if available
			if (property.meta?.agent?.name) {
				companyFields.agent_name = property.meta.agent.name;
			}
			
			return companyFields;
		});
		
		// Analyze the site IDs to see which ones might be Ingwe
		const siteAnalysis: Record<string, {count: number, properties: any[]}> = {};
		propertyInfo.forEach((property: any) => {
			const siteId = property.site;
			if (!siteAnalysis[siteId]) {
				siteAnalysis[siteId] = {
					count: 0,
					properties: []
				};
			}
			siteAnalysis[siteId].count++;
			siteAnalysis[siteId].properties.push({
				id: property.propertyId,
				company_name: property.company_name,
				branch_name: property.branch_name,
				managing_agent: property.managing_agent
			});
		});
		
		return {
			success: true,
			message: "Detailed company information for debugging",
			property_count: data.results.length,
			company_info: propertyInfo,
			site_analysis: siteAnalysis,
			recommendation: "Based on previous findings, site ID 217 appears to be associated with Ingwe properties"
		};
	} catch (error) {
		console.error("test_company_info error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error"
		};
	}
}

/**
 * Fetch properties formatted for the PropertyListingGrid component
 */
export async function get_formatted_properties(params: {
	limit?: number;
	offset?: number;
	location?: string;
	location_display?: string;
	location_suburb?: string;
	location_area?: string;
	location_province?: string;
	property_type?: string;
	min_price?: number;
	max_price?: number;
	bedrooms?: number;
	include_full_description?: boolean;
	company?: string;
	site?: number;
	branch?: number;
	listing_type?: string; // Add listing_type parameter to filter by "For Sale" or "To Let"
} = {}) {
	try {
		// Default to 12 properties if not specified
		const limit = params.limit || 12;
		
		// First, try searching by location ID
		let data;
		
		// Log to track what's happening
		console.log("Attempting to fetch properties with params:", {
			location_id: params.location,
			location_display: params.location_display,
			location_suburb: params.location_suburb,
			location_area: params.location_area
		});
		
		// First try to search by location ID
		if (params.location) {
			console.log("Searching by location ID:", params.location);
			
			data = await get_residential_listings({
				limit: limit,
				offset: params.offset,
				order_by: "-created", // Most recent first
				location: params.location,
				property_type: params.property_type,
				min_price: params.min_price,
				max_price: params.max_price,
				bedrooms: params.bedrooms,
				company: params.company,
				site: params.site,
				branch: params.branch,
				listing_type: params.listing_type
			});
			
			// Check if we got any results
			if (data.results.length === 0 && params.location_display) {
				console.log(`No results found for location ID ${params.location}, trying to search by name: ${params.location_display}`);
				
				// Try searching by location text/display name if ID search returned no results
				data = await get_residential_listings({
					limit: limit,
					offset: params.offset,
					order_by: "-created",
					search: params.location_display, // Use display name in search field
					property_type: params.property_type,
					min_price: params.min_price,
					max_price: params.max_price,
					bedrooms: params.bedrooms,
					company: params.company,
					site: params.site,
					branch: params.branch,
					listing_type: params.listing_type
				});
				
				// If still no results, try using suburb or area name
				if (data.results.length === 0) {
					let searchTerm = "";
					
					// Try suburb first, then area, then province
					if (params.location_suburb) {
						searchTerm = params.location_suburb;
					} else if (params.location_area) {
						searchTerm = params.location_area;
					} else if (params.location_province) {
						searchTerm = params.location_province;
					}
					
					if (searchTerm) {
						console.log(`Still no results, trying with term: ${searchTerm}`);
						
						data = await get_residential_listings({
							limit: limit,
							offset: params.offset,
							order_by: "-created",
							search: searchTerm,
							property_type: params.property_type,
							min_price: params.min_price,
							max_price: params.max_price,
							bedrooms: params.bedrooms,
							company: params.company,
							site: params.site,
							branch: params.branch,
							listing_type: params.listing_type
						});
					}
				}
			}
		} else {
			// Default search without location filter
			data = await get_residential_listings({
				limit: limit,
				offset: params.offset,
				order_by: "-created", // Most recent first
				property_type: params.property_type,
				min_price: params.min_price,
				max_price: params.max_price,
				bedrooms: params.bedrooms,
				company: params.company,
				site: params.site,
				branch: params.branch,
				listing_type: params.listing_type // Pass listing_type to filter by sale or rent
			});
		}
		
		// Format properties with basic information
		const formattedProperties = data.results.map((property: any) => {
			// Format price with currency
			const formattedPrice = property.price 
				? `R${Number(property.price).toLocaleString()}`
				: "Price on application";
				
			// Get the first image from meta.listing_images or fallback to others
			let imageUrl = "/house1.jpeg"; // Default fallback image
			
			// Check for images in meta.listing_images (primary source)
			if (property.meta?.listing_images && property.meta.listing_images.length > 0) {
				// Get the file URL from the first image in meta.listing_images
				if (property.meta.listing_images[0].file && property.meta.listing_images[0].file.trim() !== "") {
					imageUrl = property.meta.listing_images[0].file;
				}
			} 
			// Fallback to listing_images if meta is not available or has no images
			else if (property.listing_images && property.listing_images.length > 0) {
				// If listing_images contains objects with URLs
				if (typeof property.listing_images[0] === 'object') {
					// If there's a URL property in the first listing image, use it
					if (property.listing_images[0].url && property.listing_images[0].url.trim() !== "") {
						imageUrl = property.listing_images[0].url;
					} 
					// If there's an image_url property, use that instead
					else if (property.listing_images[0].image_url && property.listing_images[0].image_url.trim() !== "") {
						imageUrl = property.listing_images[0].image_url;
					}
					// Check if there's a different property like image or src
					else {
						// Find any property that might contain an image URL
						const possibleImageProps = Object.entries(property.listing_images[0])
							.find(([key, value]) => 
								typeof value === 'string' && 
                                value.trim() !== "" &&
								(key.includes('image') || key.includes('url') || key.includes('src'))
							);
						
						if (possibleImageProps) {
							imageUrl = possibleImageProps[1] as string;
						}
					}
				}
				// If listing_images contains numeric IDs, use fallback image
				else if (typeof property.listing_images[0] === 'number') {
					// Previous pattern was incorrect based on 404 errors
					imageUrl = "/house1.jpeg";  // Use fallback image instead
				}
			} 
			// If no listing images, try header images
			else if (property.header_images && property.header_images.length > 0) {
				// If there's a URL property in the first header image, use it
				if (property.header_images[0].url && property.header_images[0].url.trim() !== "") {
					imageUrl = property.header_images[0].url;
				}
				// If there's an image_url property, use that instead
				else if (property.header_images[0].image_url && property.header_images[0].image_url.trim() !== "") {
					imageUrl = property.header_images[0].image_url;
				}
				// Check if there's a different property like image or src
				else {
					// Find any property that might contain an image URL
					const possibleImageProps = Object.entries(property.header_images[0])
						.find(([key, value]) => 
							typeof value === 'string' && 
                            value.trim() !== "" &&
							(key.includes('image') || key.includes('url') || key.includes('src'))
						);
					
					if (possibleImageProps) {
						imageUrl = possibleImageProps[1] as string;
					}
				}
			}
			
			// Make sure we don't have an empty image URL
			if (!imageUrl || imageUrl.trim() === "") {
				imageUrl = "/house1.jpeg";
			}
			
			// Create title for the property
			let initialLocationName = 'Unknown Location';
			const title = property.marketing_heading && property.marketing_heading.trim() !== ""
				? property.marketing_heading
				: property.heading
					? property.heading
					: property.property_type 
						? `${property.property_type} in ${initialLocationName}`
						: `Property in ${initialLocationName}`;
				
			return {
				id: property.id,
				image: imageUrl,
				title: title,
				price: formattedPrice,
				beds: Number(property.bedrooms) || 0,
				baths: Number(property.bathrooms) || 0,
				size: property.floor_size ? Number(property.floor_size) : 0,
				reference: property.web_ref || "",
				// Include full description or truncate it for cards
				description: params.include_full_description 
					? property.description || ""
					: property.description 
						? (property.description.length > 150 ? property.description.substring(0, 150) + "..." : property.description)
						: "",
				propertyType: property.property_type || "",
				propertyId: property.residential || property.id,
				// Store raw location ID for lookup
				location: property.location,
				// Add site information for company identification
				site: property.site
			};
		});
		
		// Enhance properties with location data
		const propertiesWithLocations = await get_locations_for_properties(formattedProperties);
		
		return propertiesWithLocations;
	} catch (error) {
		console.error("Error fetching formatted properties:", error);
		return []; // Return empty array if there's an error
	}
}

/**
 * Check if environment variables are set correctly
 */
export async function check_env_vars() {
	return {
		api_base_url_set: !!process.env.PROPDATA_API_BASE_URL,
		api_username_set: !!process.env.PROPDATA_API_USERNAME,
		api_password_set: !!process.env.PROPDATA_API_PASSWORD,
		api_base_url_preview: process.env.PROPDATA_API_BASE_URL,
		api_username_preview: process.env.PROPDATA_API_USERNAME,
		api_password_preview: process.env.PROPDATA_API_PASSWORD,
	};
}

/**
 * Get residential property listings
 */
export async function get_residential_listings(params: {
	limit?: number;
	offset?: number;
	order_by?: string;
	location?: string;
	search?: string; // Text search parameter for when we can't use location ID
	property_type?: string;
	min_price?: number;
	max_price?: number;
	bedrooms?: number;
	company?: string; // Filter by company/agency name
	site?: number; // Filter by site ID
	branch?: number; // Filter by branch ID
	listing_type?: string; // Filter by listing type ("For Sale" or "To Let")
} = {}) {
	try {
		// Build query string from parameters
		const queryParams = new URLSearchParams();
		
		// Use the API's pagination parameters
		if (params.limit) queryParams.append("limit", params.limit.toString());
		if (params.offset) queryParams.append("offset", params.offset.toString());
		if (params.order_by) queryParams.append("order_by", params.order_by);
		
		// Handle text search parameter (location names, suburbs, etc.)
		if (params.search) {
			console.log(`API filtering by text search: "${params.search}"`);
			queryParams.append("search", params.search);
		}
		
		// Additional filter parameters
		if (params.location) {
			// Convert location to number if it's a string containing only digits
			const locationId = typeof params.location === 'string' && /^\d+$/.test(params.location) 
			  ? parseInt(params.location, 10) 
			  : params.location;
			
			console.log(`API filtering by location ID: ${locationId}`);
			
			// Try different possible API parameter names for location
			queryParams.append("location", locationId.toString());
			queryParams.append("location_id", locationId.toString());
			queryParams.append("area", locationId.toString());
			
			// Enhanced logging
			console.log(`Location filter details:
			- Location ID: ${locationId}
			- Type: ${typeof locationId}
			- Attempting multiple parameter names: location, location_id, area`);
		}
		if (params.property_type) queryParams.append("property_type", params.property_type);
		if (params.min_price) queryParams.append("min_price", params.min_price.toString());
		if (params.max_price) queryParams.append("max_price", params.max_price.toString());
		if (params.bedrooms) queryParams.append("bedrooms", params.bedrooms.toString());
		
		// Company/agency filters
		if (params.company) queryParams.append("company", params.company);
		if (params.site) queryParams.append("site", params.site.toString());
		if (params.branch) queryParams.append("branch", params.branch.toString());
		
		// Listing type filter (For Sale or To Let)
		if (params.listing_type) queryParams.append("listing_type", params.listing_type);
		
		const queryString = queryParams.toString();
		
		// Get all fields plus metadata for images
		const endpoint = `/mashup/api/v1/residential/?meta_fields=listing_images,agent${queryString ? `&${queryString}` : ""}`;
		
		// Debug logging for API request
		console.log("Making API request with filters:", {
			location: params.location,
			search: params.search,
			property_type: params.property_type,
			min_price: params.min_price,
			max_price: params.max_price,
			bedrooms: params.bedrooms,
			site: params.site,
			listing_type: params.listing_type,
			endpoint: endpoint
		});
		
		const response = await fetch_with_auth(endpoint);
		
		if (!response.ok) {
			console.error(`API error: ${response.status} ${response.statusText}`);
			const errorText = await response.text();
			throw new Error(`Failed to fetch listings: ${response.status} ${response.statusText}. Details: ${errorText}`);
		}
		
		const data = await response.json();
		
		// If location filtering was requested, ALWAYS do client-side filtering
		// This ensures we only return properties with the matching location ID
		if (params.location) {
			console.log(`==== LOCATION FILTERING DIAGNOSTICS ====`);
			console.log(`Applying client-side location filtering for ID: ${params.location}`);
			console.log(`Before filtering: ${data.results.length} properties`);
			
			// Extract the location ID we're filtering for
			const targetLocationId = typeof params.location === 'string' ? params.location : String(params.location);
			
			console.log(`Target location ID for filtering: ${targetLocationId}`);
			
			// Dump the first few properties' location IDs for debugging
			console.log("Sample property locations (first 5):");
			data.results.slice(0, 5).forEach((property: any, index: number) => {
				console.log(`Property ${index + 1} - Location:`, property.location, 
					"Type:", typeof property.location);
			});
			
			// Filter the results to only include properties with matching location
			const filteredResults = data.results.filter((property: any) => {
				// Handle different possible formats of the location field
				let propertyLocationId;
				
				if (typeof property.location === 'object' && property.location !== null) {
					// If location is an object, try to get the ID from it
					propertyLocationId = property.location.id?.toString();
				} else if (property.location !== null && property.location !== undefined) {
					// If it's a primitive value, convert to string
					propertyLocationId = property.location.toString();
				} else {
					// If location is null/undefined, it can't match
					return false;
				}
				
				// Check if the property's location matches our target
				const isMatch = propertyLocationId === targetLocationId;
				
				// For debugging, log some sample matches/non-matches
				if (Math.random() < 0.1) { // Only log ~10% to avoid overwhelming the console
					console.log(`Property location check: ${propertyLocationId} vs target ${targetLocationId} => ${isMatch ? 'MATCH' : 'NO MATCH'}`);
				}
				
				return isMatch;
			});
			
			console.log(`After filtering: ${filteredResults.length} properties match location ${targetLocationId}`);
			console.log(`==== END LOCATION FILTERING DIAGNOSTICS ====`);
			
			// Replace results with filtered results
			data.results = filteredResults;
			data.count = filteredResults.length;
		}
		
		return data;
	} catch (error) {
		console.error("Error fetching residential listings:", error);
		throw error;
	}
}

/**
 * Get property listing details with metadata
 */
export async function get_listing_details(listing_id: string) {
	try {
		// Use the new listings API endpoint as documented
		const endpoint = `/listings/api/v1/residential/${listing_id}/`;
		
		const response = await fetch_with_auth(endpoint);
		
		if (response.ok) {
			const data = await response.json();
			
			// Process the API response
			
			// Create an array of image URLs that can be used by the frontend
			const imageUrls = [];
			
			// Check for various image locations in the API response
			if (data.meta?.listing_images?.length > 0) {
				// Extract URLs from meta.listing_images
				const metaUrls = data.meta.listing_images
					.map((img: any) => {
						if (typeof img === 'object' && img !== null) {
							if (img.file && img.file.trim() !== "") return img.file;
							if (img.url && img.url.trim() !== "") return img.url;
							
							// Look for other possible URL fields
							for (const [key, value] of Object.entries(img)) {
								if (typeof value === 'string' && value.trim() !== "" && 
									(key.includes('url') || key.includes('file') || key.includes('image'))) {
									return value;
								}
							}
						}
						return null;
					})
					.filter(Boolean);
					
				if (metaUrls.length > 0) {
					imageUrls.push(...metaUrls);
				}
			}
			
			// If we have listing_images as numeric IDs, try to construct URLs based on common patterns
			if (data.listing_images?.length > 0 && typeof data.listing_images[0] === 'number') {
				
				// Try patterns based on previously observed successful URLs
				// First try a pattern that worked in previous examples
				const constructedUrls = data.listing_images.map((id: number) => {
					// Based on the error logs, our previous pattern was incorrect
					// Using a pattern that matches previously seen successful URLs
					return `/house1.jpeg`;  // Fallback to local image since we don't know the correct pattern
				});
				
				imageUrls.push(...constructedUrls);
				
				// Since we're having trouble constructing URLs, always include at least one fallback
				if (!imageUrls.includes('/house1.jpeg')) {
					imageUrls.push('/house1.jpeg');
				}
			}
			// If we have listing_images as objects, extract URLs from them
			else if (data.listing_images?.length > 0 && typeof data.listing_images[0] === 'object') {
				
				const objectUrls = data.listing_images
					.map((img: any) => {
						if (typeof img === 'object' && img !== null) {
							if (img.file && img.file.trim() !== "") return img.file;
							if (img.url && img.url.trim() !== "") return img.url;
							if (img.image_url && img.image_url.trim() !== "") return img.image_url;
							
							// Look for other possible URL fields
							for (const [key, value] of Object.entries(img)) {
								if (typeof value === 'string' && value.trim() !== "" && 
									(key.includes('url') || key.includes('file') || key.includes('image'))) {
									return value;
								}
							}
						}
						return null;
					})
					.filter(Boolean);
					
				if (objectUrls.length > 0) {
					imageUrls.push(...objectUrls);
				}
			}
			
			// Always ensure we have at least one fallback image
			if (imageUrls.length === 0 || !imageUrls.some(url => url && url.trim() !== "")) {
				imageUrls.push('/house1.jpeg');
			}
			
			// Add processed image URLs to the data
			data.processed_image_urls = imageUrls.filter(url => url && url.trim() !== "");
			
			return data;
		}
		
		// If the direct endpoint fails, we'll throw an error
		throw new Error(`Failed to fetch listing details: ${response.status} ${response.statusText}`);
	} catch (error) {
		console.error(`Error fetching listing details for ID ${listing_id}:`, error);
		throw error;
	}
}

/**
 * Test location data from properties - to validate if location field is an ID or object
 */
export async function test_location_data() {
	try {
		// Get 5 properties to check their location data
		const data = await get_residential_listings({
			limit: 5,
			order_by: "-created" // Most recent first
		});
		
		// Extract location data from properties
		const locationData = data.results.map((property: any) => {
			return {
				propertyId: property.id,
				rawLocation: property.location, // Could be an ID or object
				locationType: typeof property.location, // Check data type
				locationValue: property.location // Raw value for inspection
			};
		});
		
		// Try to fetch location details for the first property
		// This will help us determine if location is an ID
		let locationDetails = null;
		if (locationData.length > 0 && 
			typeof locationData[0].rawLocation === 'number' || 
			(typeof locationData[0].rawLocation === 'string' && !isNaN(Number(locationData[0].rawLocation)))) {
			
			// Convert to number if it's a numeric string
			const locationId = typeof locationData[0].rawLocation === 'string' 
				? Number(locationData[0].rawLocation) 
				: locationData[0].rawLocation;
			
			// Fetch location details from locations API
			try {
				const response = await fetch_with_auth(`/locations/api/v1/locations/${locationId}/`);
				
				if (response.ok) {
					locationDetails = await response.json();
				} else {
					locationDetails = { error: `Failed to fetch location: ${response.status} ${response.statusText}` };
				}
			} catch (error) {
				locationDetails = { error: `Error fetching location: ${error}` };
			}
		}
		
		// Fetch all locations (limited to first 20) for reference
		let allLocations = null;
		try {
			const response = await fetch_with_auth('/locations/api/v1/locations/?limit=20');
			
			if (response.ok) {
				allLocations = await response.json();
			} else {
				allLocations = { error: `Failed to fetch locations: ${response.status} ${response.statusText}` };
			}
		} catch (error) {
			allLocations = { error: `Error fetching locations: ${error}` };
		}
		
		return {
			success: true,
			message: "Property location data for analysis",
			property_count: data.results.length,
			location_data: locationData,
			location_details: locationDetails,
			all_locations_sample: allLocations
		};
	} catch (error) {
		console.error("test_location_data error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error"
		};
	}
}

/**
 * Fetch location details by location ID
 */
export async function get_location_by_id(locationId: number | string) {
	try {
		// Convert to number if it's a string
		const id = typeof locationId === 'string' ? Number(locationId) : locationId;
		
		const response = await fetch_with_auth(`/locations/api/v1/locations/${id}/`);
		
		if (!response.ok) {
			console.error(`Failed to fetch location with ID ${id}: ${response.status} ${response.statusText}`);
			return null;
		}
		
		return await response.json();
	} catch (error) {
		console.error(`Error fetching location with ID ${locationId}:`, error);
		return null;
	}
}

// Import shared location cache and preload function
import { getLocationCache, preloadCommonLocations } from './preload-data';

// In-memory cache for location suggestions for faster autocomplete
const locationSuggestionsCache: Record<string, any[]> = {};

/**
 * Fetch locations for multiple properties in a batch
 * This reduces the number of API calls when displaying multiple properties
 */
export async function get_locations_for_properties(properties: any[]) {
	try {
		// Try to preload common locations first
		// This only happens once per app session
		await preloadCommonLocations();
		
		// Get the location cache
		const locationCache = await getLocationCache();
		
		// Extract unique location IDs from properties
		const locationIds = [...new Set(properties
			.map(prop => prop.location)
			.filter(loc => loc && (typeof loc === 'number' || (typeof loc === 'string' && !isNaN(Number(loc)))))
		)];
		
		// Check which locations we need to fetch (not already in cache)
		const idsToFetch = locationIds.filter(id => !locationCache[id]);
		
		// If we have IDs to fetch, make batch requests
		if (idsToFetch.length > 0) {
			console.log(`Fetching ${idsToFetch.length} locations not in cache`);
			// Currently the API doesn't support bulk fetching locations by ID
			// We'll fetch them individually but in parallel for better performance
			const locationPromises = idsToFetch.map(id => get_location_by_id(id));
			const locationResults = await Promise.all(locationPromises);
			
			// Add results to cache
			idsToFetch.forEach((id, index) => {
				if (locationResults[index]) {
					locationCache[id] = locationResults[index];
				}
			});
		} else {
			console.log('All locations found in cache - no API calls needed');
		}
		
		// Return enhanced properties with location details from shared cache
		return properties.map(property => {
			const locationId = property.location;
			let locationDetail = null;
			
			if (locationId && locationCache[locationId]) {
				locationDetail = locationCache[locationId];
			}
			
			// Add formatted location string
			let locationString = 'South Africa'; // Default fallback
			if (locationDetail) {
				// Combine area and suburb for a more specific location
				if (locationDetail.area && locationDetail.suburb) {
					locationString = `${locationDetail.suburb}, ${locationDetail.area}`;
				} else if (locationDetail.area) {
					locationString = locationDetail.area;
				} else if (locationDetail.suburb) {
					locationString = locationDetail.suburb;
				} else if (locationDetail.province) {
					locationString = locationDetail.province;
				}
			} else if (typeof property.location === 'string' && isNaN(Number(property.location))) {
				// If location is already a string and not a numeric ID, use it directly
				locationString = property.location;
			}
			
			return {
				...property,
				locationDetail,
				locationString
			};
		});
	} catch (error) {
		console.error("Error fetching locations for properties:", error);
		// If there's an error, provide a basic fallback for location
		return properties.map(prop => ({
			...prop,
			locationString: typeof prop.location === 'string' && isNaN(Number(prop.location)) 
				? prop.location 
				: 'South Africa'
		}));
	}
}