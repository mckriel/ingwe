// app/ui/components/footer/FooterBottomSection.tsx
import SocialMedia from "./social-media";
import FooterNavigation from "./footer-navigation";
import ContactInfo from "./contact-info";

export default function FooterBottomSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <SocialMedia />
      <FooterNavigation />
      <ContactInfo />
    </div>
  );
}
