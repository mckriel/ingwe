'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function Page() {
    const [search_type, set_search_type] = useState('buying');
    const [ingwe_premium, set_ingwe_premium] = useState(false);
    const [ingwe_affordable, set_ingwe_affordable] = useState(true);

    return (
        <div className="min-h-screen">
            {/* Hero Section - home1.png exact layout */}
            <section className="relative min-h-screen bg-gradient-to-b from-cyan-200 to-blue-300">
                {/* City skyline background */}
                <div className="absolute inset-0">
                    <div className="absolute bottom-0 left-0 right-0 h-80 bg-gray-400 opacity-40"
                         style={{
                             backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 300'%3E%3Crect width='1200' height='300' fill='%23888'/%3E%3Crect x='50' y='100' width='60' height='200' fill='%23666'/%3E%3Crect x='150' y='80' width='40' height='220' fill='%23777'/%3E%3Crect x='220' y='120' width='80' height='180' fill='%23555'/%3E%3Crect x='340' y='60' width='50' height='240' fill='%23666'/%3E%3Crect x='420' y='90' width='70' height='210' fill='%23777'/%3E%3Crect x='520' y='110' width='45' height='190' fill='%23555'/%3E%3Crect x='600' y='70' width='90' height='230' fill='%23666'/%3E%3Crect x='720' y='100' width='55' height='200' fill='%23777'/%3E%3Crect x='800' y='85' width='65' height='215' fill='%23555'/%3E%3Crect x='900' y='95' width='75' height='205' fill='%23666'/%3E%3Crect x='1000' y='115' width='40' height='185' fill='%23777'/%3E%3Crect x='1070' y='75' width='60' height='225' fill='%23555'/%3E%3C/svg%3E")`,
                             backgroundSize: 'cover',
                             backgroundPosition: 'bottom'
                         }}>
                    </div>
                </div>
                
                <div className="relative z-10 container mx-auto px-8 pt-20">
                    {/* Logo Row - Centered */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center">
                            <div className="w-16 h-16 bg-black rounded-sm flex items-center justify-center mr-4">
                                <span className="text-white text-2xl">🐆</span>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-800">INGWE</h1>
                                <p className="text-gray-700 text-base">The Property Company SA</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation and Toggles Row */}
                    <div className="flex flex-col lg:flex-row items-center justify-center mb-12 gap-8">
                        {/* Navigation Tabs */}
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => set_search_type('buying')}
                                className={`px-6 py-2 font-medium transition-all ${
                                    search_type === 'buying' 
                                    ? 'text-gray-800 border-b-2 border-gray-800' 
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                Buying
                            </button>
                            <button
                                onClick={() => set_search_type('renting')}
                                className={`px-6 py-2 font-medium transition-all ${
                                    search_type === 'renting' 
                                    ? 'text-gray-800 border-b-2 border-gray-800' 
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                Renting
                            </button>
                            <button
                                onClick={() => set_search_type('selling')}
                                className={`px-6 py-2 font-medium transition-all ${
                                    search_type === 'selling' 
                                    ? 'text-gray-800 border-b-2 border-gray-800' 
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                Selling
                            </button>
                        </div>

                        {/* Toggle Switches */}
                        <div className="flex items-center gap-8">
                            <div className="flex items-center">
                                <span className="mr-3 text-gray-700 text-sm font-medium">Ingwe Premium</span>
                                <button
                                    onClick={() => set_ingwe_premium(!ingwe_premium)}
                                    className={`w-10 h-5 rounded-full transition-colors relative ${
                                        ingwe_premium ? 'bg-gray-800' : 'bg-gray-300'
                                    }`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow absolute top-0.5 transition-transform ${
                                        ingwe_premium ? 'translate-x-5' : 'translate-x-0.5'
                                    }`}></div>
                                </button>
                            </div>
                            <div className="flex items-center">
                                <span className="mr-3 text-gray-700 text-sm font-medium">Ingwe Affordable</span>
                                <button
                                    onClick={() => set_ingwe_affordable(!ingwe_affordable)}
                                    className={`w-10 h-5 rounded-full transition-colors relative ${
                                        ingwe_affordable ? 'bg-[#B8C332]' : 'bg-gray-300'
                                    }`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow absolute top-0.5 transition-transform ${
                                        ingwe_affordable ? 'translate-x-5' : 'translate-x-0.5'
                                    }`}></div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Compact Search Bar */}
                    <div className="max-w-4xl mx-auto mb-20">
                        <div className="bg-[#E8D84A] rounded-full p-3 shadow-xl">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                                <select className="px-4 py-3 rounded-full border-0 focus:outline-none bg-white text-gray-700 text-sm">
                                    <option>🔍 Locations</option>
                                    <option>Durban</option>
                                    <option>Cape Town</option>
                                    <option>Johannesburg</option>
                                </select>
                                <select className="px-4 py-3 rounded-full border-0 focus:outline-none bg-white text-gray-700 text-sm">
                                    <option>Property Type</option>
                                    <option>House</option>
                                    <option>Apartment</option>
                                    <option>Townhouse</option>
                                </select>
                                <select className="px-4 py-3 rounded-full border-0 focus:outline-none bg-white text-gray-700 text-sm">
                                    <option>Price</option>
                                    <option>R500k - R1M</option>
                                    <option>R1M - R2M</option>
                                    <option>R2M+</option>
                                </select>
                                <select className="px-4 py-3 rounded-full border-0 focus:outline-none bg-white text-gray-700 text-sm">
                                    <option>Features</option>
                                    <option>Pool</option>
                                    <option>Garden</option>
                                    <option>Garage</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Valuation Section */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-[#B8C332] to-[#8FA329] p-8">
                    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <h2 className="text-white text-2xl font-bold mb-2">Get A Valuation</h2>
                            <p className="text-white text-lg">Free of charge</p>
                        </div>
                        <button className="bg-gray-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors">
                            Get Valuation →
                        </button>
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