"use server";

import { fetch_with_auth } from "../../services/api/auth";
import { getLocationCache, preloadCommonLocations } from './preload-data';

async function get_image_url(image_id: number): Promise<string | null> {
	if (!image_id || image_id <= 0) return null;
	
	try {
		const response = await fetch_with_auth(`/media/api/v1/images/${image_id}/`);
		if (response.ok) {
			const image_data = await response.json();
			return image_data.file || image_data.url || image_data.image_url || null;
		}
	} catch (error) {
		// Silently fail for image fetch
	}
	return null;
}

export async function get_agent_details(agent_id: number) {
	const endpoint = `/users/api/v1/agents/${agent_id}/?meta_fields=image,profile_image,avatar`;
	
	try {
		const response = await fetch_with_auth(endpoint, {
			next: { revalidate: 600 } // Cache for 10 minutes (agents change less frequently)
		});
		
		if (!response.ok) {
			return null;
		}
		
		const agent_data = await response.json();
		
		
		// Try to get agent image from various sources
		let image_url = null;
		
		// Check meta fields first
		if (agent_data.meta?.image) {
			if (typeof agent_data.meta.image === 'string') {
				image_url = agent_data.meta.image;
			} else if (typeof agent_data.meta.image === 'object' && agent_data.meta.image.file) {
				image_url = agent_data.meta.image.file;
			}
		}
		
		// Fallback to direct image field
		if (!image_url && agent_data.image) {
			if (typeof agent_data.image === 'string') {
				image_url = agent_data.image;
			} else if (typeof agent_data.image === 'number') {
				// Try different approaches for agent images
				// First try the media API
				image_url = await get_image_url(agent_data.image);
				
				// If that fails, agent images are not accessible through current API endpoints
				if (!image_url) {
					// Will be updated once support provides the correct endpoint
					image_url = null;
				}
			}
		}
		
		if (image_url) {
			agent_data.image_url = image_url;
		}
		
		return agent_data;
	} catch (error) {
		return null;
	}
}

