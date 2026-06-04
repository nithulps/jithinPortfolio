import AdminShell from "@/components/admin/AdminShell";
import AboutEditor from "@/components/admin/AboutEditor";

export const dynamic = "force-dynamic";

export default function AdminAboutPage() {
  return (
    <AdminShell>
      <AboutEditor />
    </AdminShell>
  );
}
