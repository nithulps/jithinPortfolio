import AdminNav from "@/components/admin/AdminNav";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <AdminNav />
      <main className="admin-main">{children}</main>
    </div>
  );
}