export async function get_residential_listings(params: {
	limit?: number;
	offset?: number;
	order_by?: string;
	location?: string;
	search?: string;
	property_type?: string;
	min_price?: number;
	max_price?: number;
	bedrooms?: number;
	bathrooms?: number;
	company?: string;
	site?: number;
	branch?: number;
	listing_type?: string;
	agent?: number;
} = {}) {
	
	const queryParams = new URLSearchParams();
	
	if (params.limit) queryParams.append("limit", params.limit.toString());
	if (params.offset) queryParams.append("offset", params.offset.toString());
	if (params.order_by) queryParams.append("order_by", params.order_by);
	if (params.search) queryParams.append("search", params.search);
	if (params.location) {
		const locationId = typeof params.location === 'string' && /^\d+$/.test(params.location) 
		  ? parseInt(params.location, 10) 
		  : params.location;
		queryParams.append("location", locationId.toString());
	}
	if (params.property_type) {
		queryParams.append("property_type", params.property_type);
	}
	// Note: min_price and max_price are not supported by the API, we'll filter client-side
	// if (params.min_price) {
	//	 console.log("💰 Adding min_price to query:", params.min_price);
	//	 queryParams.append("min_price", params.min_price.toString());
	// }
	// if (params.max_price) {
	//	 console.log("💰 Adding max_price to query:", params.max_price);
	//	 queryParams.append("max_price", params.max_price.toString());
	// }
	if (params.bedrooms) queryParams.append("bedrooms", params.bedrooms.toString());
	if (params.company) queryParams.append("company", params.company);
	if (params.site) queryParams.append("site", params.site.toString());
	if (params.branch) queryParams.append("branch", params.branch.toString());
	if (params.listing_type) queryParams.append("listing_type", params.listing_type);
	if (params.agent) {
		queryParams.append("agent", params.agent.toString());
	}
	
	const queryString = queryParams.toString();
	const metaFields = "listing_images,suburb,agent,branch";
	const statusFilter = "status__in=Active";
	const additionalParams = queryString ? `&${queryString}&${statusFilter}` : `?${statusFilter}`;
	const endpoint = `/mashup/api/v1/residential/?meta_fields=${metaFields}${additionalParams}`;
	
	const response = await fetch_with_auth(endpoint, {
		cache: 'no-store' // Disable caching to ensure fresh results for each search
	});
	
	if (!response.ok) {
		throw new Error(`Failed to fetch listings: ${response.status} ${response.statusText}`);
	}
	
	const data = await response.json();

	// Client-side filtering since API doesn't support all filters properly
	const needsFiltering = params.min_price || params.max_price || params.bedrooms || params.bathrooms || params.property_type;
	
	if (needsFiltering) {
		
		data.results = data.results.filter((property: any) => {
			// Price filtering
			if (params.min_price || params.max_price) {
				let propertyPrice = 0;
				if (property.price) {
					// Parse as float to handle decimal places correctly, then convert to integer
					propertyPrice = Math.floor(parseFloat(property.price.toString())) || 0;
				}
				
				// Apply min price filter
				if (params.min_price && propertyPrice < params.min_price) {
					return false;
				}
				
				// Apply max price filter
				if (params.max_price && propertyPrice > params.max_price) {
					return false;
				}
			}
			
			// Bedroom filtering
			if (params.bedrooms) {
				let propertyBedrooms = 0;
				if (property.bedrooms) {
					propertyBedrooms = parseInt(property.bedrooms.toString()) || 0;
				}
				
				if (propertyBedrooms < params.bedrooms) {
					return false;
				}
			}
			
			// Bathroom filtering
			if (params.bathrooms) {
				let propertyBathrooms = 0;
				if (property.bathrooms) {
					propertyBathrooms = parseInt(property.bathrooms.toString()) || 0;
				}
				
				if (propertyBathrooms < params.bathrooms) {
					return false;
				}
			}
			
			// Property type filtering
			if (params.property_type) {
				const propertyType = property.property_type || property.propertyType || "";
				
				// Case-insensitive comparison and handle variations
				const normalizedPropertyType = propertyType.toLowerCase().trim();
				const normalizedRequiredType = params.property_type.toLowerCase().trim();
				
				if (normalizedPropertyType !== normalizedRequiredType) {
					return false;
				}
			}
			
			return true;
		});
		
		data.count = data.results.length;
	}

	if (params.location) {
		const targetLocationId = typeof params.location === 'string' ? params.location : String(params.location);
		const filteredResults = data.results.filter((property: any) => {
			let propertyLocationId;
			if (typeof property.location === 'object' && property.location !== null) {
				propertyLocationId = property.location.id?.toString();
			} else if (property.location !== null && property.location !== undefined) {
				propertyLocationId = property.location.toString();
			} else {
				return false;
			}
			return propertyLocationId === targetLocationId;
		});
		data.results = filteredResults;
		data.count = filteredResults.length;
	}
	
	return data;
}

