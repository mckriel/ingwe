// app/ui/components/footer/Footer.tsx
import FooterTopSection from "./footer-top-section";
import FooterBottomSection from "./footer-bottom-section";

export default function Footer() {
  return (
    <footer className="bg-[#2E2A29] text-white">
      <div className="max-w-screen-xl mx-auto px-2 py-4">
        {/* Top Section: Map & Newsletter */}
        <FooterTopSection />
        {/* Bottom Section: Social, Navigation, Contact */}
        <FooterBottomSection />
      </div>
    </footer>
  );
}
