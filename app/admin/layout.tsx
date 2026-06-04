import "./admin.css";

export const metadata = { title: "Admin — Jithin Portfolio" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-root">{children}</div>;
}
