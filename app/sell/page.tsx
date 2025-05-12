'use client';

export default function Page() {
    return (
        <main className="min-h-screen flex flex-col items-center pt-8 w-full">
            <h1 className="text-3xl font-bold mb-6 text-center">Property for Sale</h1>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-screen-lg w-full">
                <p className="text-lg mb-4">
                    Ready to sell your property? Our expert agents can help you get the best price.
                </p>
                <p className="text-lg mb-4">
                    Contact us today to list your property with Ingwe.
                </p>
                <div className="mt-8">
                    <button className="bg-[#D1DA68] hover:bg-[#D1DA68]/80 text-white px-6 py-3 rounded-full font-medium">
                        Contact an Agent
                    </button>
                </div>
            </div>
        </main>
    );
}
