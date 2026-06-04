import AdminShell from "@/components/admin/AdminShell";
import ProjectsManager from "@/components/admin/ProjectsManager";

export const dynamic = "force-dynamic";

export default function AdminProjectsPage() {
  return (
    <AdminShell>
      <ProjectsManager />
    </AdminShell>
  );
}
