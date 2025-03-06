import NavItem from "@/app/ui/component/top-navigation-bar/nav-item";

export default function NavigationBar() {
    return (
        <nav className="flex items-center justify-between w-full bg-green-700">
            <div className="text-lg font-bold bg-amber-300">My Logo</div>
            <div className="flex-grow flex justify-center">
                <ul className="flex space-x-4 justify-center bg-orange-500">
                    <NavItem label="Buy" href="/" />
                    <NavItem label="Rent" href="/rent" />
                    <NavItem label="Sell" href="/sell" />
                    <NavItem label="Calculators" href="/calculator" />
                </ul>
            </div>
        </nav>
    );
}