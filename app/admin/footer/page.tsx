import AdminShell from "@/components/admin/AdminShell";
import FooterEditor from "@/components/admin/FooterEditor";

export const dynamic = "force-dynamic";

export default function AdminFooterPage() {
  return (
    <AdminShell>
      <FooterEditor />
    </AdminShell>
  );
}
