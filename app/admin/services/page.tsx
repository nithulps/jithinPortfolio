import AdminShell from "@/components/admin/AdminShell";
import ServicesManager from "@/components/admin/ServicesManager";

export const dynamic = "force-dynamic";

export default function AdminServicesPage() {
  return (
    <AdminShell>
      <ServicesManager />
    </AdminShell>
  );
}
