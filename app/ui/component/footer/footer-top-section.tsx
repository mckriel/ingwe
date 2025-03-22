// app/ui/components/footer/FooterTopSection.tsx
import MapPlaceholder from "./map-placeholder";
import Newsletter from "./newsletter";

export default function FooterTopSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
      {/* Map (hidden on mobile) */}
      <div className="hidden md:block">
        <MapPlaceholder />
      </div>
      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}
