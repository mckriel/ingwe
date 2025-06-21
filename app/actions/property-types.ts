"use server";

export interface PropertyType {
  id: number;
  name: string;
  display_name?: string;
}

const property_types: PropertyType[] = [
  { id: 1, name: "House", display_name: "House" },
  { id: 2, name: "Apartment", display_name: "Apartment" },
  { id: 3, name: "Townhouse", display_name: "Townhouse" }
];

export async function get_property_types(): Promise<PropertyType[]> {
  return property_types;
}