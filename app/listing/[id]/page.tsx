"use client";

import Image from "next/image";
import PropertyHeader from "@/app/ui/component/listing/property-header";
import PropertyGallery from "@/app/ui/component/listing/property-gallery";
import PropertyQuickStats from "@/app/ui/component/listing/property-quick-stats";
import PropertyDescription from "@/app/ui/component/listing/property-description";
import PropertyFeatures from "@/app/ui/component/listing/property-features";
import PropertySidePanel from "@/app/ui/component/listing/property-side-panel";

const property = {
id: "123",
title: "Spacious Family Home in Hillcrest",
location: "Hillcrest, South Africa",
price: 12950000,
images: [
    "/house1.jpeg",
    "/house1.jpeg",
    "/house1.jpeg",
    "/house1.jpeg",
    "/house1.jpeg",
],
beds: 4,
baths: 3,
size: 1780,
description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse interdum magna vitae est dapibus, vel ultricies leo varius. Quisque feugiat, ligula eu ullamcorper pharetra, nisi arcu tincidunt justo, et fermentum massa dui id risus. Proin scelerisque nisl a sapien pellentesque, vel commodo sapien suscipit.",
features: ["Air Conditioning", "Swimming Pool", "Garden", "Security Estate"],
agent: {
    name: "Noeleen Naidoo",
    image: "/agent.jpg",
    contact: "noeleen@realestate.co.za",
},
};

export default function Page() {
    return (
      <main className="max-w-screen-xl mx-auto p-4 text-left">
        {/* Header */}
        <PropertyHeader title={property.title} location={property.location} />
  
        {/* Gallery */}
        <PropertyGallery images={property.images} title={property.title} />
  
        {/* Quick Stats */}
        <PropertyQuickStats beds={property.beds} baths={property.baths} size={property.size} />
  
        {/* Description */}
        <PropertyDescription description={property.description} />
  
        {/* Features */}
        <PropertyFeatures features={property.features} />
  
        {/* Side Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Other main content could go here */}
          </div>
          <div>
            <PropertySidePanel price={property.price} agent={property.agent} />
          </div>
        </div>
      </main>
    );
}