"use server";

// Define a type for property types
export interface PropertyType {
  id: number;
  name: string;
  display_name?: string;
}

// Hard-coded property types - only the three specified types
const property_types: PropertyType[] = [
  { id: 1, name: "House", display_name: "House" },
  { id: 2, name: "Apartment", display_name: "Apartment" },
  { id: 3, name: "Townhouse", display_name: "Townhouse" }
];

/**
 * Get property types for the UI
 * Returns hard-coded property types
 */
export async function get_property_types(): Promise<PropertyType[]> {
  return property_types;
}

/**
 * Get fallback property types
 * Since we're using hard-coded values, this is the same as get_property_types
 */
export async function get_fallback_property_types(): Promise<PropertyType[]> {
  return property_types;
}

/**
 * Get property types - never returns an empty array
 * With hard-coded values, this is the same as get_property_types
 */
export async function get_safe_property_types(): Promise<PropertyType[]> {
  return property_types;
}

/**
 * This function is kept for backward compatibility but now just returns
 * the hard-coded property types without making any API calls
 */
export async function fetch_property_types(): Promise<PropertyType[]> {
  return property_types;
}