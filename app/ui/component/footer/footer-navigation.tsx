import Link from "next/link";

export default function FooterNavigation() {
    return (
      <div>
        <ul className="space-y-3">
          <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Homepage</Link></li>
          <li><Link href="/articles" className="text-gray-300 hover:text-white transition-colors">News/Blog</Link></li>
          <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About us</Link></li>
          <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contacts</Link></li>
        </ul>
      </div>
    );
  }