export async function get_listing_details(listing_id: string) {
	const metaFields = "listing_images,suburb,agent,branch";
	const statusFilter = "status__in=Active";
	const endpoint = `/mashup/api/v1/residential/${listing_id}/?meta_fields=${metaFields}&${statusFilter}`;

	const response = await fetch_with_auth(endpoint, {
		next: { revalidate: 300 } // Cache for 5 minutes
	});

	if (response.ok) {
		const data = await response.json();
		const imageUrls = [];
		
		if (data.meta?.listing_images?.length > 0) {
			const metaUrls = data.meta.listing_images
				.map((img: any) => {
					if (typeof img === 'object' && img !== null) {
						if (img.file && img.file.trim() !== "") return img.file;
						if (img.url && img.url.trim() !== "") return img.url;
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
		
		if (data.listing_images?.length > 0 && typeof data.listing_images[0] === 'object') {
			const objectUrls = data.listing_images
				.map((img: any) => {
					if (typeof img === 'object' && img !== null) {
						if (img.file && img.file.trim() !== "") return img.file;
						if (img.url && img.url.trim() !== "") return img.url;
						if (img.image_url && img.image_url.trim() !== "") return img.image_url;
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
		
		data.processed_image_urls = imageUrls.filter(url => url && url.trim() !== "" && !url.includes('/house1.jpeg'));
		return data;
	}
	
	throw new Error(`Failed to fetch listing details: ${response.status} ${response.statusText}`);
}

export async function get_location_by_id(locationId: number | string) {
	const id = typeof locationId === 'string' ? Number(locationId) : locationId;
	const response = await fetch_with_auth(`/locations/api/v1/locations/${id}/`);
	
	if (!response.ok) {
		return null;
	}
	
	return await response.json();
}

async function get_locations_for_properties(properties: any[]) {
	await preloadCommonLocations();
	const locationCache = await getLocationCache();
	
	const locationIds = [...new Set(properties
		.map(prop => prop.location)
		.filter(loc => loc && (typeof loc === 'number' || (typeof loc === 'string' && !isNaN(Number(loc)))))
	)];
	
	const idsToFetch = locationIds.filter(id => !locationCache[id]);
	
	if (idsToFetch.length > 0) {
		const locationResults = await Promise.all(idsToFetch.map(id => get_location_by_id(id)));
		idsToFetch.forEach((id, index) => {
			if (locationResults[index]) {
				locationCache[id] = locationResults[index];
			}
		});
	}
	
	return properties.map(property => {
		const locationId = property.location;
		let locationDetail = null;
		
		if (locationId && locationCache[locationId]) {
			locationDetail = locationCache[locationId];
		}
		
		let locationString = 'South Africa';
		if (locationDetail) {
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
			locationString = property.location;
		}
		
		return {
			...property,
			locationDetail,
			locationString
		};
	});
}

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
	bathrooms?: number;
	include_full_description?: boolean;
	company?: string;
	site?: number;
	branch?: number;
	listing_type?: string;
	agent?: number;
} = {}) {
	const limit = params.limit || 12;
	let data;
	
	if (params.location) {
		data = await get_residential_listings({
			limit: limit,
			offset: params.offset,
			order_by: "-created",
			location: params.location,
			property_type: params.property_type,
			min_price: params.min_price,
			max_price: params.max_price,
			bedrooms: params.bedrooms,
			bathrooms: params.bathrooms,
			company: params.company,
			site: params.site,
			branch: params.branch,
			listing_type: params.listing_type,
			agent: params.agent
		});
		
		if (data.results.length === 0 && params.location_display) {
			data = await get_residential_listings({
				limit: limit,
				offset: params.offset,
				order_by: "-created",
				search: params.location_display,
				property_type: params.property_type,
				min_price: params.min_price,
				max_price: params.max_price,
				bedrooms: params.bedrooms,
				bathrooms: params.bathrooms,
				company: params.company,
				site: params.site,
				branch: params.branch,
				listing_type: params.listing_type,
				agent: params.agent
			});
			
			if (data.results.length === 0) {
				let searchTerm = "";
				if (params.location_suburb) {
					searchTerm = params.location_suburb;
				} else if (params.location_area) {
					searchTerm = params.location_area;
				} else if (params.location_province) {
					searchTerm = params.location_province;
				}
				
				if (searchTerm) {
					data = await get_residential_listings({
						limit: limit,
						offset: params.offset,
						order_by: "-created",
						search: searchTerm,
						property_type: params.property_type,
						min_price: params.min_price,
						max_price: params.max_price,
						bedrooms: params.bedrooms,
						bathrooms: params.bathrooms,
						company: params.company,
						site: params.site,
						branch: params.branch,
						listing_type: params.listing_type,
						agent: params.agent
					});
				}
			}
		}
	} else {
		data = await get_residential_listings({
			limit: limit,
			offset: params.offset,
			order_by: "-created",
			property_type: params.property_type,
			min_price: params.min_price,
			max_price: params.max_price,
			bedrooms: params.bedrooms,
			bathrooms: params.bathrooms,
			company: params.company,
			site: params.site,
			branch: params.branch,
			listing_type: params.listing_type,
			agent: params.agent
		});
	}
	
	const formattedProperties = data.results.map((property: any) => {
		const formattedPrice = property.price 
			? `R${Number(property.price).toLocaleString()}`
			: "Price on application";
		
		let imageUrl = "";
		
		if (property.meta?.listing_images && property.meta.listing_images.length > 0) {
			if (property.meta.listing_images[0].file && property.meta.listing_images[0].file.trim() !== "") {
				imageUrl = property.meta.listing_images[0].file;
			}
		} else if (property.listing_images && property.listing_images.length > 0) {
			if (typeof property.listing_images[0] === 'object') {
				if (property.listing_images[0].url && property.listing_images[0].url.trim() !== "") {
					imageUrl = property.listing_images[0].url;
				} else if (property.listing_images[0].image_url && property.listing_images[0].image_url.trim() !== "") {
					imageUrl = property.listing_images[0].image_url;
				} else {
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
		} else if (property.header_images && property.header_images.length > 0) {
			if (property.header_images[0].url && property.header_images[0].url.trim() !== "") {
				imageUrl = property.header_images[0].url;
			} else if (property.header_images[0].image_url && property.header_images[0].image_url.trim() !== "") {
				imageUrl = property.header_images[0].image_url;
			} else {
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
		
		if (!imageUrl || imageUrl.trim() === "" || imageUrl.includes('/house1.jpeg')) {
			imageUrl = "";
		}
		
		const initialLocationName = 'Unknown Location';
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
			description: params.include_full_description 
				? property.description || ""
				: property.description 
					? (property.description.length > 150 ? property.description.substring(0, 150) + "..." : property.description)
					: "",
			propertyType: property.listing_type || property.property_type || "", // Include listing_type for rental detection
			propertyId: property.residential || property.id,
			location: property.location,
			site: property.site
		};
	});
	
	const propertiesWithLocations = await get_locations_for_properties(formattedProperties);
	return propertiesWithLocations;
}


export async function get_agents(params: {
	limit?: number;
	offset?: number;
	order_by?: string;
	site?: number;
} = {}) {
	const queryParams = new URLSearchParams();
	
	if (params.limit) queryParams.append("limit", params.limit.toString());
	if (params.offset) queryParams.append("offset", params.offset.toString());
	if (params.order_by) queryParams.append("order_by", params.order_by);
	if (params.site) queryParams.append("site", params.site.toString());
	
	const queryString = queryParams.toString();
	const metaFields = "image,profile_image,avatar";
	const endpoint = `/users/api/v1/agents/${queryString ? `?${queryString}&meta_fields=${metaFields}` : `?meta_fields=${metaFields}`}`;
	
	try {
		const response = await fetch_with_auth(endpoint, {
			next: { revalidate: 600 } // Cache for 10 minutes (agents change less frequently)
		});
		
		if (!response.ok) {
			throw new Error(`Failed to fetch agents: ${response.status} ${response.statusText}`);
		}
		
		const data = await response.json();
		
		// Format the agents data and filter for those with active listings
		const formatted_agents = await Promise.all(data.results.map(async (agent: any) => {
			let image_url = null;
			
			// Try to get agent image if available
			if (agent.image && typeof agent.image === 'number') {
				image_url = await get_image_url(agent.image);
			}
			
			// Count agent's active listings for display
			let listings_count = 0;
			try {
				const listings_response = await fetch_with_auth(
					`/mashup/api/v1/residential/?agent=${agent.id}&status__in=Active&limit=1`
				);
				if (listings_response.ok) {
					const listings_data = await listings_response.json();
					listings_count = listings_data.count || 0;
				}
			} catch (error) {
				// Silently fail for listings count
			}
			
			return {
				id: agent.id,
				name: `${agent.first_name || ''} ${agent.last_name || ''}`.trim() || agent.username || 'Agent',
				image: image_url || null,
				listings_count: listings_count,
				email: agent.email,
				phone: agent.phone_number,
				branch: agent.branch
			};
		}));
		
		// Filter to only include agents with active listings
		const agents_with_listings = formatted_agents.filter(agent => agent.listings_count > 0);
		
		return {
			...data,
			results: agents_with_listings,
			count: agents_with_listings.length
		};
	} catch (error) {
		console.error('Error fetching agents:', error);
		throw error;
	}
}