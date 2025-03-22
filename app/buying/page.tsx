'use client';

import PropertyListingGrid from "@/app/ui/component/property-listing-grid";
import PropertyFilterBar from "../ui/component/property-filter-bar";

export default function Page() {
    return (
        <>
            <PropertyFilterBar />
            <PropertyListingGrid />
        </>
    );
}
