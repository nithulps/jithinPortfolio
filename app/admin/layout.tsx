import "./admin.css";
import HeroBackground from "@/components/HeroBackground";
import { ConfirmProvider } from "@/components/admin/ConfirmDialog";

export const metadata = { title: "Admin — Jithin Portfolio" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root">
      {/* Shared interactive grid background across all admin pages */}
      <div className="admin-bg" aria-hidden="true">
        <HeroBackground />
      </div>
      <ConfirmProvider>{children}</ConfirmProvider>
    </div>
  );
}
