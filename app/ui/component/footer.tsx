export default function Footer() {
    return (
      <footer className="bg-[#2E2A29] text-white">
        {/* Outer Container */}
        <div className="max-w-screen-xl mx-auto px-2 py-4">

          {/* Top Section: Map & Newsletter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Map */}
            <div className="hidden md:block">
              {/* If you’re embedding an actual map, you can use an iframe or a library like react-google-maps */}
              <div className="h-64  flex items-center justify-center">
                <p className="text-white">Map goes here</p>
              </div>
            </div>
  
            {/* Newsletter */}
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-semibold mb-4 text-white">
                Newsletter
              </h2>
              <p className="text-[#A3D92D] mb-6">
                In hac habitasse platea dictumst. Curabitur condimentum
                porta lacus, eget facilisis enim vulputate id. Vivamus et mi et
                ...
              </p>

              {/* Newsletter Form */}
              <form className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="
                    flex-1
                    px-4
                    py-2
                    rounded
                    bg-white
                    text-black
                    placeholder-gray-500
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#A3D92D]
                  "
                />
                <button
                  type="submit"
                  className="
                    bg-[#A3D92D]
                    hover:bg-[#92c12a]
                    text-white
                    px-6
                    py-2
                    rounded
                    transition-colors
                  "
                >
                  Sign Up Now
                </button>
              </form>
            </div>

          </div>
  
          {/* Bottom Section: Social, Nav, Contact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Social Media Icons */}
            <div className="flex flex-col items-start">
              <div className="flex space-x-4">
                {/* Replace these placeholders with actual icons (e.g., from heroicons, FontAwesome, etc.) */}
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  FB
                </div>
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  TW
                </div>
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  IG
                </div>
              </div>
            </div>
  
            {/* Footer Navigation */}
            <div>
              <ul className="space-y-2">
                <li><a href="/" className="hover:underline">Homepage</a></li>
                <li><a href="/about" className="hover:underline">About</a></li>
                <li><a href="/blog" className="hover:underline">Blog</a></li>
                <li><a href="/contact" className="hover:underline">Contact</a></li>
              </ul>
            </div>
  
            {/* Get in Touch */}
            <div>
              <p className="mb-2">hello@website.com</p>
              <p className="mb-2">+1 234 567 890</p>
              <p>123 Main Street<br/>Anytown, USA</p>
            </div>
          </div>
  
        </div>
      </footer>
    );
  }
  