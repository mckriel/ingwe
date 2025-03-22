'use client';

import { useState } from "react";
import PropertyFilterBar from "./ui/component/property-filter-bar";
import PropertyListingGrid from "./ui/component/property-listing-grid";

interface Property {
    id: number;
    image: string;
    title: string;
    price: string;
    beds: number;
    baths: number;
    size: number;
}

export default function Page() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-start pt-8">
          <p>INGE HOME PAGE</p>
        </div>
    );
}
