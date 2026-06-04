import AdminShell from "@/components/admin/AdminShell";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { Service } from "@/models/Service";
import { Contact } from "@/models/Contact";

export const dynamic = "force-dynamic";

async function getCounts() {
  try {
    await connectDB();
    const [projects, services, messages, unread] = await Promise.all([
      Project.countDocuments(),
      Service.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ read: false }),
    ]);
    return { projects, services, messages, unread };
  } catch {
    return { projects: 0, services: 0, messages: 0, unread: 0 };
  }
}

export default async function AdminDashboard() {
  const c = await getCounts();
  return (
    <AdminShell>
      <h1 className="admin-h1">Dashboard</h1>
      <p className="admin-sub">Manage your portfolio content.</p>
      <div className="admin-grid">
        <div className="admin-stat">
          <div className="num">{c.projects}</div>
          <div className="label">Projects</div>
        </div>
        <div className="admin-stat">
          <div className="num">{c.services}</div>
          <div className="label">Services</div>
        </div>
        <div className="admin-stat">
          <div className="num">{c.messages}</div>
          <div className="label">Messages</div>
        </div>
        <div className="admin-stat">
          <div className="num">{c.unread}</div>
          <div className="label">Unread messages</div>
        </div>
      </div>
    </AdminShell>
  );
}
