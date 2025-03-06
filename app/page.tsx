import TopNav from "@/app/ui/component/top-navigation-bar/navigation-bar";

export default function Page() {
    return (
        <main className="flex flex-col min-h-screen">
            <header className="bg-gray-600 p-4">
                <TopNav />
            </header>
            <div className="flex-grow container mx-auto p-4 bg-gray-800 text-center">
                <span>Main</span>
            </div>
            <footer className="bg-gray-600 p-4">
                <div className="container mx-auto text-center">
                    <span>Footer</span>
                </div>
            </footer>
        </main>
    );
}
