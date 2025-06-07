'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function ArticlesPage() {
    const articles = [
        {
            id: 1,
            title: "Lorem Ipsum dolor sit amet, consectetur",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            image: "/house1.jpeg",
            category: "Property Advice"
        },
        {
            id: 2,
            title: "Lorem Ipsum dolor sit amet, consectetur",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            image: "/house1.jpeg",
            category: "Market Trends"
        },
        {
            id: 3,
            title: "Lorem Ipsum dolor sit amet, consectetur",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            image: "/house1.jpeg",
            category: "Investment"
        },
        {
            id: 4,
            title: "Lorem Ipsum dolor sit amet, consectetur",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            image: "/house1.jpeg",
            category: "Property News"
        },
        {
            id: 5,
            title: "Lorem Ipsum dolor sit amet, consectetur",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            image: "/house1.jpeg",
            category: "Market Reports"
        },
        {
            id: 6,
            title: "Lorem Ipsum dolor sit amet, consectetur",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            image: "/house1.jpeg",
            category: "Home Improvement"
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-96 lg:h-[500px] overflow-hidden">
                <Image
                    src="/house1.jpeg"
                    alt="Latest Articles Hero"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h1 className="text-4xl lg:text-6xl font-bold text-white text-center">
                        Latest Articles
                    </h1>
                </div>
            </div>

            {/* Navigation Breadcrumb */}
            <div className="container mx-auto px-4 py-4">
                <nav className="text-sm text-gray-600">
                    <span>Home</span>
                    <span className="mx-2">›</span>
                    <span>Articles</span>
                    <span className="mx-2">›</span>
                    <span className="text-gray-900">All Articles</span>
                </nav>
            </div>

            {/* Articles Grid */}
            <div className="container mx-auto px-4 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <Link key={article.id} href={`/articles/${article.id}`} className="block group">
                            <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            {/* Article Image */}
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={article.image}
                                    alt={article.title}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            
                            {/* Article Content */}
                            <div className="p-6">
                                {/* Category */}
                                <div className="text-sm text-gray-500 mb-2">
                                    {article.category}
                                </div>
                                
                                {/* Title */}
                                <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                                    {article.title}
                                </h2>
                                
                                {/* Content Preview */}
                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                    {article.content}
                                </p>
                                
                                {/* Read More Link */}
                                <div className="mt-4">
                                    <span className="text-[#B8C332] group-hover:text-[#a6b02e] font-medium text-sm transition-colors">
                                        Read More →
                                    </span>
                                </div>
                            </div>
                        </article>
                        </Link>
                    ))}
                </div>
                
                {/* Load More Button */}
                <div className="text-center mt-12">
                    <button className="bg-[#B8C332] hover:bg-[#a6b02e] text-white px-8 py-3 rounded-lg font-medium transition-colors">
                        Load More Articles
                    </button>
                </div>
            </div>
        </div>
    );
}