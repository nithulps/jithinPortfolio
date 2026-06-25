import AdminNav from "@/components/admin/AdminNav";
import { getAbout } from "@/lib/data";

export default async function AdminShell({ children }: { children: React.ReactNode }) {
  const about = await getAbout();
  return (
    <div className="admin-shell">
      <AdminNav logo={about?.logo} />
      <main className="admin-main">{children}</main>
    </div>
  );
}
