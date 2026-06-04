import AdminShell from "@/components/admin/AdminShell";
import ContactEditor from "@/components/admin/ContactEditor";

export const dynamic = "force-dynamic";

export default function AdminContactPage() {
  return (
    <AdminShell>
      <ContactEditor />
    </AdminShell>
  );
}
