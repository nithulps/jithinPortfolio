import AdminShell from "@/components/admin/AdminShell";
import SiteSettingsEditor from "@/components/admin/SiteSettingsEditor";

export const dynamic = "force-dynamic";

export default function AdminSiteSettingsPage() {
  return (
    <AdminShell>
      <SiteSettingsEditor />
    </AdminShell>
  );
}
