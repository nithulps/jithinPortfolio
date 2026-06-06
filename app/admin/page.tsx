import AdminShell from "@/components/admin/AdminShell";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { Service } from "@/models/Service";
import { Contact } from "@/models/Contact";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  try {
    await connectDB();
    const [projects, services, messages, unread, recentMessages] = await Promise.all([
      Project.countDocuments(),
      Service.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ read: false }),
      Contact.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);
    return {
      projects,
      services,
      messages,
      unread,
      recentMessages: JSON.parse(JSON.stringify(recentMessages)) as Array<{
        _id: string;
        name: string;
        email: string;
        projectType: string;
        budget: string;
        message: string;
        read: boolean;
        createdAt: string;
      }>,
    };
  } catch {
    return { projects: 0, services: 0, messages: 0, unread: 0, recentMessages: [] };
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData();
  return (
    <AdminShell>
      <h1 className="admin-h1">Dashboard</h1>
      <p className="admin-sub">Manage your portfolio content.</p>
      
      <div className="admin-grid" style={{ marginBottom: 24 }}>
        <div className="admin-stat">
          <div className="num">{data.projects}</div>
          <div className="label">Projects</div>
        </div>
        <div className="admin-stat">
          <div className="num">{data.services}</div>
          <div className="label">Services</div>
        </div>
        <div className="admin-stat">
          <div className="num">{data.messages}</div>
          <div className="label">Messages</div>
        </div>
        <div className="admin-stat">
          <div className="num">{data.unread}</div>
          <div className="label">Unread messages</div>
        </div>
      </div>

      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>Recent Messages</h3>
          <Link href="/admin/messages" className="admin-btn ghost" style={{ fontSize: "0.85rem", padding: "6px 12px" }}>
            View inbox →
          </Link>
        </div>

        {data.recentMessages.length === 0 ? (
          <p style={{ color: "#8b93a3", margin: 0, fontSize: "0.9rem" }}>No messages yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {data.recentMessages.map((m) => (
              <div
                key={m._id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  padding: 12,
                  backgroundColor: "#11151a",
                  border: "1px solid #1e2530",
                  borderRadius: 8,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {!m.read && (
                      <span
                        style={{
                          backgroundColor: "rgba(0, 222, 255, 0.15)",
                          color: "#00deff",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: 4,
                          textTransform: "uppercase",
                        }}
                      >
                        New
                      </span>
                    )}
                    <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{m.name}</span>
                    <span style={{ color: "#8b93a3", fontSize: "0.82rem" }}>({m.email})</span>
                  </div>
                  <span style={{ color: "#6a768a", fontSize: "0.82rem" }}>
                    {new Date(m.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {m.projectType && (
                  <div style={{ fontSize: "0.82rem", color: "#aab2c0" }}>
                    <strong>Project type:</strong> {m.projectType} {m.budget ? `· Budget: ${m.budget}` : ""}
                  </div>
                )}
                <p style={{ color: "#e7e9ee", fontSize: "0.88rem", margin: "4px 0 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {m.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
