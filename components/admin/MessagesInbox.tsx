"use client";

import { Fragment, useEffect, useState } from "react";
import { useConfirm } from "@/components/admin/ConfirmDialog";

interface Message {
  _id: string;
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesInbox() {
  const [items, setItems] = useState<Message[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const confirm = useConfirm();

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/contacts");
    setItems(await res.json());
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function toggleRead(m: Message) {
    await fetch(`/api/admin/contacts/${m._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !m.read }),
    });
    load();
  }

  async function remove(id: string) {
    const ok = await confirm({
      title: "Delete message",
      message: "Are you sure you want to delete this message? This can't be undone.",
      confirmText: "Delete",
      danger: true,
    });
    if (!ok) return;
    await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
    load();
  }

  function expand(m: Message) {
    setOpen(open === m._id ? null : m._id);
    if (!m.read) toggleRead(m);
  }

  return (
    <div>
      <h1 className="admin-h1">Messages</h1>
      <p className="admin-sub">Contact form submissions.</p>

      <div className="admin-card">
        {loading ? (
          <p>Loading…</p>
        ) : items.length === 0 ? (
          <p style={{ color: "#8b93a3" }}>No messages yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Name</th>
                <th>Type</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <Fragment key={m._id}>
                  <tr style={{ cursor: "pointer" }} onClick={() => expand(m)}>
                    <td>
                      {m.read ? (
                        <span className="admin-pill">Read</span>
                      ) : (
                        <span className="admin-pill unread">New</span>
                      )}
                    </td>
                    <td>{m.name}</td>
                    <td>{m.projectType || "—"}</td>
                    <td>{new Date(m.createdAt).toLocaleDateString("en-GB")}</td>
                    <td>
                      <button
                        className="admin-btn danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(m._id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  {open === m._id && (
                    <tr>
                      <td colSpan={5} style={{ background: "#0b0d10" }}>
                        <div style={{ padding: "8px 4px", lineHeight: 1.6 }}>
                          <p>
                            <strong>Email:</strong>{" "}
                            <a href={`mailto:${m.email}`} style={{ color: "#00deff" }}>
                              {m.email}
                            </a>
                          </p>
                          {m.budget && (
                            <p>
                              <strong>Budget:</strong> {m.budget}
                            </p>
                          )}
                          <p style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{m.message}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
