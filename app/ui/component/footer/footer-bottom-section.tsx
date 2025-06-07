// app/ui/components/footer/FooterBottomSection.tsx
import SocialMedia from "./social-media";
import FooterNavigation from "./footer-navigation";
import ContactInfo from "./contact-info";

export default function FooterBottomSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
      {/* Design Website Section */}
      <div>
        <h3 className="text-white text-lg font-medium mb-6">Design Website. Easier than ever.</h3>
        <p className="text-gray-300 text-sm mb-6 leading-relaxed max-w-sm">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
          Lorem Ipsum has been the.
        </p>
        <SocialMedia />
      </div>
      
      {/* Navigation */}
      <div>
        <h3 className="text-white text-lg font-medium mb-6">Navigation</h3>
        <FooterNavigation />
      </div>
      
      {/* Get in Touch */}
      <div>
        <h3 className="text-white text-lg font-medium mb-6">Get in Touch</h3>
        <ContactInfo />
      </div>
    </div>
  );
}
