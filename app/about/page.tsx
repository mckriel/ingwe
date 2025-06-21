'use client';
import Image from 'next/image';

export default function Page() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-12 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-6">
                        {/* Badge */}
                        <div className="inline-block">
                            <span className="bg-[#B8C332] text-white px-4 py-2 rounded-full text-sm font-medium">
                                INGWE PROPERTY GROUP
                            </span>
                        </div>
                        
                        {/* Main Heading */}
                        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                            Exploring Real Estate In{' '}
                            <span className="block">Kwazulu Natal With</span>
                            <span className="block">Personal Assitance</span>
                        </h1>
                        
                        {/* Subheading */}
                        <div className="space-y-2">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Lorem Ipsum Dolor Sit Amet
                            </h2>
                            <p className="text-gray-600 text-base max-w-md">
                                It is a long established fact that a reader will be distracted by the readable content of a page when
                            </p>
                        </div>
                        
                        {/* CTA Button */}
                        <div className="pt-4">
                            <button className="bg-[#B8C332] hover:bg-[#a6b02e] text-white px-8 py-3 rounded-lg font-medium transition-colors">
                                Read More
                            </button>
                        </div>
                    </div>
                    
                    {/* Right Content - Image with Stats Overlay */}
                    <div className="relative">
                        {/* Main Property Image */}
                        <div className="relative rounded-2xl overflow-hidden">
                            <Image
                                src="/house1.jpeg"
                                alt="Modern house exterior"
                                width={600}
                                height={400}
                                className="w-full h-auto object-cover"
                                priority
                            />
                        </div>
                        
                        {/* Statistics Overlay */}
                        <div className="absolute top-4 right-4 bg-[#B8C332] text-white p-6 rounded-xl shadow-lg space-y-4">
                            {/* Stat 1 */}
                            <div className="text-center">
                                <div className="text-2xl font-bold">621 +</div>
                                <div className="text-sm opacity-90">Lorem Ipsum Sit</div>
                            </div>
                            
                            {/* Stat 2 */}
                            <div className="text-center">
                                <div className="text-2xl font-bold">27 +</div>
                                <div className="text-sm opacity-90">Lorem Ipsum Sit</div>
                            </div>
                            
                            {/* Stat 3 */}
                            <div className="text-center">
                                <div className="text-2xl font-bold">192K</div>
                                <div className="text-sm opacity-90">Lorem Ipsum Sit</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* About Ingwe Section */}
            <div className="container mx-auto px-4 py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Content - Property Images */}
                    <div className="relative">
                        {/* Main property image with pool */}
                        <div className="relative mb-4">
                            <Image
                                src="/house1.jpeg"
                                alt="Luxury property with pool"
                                width={600}
                                height={400}
                                className="w-full h-80 object-cover rounded-2xl"
                            />
                        </div>
                        
                        {/* Secondary property image */}
                        <div className="relative">
                            <Image
                                src="/house1.jpeg"
                                alt="Modern residential property"
                                width={300}
                                height={200}
                                className="w-1/2 h-48 object-cover rounded-2xl"
                            />
                            
                            {/* Stats Overlay */}
                            <div className="absolute bottom-4 right-4 bg-[#B8C332] text-white p-4 rounded-xl shadow-lg flex items-center space-x-3">
                                {/* Chart icon */}
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 3v18h18V3H3zm16 16H5V5h14v14zM7 17h2v-4H7v4zm4 0h2V7h-2v10zm4 0h2v-6h-2v6z"/>
                                </svg>
                                <div>
                                    <div className="text-xl font-bold">291 +</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Content - About Section */}
                    <div className="space-y-8">
                        {/* Section Title */}
                        <div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                                About Ingwe
                            </h2>
                            <p className="text-gray-600 text-lg">
                                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                            </p>
                        </div>
                        
                        {/* Feature Cards */}
                        <div className="space-y-6">
                            {/* Feature 1 */}
                            <div className="bg-[#B8C332] text-white p-6 rounded-2xl">
                                <div className="flex items-start space-x-4">
                                    {/* Rocket icon */}
                                    <svg className="w-8 h-8 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                                    </svg>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Lorem Ipsum Dolor</h3>
                                        <p className="text-white/90">
                                            It is a long established fact that a reader will be distracted by the readable content
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Feature 2 */}
                            <div className="border-l-4 border-[#B8C332] pl-6">
                                <div className="flex items-start space-x-4">
                                    {/* Location icon */}
                                    <div className="w-12 h-12 bg-[#B8C332] rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-[#B8C332] mb-2">Lorem Ipsum Dolor</h3>
                                        <p className="text-gray-600">
                                            It is a long established fact that a reader will be distracted by the readable content
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Feature 3 */}
                            <div className="border-l-4 border-[#B8C332] pl-6">
                                <div className="flex items-start space-x-4">
                                    {/* Award icon */}
                                    <div className="w-12 h-12 bg-[#B8C332] rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-[#B8C332] mb-2">Lorem Ipsum Dolor</h3>
                                        <p className="text-gray-600">
                                            It is a long established fact that a reader will be distracted by the readable content
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Meet Our People Section */}
            <div className="bg-gray-50 py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">Ingwe Agents</p>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            Meet Our People
                        </h2>
                        <p className="text-gray-600 max-w-4xl mx-auto text-lg leading-relaxed">
                            Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Diam Nonumy Eirmod Tempor 
                            Invidunt Ut Labore Et Dolore Magna Aliquyam Erat, Sed Diam Voluptua. At Vero Eos Et Accusam 
                            Et Justo Duo Dolores Et Ea Rebum. Stet Clita Kasd Gubergren, No Sea Takimata Sanctus Est
                        </p>
                    </div>
                    
                    {/* Agents Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Agent 1 */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="aspect-square bg-purple-100 relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center">
                                    <div className="w-24 h-24 bg-purple-400 rounded-full flex items-center justify-center">
                                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 text-center">
                                <h3 className="font-semibold text-gray-900 mb-1">Tim Smet</h3>
                                <p className="text-gray-500 text-sm">Agent</p>
                            </div>
                        </div>
                        
                        {/* Agent 2 */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="aspect-square bg-gray-700 relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                                    <div className="w-24 h-24 bg-gray-500 rounded-full flex items-center justify-center">
                                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 text-center">
                                <h3 className="font-semibold text-gray-900 mb-1">Tim Smet</h3>
                                <p className="text-gray-500 text-sm">Agent</p>
                            </div>
                        </div>
                        
                        {/* Agent 3 */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="aspect-square bg-red-600 relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                                    <div className="w-24 h-24 bg-red-400 rounded-full flex items-center justify-center">
                                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 text-center">
                                <h3 className="font-semibold text-gray-900 mb-1">Tim Smet</h3>
                                <p className="text-gray-500 text-sm">Agent</p>
                            </div>
                        </div>
                        
                        {/* Agent 4 */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="aspect-square bg-blue-500 relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                    <div className="w-24 h-24 bg-blue-300 rounded-full flex items-center justify-center">
                                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 text-center">
                                <h3 className="font-semibold text-gray-900 mb-1">Tim Smet</h3>
                                <p className="text-gray-500 text-sm">Agent</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Get In Touch Section */}
            <div className="relative bg-white py-16 lg:py-24 overflow-hidden">
                {/* Geometric Background */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Large geometric shapes */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gray-100 rounded-full transform translate-x-48 -translate-y-48"></div>
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-gray-50 rounded-full transform translate-x-40 translate-y-40"></div>
                    <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gray-75 rounded-full transform translate-x-32"></div>
                </div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left Content */}
                        <div className="space-y-6">
                            <h3 className="text-[#B8C332] text-xl font-medium">Get In Touch</h3>
                            <div>
                                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                                    We are live.
                                </h2>
                                <p className="text-4xl lg:text-5xl font-normal text-gray-600">
                                    Give us your feedback
                                </p>
                            </div>
                        </div>
                        
                        {/* Right Content - Contact Form */}
                        <div className="bg-white rounded-3xl shadow-xl p-8 relative z-20">
                            <form className="space-y-6">
                                {/* Location Dropdown */}
                                <div className="relative">
                                    <select className="w-full px-4 py-4 bg-gray-50 rounded-xl border-0 text-gray-700 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-[#B8C332]">
                                        <option value="">Cristiansen</option>
                                        <option value="cape-town">Cape Town</option>
                                        <option value="johannesburg">Johannesburg</option>
                                        <option value="durban">Durban</option>
                                        <option value="pretoria">Pretoria</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                
                                {/* Email Address */}
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full px-4 py-4 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-[#B8C332] text-gray-700"
                                />
                                
                                {/* Phone Number */}
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    className="w-full px-4 py-4 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-[#B8C332] text-gray-700"
                                />
                                
                                {/* Password */}
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full px-4 py-4 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-[#B8C332] text-gray-700"
                                />
                                
                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-[#B8C332] hover:bg-[#a6b02e] text-white py-4 px-6 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#B8C332] focus:ring-offset-2"
                                >
                                    Sign Up Now
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* We're Hiring Section */}
            <div className="bg-gray-100 py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
                            We&apos;re Hiring!
                        </h2>
                    </div>
                    
                    {/* Job Listings */}
                    <div className="max-w-4xl mx-auto space-y-4">
                        {/* Job 1 - Product Designer */}
                        <div className="bg-white rounded-lg p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Designer</h3>
                                <p className="text-gray-600">Locations: New York, Dallas, Los Angeles, Denver, Chicago, Sao Paulo, San Francisco</p>
                            </div>
                            <button className="bg-[#B8C332] hover:bg-[#a6b02e] text-white px-6 py-2 rounded-lg font-medium transition-colors shrink-0 ml-4">
                                Apply
                            </button>
                        </div>
                        
                        {/* Job 2 - Account Director */}
                        <div className="bg-white rounded-lg p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Director</h3>
                                <p className="text-gray-600">Locations: Hong Kong</p>
                            </div>
                            <button className="bg-[#B8C332] hover:bg-[#a6b02e] text-white px-6 py-2 rounded-lg font-medium transition-colors shrink-0 ml-4">
                                Apply
                            </button>
                        </div>
                        
                        {/* Job 3 - DMP Data Engineer */}
                        <div className="bg-white rounded-lg p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">DMP Data Engineer</h3>
                                <p className="text-gray-600">Locations: Hong Kong, Chicago, Boston, San Francisco, Atlanta</p>
                            </div>
                            <button className="bg-[#B8C332] hover:bg-[#a6b02e] text-white px-6 py-2 rounded-lg font-medium transition-colors shrink-0 ml-4">
                                Apply
                            </button>
                        </div>
                        
                        {/* Job 4 - Account Manager */}
                        <div className="bg-white rounded-lg p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Manager</h3>
                                <p className="text-gray-600">Locations: Hong Kong</p>
                            </div>
                            <button className="bg-[#B8C332] hover:bg-[#a6b02e] text-white px-6 py-2 rounded-lg font-medium transition-colors shrink-0 ml-4">
                                Apply
                            </button>
                        </div>
                        
                        {/* Job 5 - Market Director */}
                        <div className="bg-white rounded-lg p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Market Director</h3>
                                <p className="text-gray-600">Locations: New York, Chicago, Miami</p>
                            </div>
                            <button className="bg-[#B8C332] hover:bg-[#a6b02e] text-white px-6 py-2 rounded-lg font-medium transition-colors shrink-0 ml-4">
                                Apply
                            </button>
                        </div>
                        
                        {/* Job 6 - Staff Accountant */}
                        <div className="bg-white rounded-lg p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Staff Accountant</h3>
                                <p className="text-gray-600">Locations: San Francisco</p>
                            </div>
                            <button className="bg-[#B8C332] hover:bg-[#a6b02e] text-white px-6 py-2 rounded-lg font-medium transition-colors shrink-0 ml-4">
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}