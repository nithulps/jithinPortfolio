import AdminShell from "@/components/admin/AdminShell";
import PagesManager from "@/components/admin/PagesManager";

export const dynamic = "force-dynamic";

export default function AdminPagesPage() {
  return (
    <AdminShell>
      <PagesManager />
    </AdminShell>
  );
}
