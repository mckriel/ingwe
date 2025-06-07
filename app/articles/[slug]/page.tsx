'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const [article_slug, set_article_slug] = useState<string>('');

  useEffect(() => {
    params.then((resolved_params) => {
      set_article_slug(resolved_params.slug);
    });
  }, [params]);

  // Sample article data - in real app this would come from API/CMS
  const article = {
    title: "Lorem Ipsum dolor sit amet, consectetur.",
    category: "Category Name",
    date: "Date",
    image: "/house1.jpeg",
    content: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      "Ipsum dolor sit amet, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Pellentesque habitant elit Lorem ipsum dolor sit amet.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. At vero eos et accusam et justo duo dolores et ea rebum."
    ]
  };

  const latest_news = [
    {
      id: 1,
      title: "Latest News",
      subtitle: "Description of the blog post, limited to two lines and then more text to fill...",
      image: "/house1.jpeg",
      category: "Latest News"
    },
    {
      id: 2,
      title: "Latest News",
      subtitle: "Description of the blog post, limited to two lines and then more text to fill...",
      image: "/house1.jpeg",
      category: "Latest News"
    },
    {
      id: 3,
      title: "Latest News",
      subtitle: "Description of the blog post, limited to two lines and then more text to fill...",
      image: "/house1.jpeg",
      category: "Latest News"
    },
    {
      id: 4,
      title: "Latest News",
      subtitle: "Description of the blog post, limited to two lines and then more text to fill...",
      image: "/house1.jpeg",
      category: "Latest News"
    },
    {
      id: 5,
      title: "Latest News",
      subtitle: "Description of the blog post, limited to two lines and then more text to fill...",
      image: "/house1.jpeg",
      category: "Latest News"
    },
    {
      id: 6,
      title: "Latest News",
      subtitle: "Description of the blog post, limited to two lines and then more text to fill...",
      image: "/house1.jpeg",
      category: "Latest News"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Main Article Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-[#B8C332]">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/articles" className="hover:text-[#B8C332]">Articles</Link>
          <span className="mx-2">›</span>
          <span>{article.category}</span>
          <span className="mx-2">›</span>
          <span className="text-gray-900">{article.date}</span>
        </nav>

        {/* Article Title */}
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 max-w-4xl">
          {article.title}
        </h1>

        {/* Article Image */}
        <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden mb-8">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Content */}
        <div className="max-w-4xl">
          {article.content.map((paragraph, index) => (
            <p key={index} className="text-gray-700 text-lg leading-relaxed mb-6">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Latest News Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Latest News
            </h2>
            <div className="w-24 h-1 bg-[#B8C332]"></div>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest_news.map((news_item) => (
              <Link 
                key={news_item.id} 
                href={`/articles/${news_item.id}`}
                className="group block"
              >
                <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* News Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={news_item.image}
                      alt={news_item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Overlay with Category */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-[#B8C332] text-white px-3 py-1 rounded-full text-sm font-medium">
                          {news_item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* News Content */}
                  <div className="p-6">
                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {news_item.title}
                    </h3>
                    
                    {/* Subtitle */}
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {news_item.subtitle}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link 
              href="/articles"
              className="bg-[#B8C332] hover:bg-[#a6b02e] text-white px-8 py-3 rounded-lg font-medium transition-colors inline-block"
            >
              View All Articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}