import ClientEffects from "@/components/ClientEffects";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialSidebar from "@/components/SocialSidebar";
import StatusBadge from "@/components/StatusBadge";
import BackToTop from "@/components/BackToTop";
import { getAbout, getNavPages } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [about, navPages] = await Promise.all([getAbout(), getNavPages()]);
  const socials = about?.socials;
  const extraNav = navPages.map((p) => ({
    href: `/${p.slug}`,
    label: p.navLabel || p.title,
  }));

  return (
    <>
      <div className="cur" id="cur" />

      <div className="bg-video-container">
        {/* Decorative background loop — replace with your own Cloudinary video via the admin if desired */}
        <video
          src="https://aerukart.com/wp-content/uploads/2025/10/AERUK-BG-ANIM.webm"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="bg-overlay" />
      </div>

      <SocialSidebar socials={socials} />
      <StatusBadge text={about?.statusText} />
      <Header socials={socials} extraNav={extraNav} />

      {children}

      <Footer heading={about?.footerHeading} subtitle={about?.footerSubtitle} />
      <BackToTop />
      <ClientEffects />
    </>
  );
}
