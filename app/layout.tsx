import "@/app/ui/global.css";
import TopNav from "@/app/ui/component/top-navigation-bar/navigation-bar";
import Footer from "@/app/ui/component/footer";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
        <body className="antialiased bg-[#FFFFFF]">
           <main className="flex flex-col min-h-screen">
              <header className="bg-[#FFFFFF] ">
                  <TopNav />
              </header>
              <div className="flex-grow container mx-auto p-4 bg-gray-800 text-center">
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
