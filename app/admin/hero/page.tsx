import AdminShell from "@/components/admin/AdminShell";
import HeroEditor from "@/components/admin/HeroEditor";

export const dynamic = "force-dynamic";

export default function AdminHeroPage() {
  return (
    <AdminShell>
      <HeroEditor />
    </AdminShell>
  );
}
