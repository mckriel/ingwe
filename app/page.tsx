'use client';
import { useState } from 'react';
import Image from 'next/image';
import PropertyFilterBar from '@/app/ui/component/property-filter-bar';

export default function Page() {
    const [search_type, set_search_type] = useState('buying');
    const [filters, setFilters] = useState({});

    const handleSearch = () => {
        // Determine the listing type based on the selected search type
        const listing_type = search_type === 'buying' ? 'For Sale' : search_type === 'renting' ? 'To Let' : '';
        
        // Create search URL with filters
        const searchParams = new URLSearchParams();
        
        // Add filters to search params
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                searchParams.append(key, value.toString());
            }
        });
        
        // Add listing type based on selected tab
        if (listing_type) {
            searchParams.append('listing_type', listing_type);
        }
        
        // Add site filter for Ingwe properties
        searchParams.append('site', '217');
        
        // Navigate to appropriate page based on search type
        const targetPage = search_type === 'buying' ? '/buy' : search_type === 'renting' ? '/rent' : '/buy';
        window.location.href = `${targetPage}?${searchParams.toString()}`;
    };

    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
    };

    return (
        <div>
            {/* Logo Section - Main focal point */}
            <div className="container mx-auto px-8 py-12">
                <div className="flex justify-center">
                    <Image
                        src="/logo.png"
                        alt="Ingwe - The Property Company"
                        width={280}
                        height={280}
                    />
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative">
                <div className="container mx-auto px-8">
                    {/* Property Filter Bar with Navigation Tabs */}
                    <div className="max-w-6xl mx-auto mb-20">
                        <PropertyFilterBar
                            onSearch={handleSearch}
                            onFilterChange={handleFilterChange}
                            showNavigationTabs={true}
                            searchType={search_type}
                            onSearchTypeChange={set_search_type}
                        />
                    </div>
                </div>
            </section>

            {/* Company Heritage Section - home2.png */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <Image
                                src="/house1.jpeg"
                                alt="Modern white house"
                                width={600}
                                height={400}
                                className="rounded-2xl shadow-lg"
                            />
                        </div>
                        <div className="bg-[#B8C332] p-12 rounded-2xl">
                            <h2 className="text-white text-3xl font-bold mb-6">Real Estate Passion Since 1924</h2>
                            <h3 className="text-white text-xl font-medium mb-6">Explore all the Popular Places</h3>
                            <div className="grid grid-cols-3 gap-6 mb-8">
                                <div className="text-center">
                                    <p className="text-white text-2xl font-bold">300+</p>
                                    <p className="text-white text-sm">Google Reviews</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-white text-2xl font-bold">20+</p>
                                    <p className="text-white text-sm">Years Experience</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-white text-2xl font-bold">50+</p>
                                    <p className="text-white text-sm">Award Winning</p>
                                </div>
                            </div>
                            <p className="text-white text-sm leading-relaxed">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Meet Our People Section - home3.png */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Ingwe Agents - Meet Our People</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((agent) => (
                            <div key={agent} className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="h-64 bg-gray-200"></div>
                                <div className="p-6 text-center">
                                    <h3 className="text-xl font-medium text-gray-800 mb-2">Tim Smet</h3>
                                    <p className="text-gray-600">Agent</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Property Categories Section - home4.png */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Ingwe Properties - Affordable / Aspirational</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="h-64 bg-gray-200"></div>
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Affordable</h3>
                                <p className="text-gray-600">Find your perfect home within your budget with our affordable property options.</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="h-64 bg-gray-200"></div>
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Aspirational</h3>
                                <p className="text-gray-600">Discover luxury properties that represent the pinnacle of sophisticated living.</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-8 text-center">
                        <div className="w-20 h-20 bg-[#B8C332] rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl">▶</span>
                        </div>
                        <p className="text-gray-600">Watch our property showcase video</p>
                    </div>
                </div>
            </section>

            {/* Featured Listings Section - home5.png */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">On Show Sunday</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((property) => (
                            <div key={property} className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="h-48 bg-gray-200"></div>
                                <div className="p-6">
                                    <h3 className="text-xl font-medium text-gray-800 mb-2">Modern spacious freestanding home</h3>
                                    <p className="text-gray-600 text-sm mb-4">4 bed, 3 bath, 1780 sqft</p>
                                    <p className="text-2xl font-bold text-gray-800 mb-4">R12,000 per month</p>
                                    <button className="w-full bg-[#B8C332] text-white py-3 rounded-lg font-medium hover:bg-[#a6b02e] transition-colors">
                                        Contact Agent
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Location Showcase Section - home6.png */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Explore Kwazulu-Natal</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((image) => (
                            <div key={image} className="h-64 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section - home7.png */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">What Clients Have To Say</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((testimonial) => (
                            <div key={testimonial} className="bg-white p-8 rounded-xl shadow-lg">
                                <div className="text-[#B8C332] text-4xl mb-4">&ldquo;</div>
                                <p className="text-gray-600 mb-6">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                                <div>
                                    <p className="font-medium text-gray-800">Character Name</p>
                                    <p className="text-gray-600 text-sm">Company</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Agent Locations Section - home8.png */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-8">Ingwe Agents</h2>
                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            {[
                                'Umhlanga', 'La Lucia', 'La Mercy', 'Berea', 'Durban North',
                                'Ballito', 'Umdloti', 'Westville', 'Hillcrest', 'Kloof',
                                'Windermere', 'Bluff', 'Morning Side', 'Umlazi', 'Waterfall',
                                'Amanzimtoti', 'Pinetown'
                            ].map((location) => (
                                <span
                                    key={location}
                                    className="bg-[#B8C332] text-white px-6 py-2 rounded-full text-sm font-medium"
                                >
                                    {location}
                                </span>
                            ))}
                        </div>
                        <button className="bg-[#B8C332] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#a6b02e] transition-colors">
                            View All
                        </button>
                    </div>
                </div>
            </section>

            {/* News/Blog Section - home9.png */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Latest News</h2>
                    </div>
                    <div className="mb-8">
                        <div className="bg-gray-800 text-white p-8 rounded-xl relative">
                            <div className="absolute top-4 right-4 w-8 h-8 bg-[#B8C332] rounded-full flex items-center justify-center">
                                <span className="text-white">→</span>
                            </div>
                            <p className="text-sm mb-2">Noeleen Naidoo - Principal</p>
                            <h3 className="text-xl font-medium">Featured Article Title</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((article) => (
                            <div key={article} className="h-32 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}