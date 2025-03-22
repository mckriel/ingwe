import "@/app/ui/global.css";
import TopNav from "@/app/ui/component/header/top-navigation-bar/navigation-bar";
import Footer from "@/app/ui/component/footer/footer";
import { Lato } from 'next/font/google';

const lato = Lato({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-lato', // optional: creates a CSS variable for easier usage
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lato.className}`}>
        <body className="antialiased bg-[#FFFFFF]">
           <main className="flex flex-col min-h-screen">
              <header className="bg-[#FFFFFF] ">
                  <TopNav />
              </header>
              <div className="flex-grow container mx-auto p-4 text-center min-h-screen">
                { children }
              </div>
              <footer className="w-full bg-gray-800 text-white">
                  <Footer />
              </footer>
            </main>
        </body>
    </html>
  );
}
