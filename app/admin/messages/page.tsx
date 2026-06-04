import AdminShell from "@/components/admin/AdminShell";
import MessagesInbox from "@/components/admin/MessagesInbox";

export const dynamic = "force-dynamic";

export default function AdminMessagesPage() {
  return (
    <AdminShell>
      <MessagesInbox />
    </AdminShell>
  );
}
