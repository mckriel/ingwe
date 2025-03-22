// app/ui/components/footer/FooterNavigation.tsx
export default function FooterNavigation() {
    return (
      <div>
        <ul className="space-y-2">
          <li><a href="/" className="hover:underline">Homepage</a></li>
          <li><a href="/about" className="hover:underline">About</a></li>
          <li><a href="/blog" className="hover:underline">Blog</a></li>
          <li><a href="/contact" className="hover:underline">Contact</a></li>
        </ul>
      </div>
    );
  }
