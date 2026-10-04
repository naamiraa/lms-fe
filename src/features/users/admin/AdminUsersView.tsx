"use client";

import { useEffect, useMemo, useState } from "react";
import type { AdminUser } from "@/types/admin-user";
import {
  approveUser,
  assignUserRole,
  getAdminUsers,
  rejectUser,
} from "@/services/admin-user.service";

type StatusFilter = "ALL" | "APPROVED" | "PENDING" | "REJECTED";
type RoleFilter = "ALL" | "PARTICIPANT" | "INSTRUCTOR" | "ADMIN";

export default function AdminUsersView() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");
  const [roleFilter, setRoleFilter] =
    useState<RoleFilter>("ALL");

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminUsers();
      setUsers(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleApprove(id: string) {
    try {
      setProcessingId(id);
      setError("");

      await approveUser(id);
      await loadUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to approve user."
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(id: string) {
    try {
      setProcessingId(id);
      setError("");

      await rejectUser(id);
      await loadUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reject user."
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function handleRoleChange(
    user: AdminUser,
    role: string
  ) {
    if (!role || user.roles.includes(role)) {
      return;
    }

    try {
      setProcessingId(user.id);
      setError("");

      await assignUserRole(user.id, role);
      await loadUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update role."
      );
    } finally {
      setProcessingId(null);
    }
  }

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !keyword ||
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.employeeNumber?.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "ALL" ||
        user.approvalStatus === statusFilter;

      const matchesRole =
        roleFilter === "ALL" ||
        user.roles.includes(roleFilter);

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, search, statusFilter, roleFilter]);

  const participantCount = users.filter((user) =>
    user.roles.includes("PARTICIPANT")
  ).length;

  const instructorCount = users.filter((user) =>
    user.roles.includes("INSTRUCTOR")
  ).length;

  const pendingCount = users.filter(
    (user) => user.approvalStatus === "PENDING"
  ).length;

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-500">
        Loading users...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <p className="text-sm font-medium text-blue-600">
          Administration
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          User Management
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage LMS users, registration approvals, and access roles.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Total Users" value={users.length} />
        <SummaryCard
          label="Participants"
          value={participantCount}
        />
        <SummaryCard
          label="Instructors"
          value={instructorCount}
        />
        <SummaryCard
          label="Pending Approval"
          value={pendingCount}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email, or employee number..."
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          />

          <select
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(event.target.value as RoleFilter)
            }
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="PARTICIPANT">Participant</option>
            <option value="INSTRUCTOR">Instructor</option>
            <option value="ADMIN">Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as StatusFilter
              )
            }
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Employee No.</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Source</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Registered</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const isProcessing =
                  processingId === user.id;

                const isAdmin =
                  user.roles.includes("ADMIN");

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {user.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {user.email}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {user.employeeNumber || "-"}
                    </td>

                    <td className="px-5 py-4">
                      {isAdmin ? (
                        <span className="font-medium text-slate-700">
                          ADMIN
                        </span>
                      ) : (
                        <select
                          value={user.roles[0] ?? ""}
                          disabled={isProcessing}
                          onChange={(event) =>
                            handleRoleChange(
                              user,
                              event.target.value
                            )
                          }
                          className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-semibold outline-none"
                        >
                          <option value="PARTICIPANT">
                            PARTICIPANT
                          </option>
                          <option value="INSTRUCTOR">
                            INSTRUCTOR
                          </option>
                        </select>
                      )}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {user.registrationSource}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge
                        status={user.approvalStatus}
                      />
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {new Date(
                        user.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4">
                      {user.approvalStatus === "PENDING" ? (
                        <div className="flex gap-2">
                          <button
                            disabled={isProcessing}
                            onClick={() =>
                              handleApprove(user.id)
                            }
                            className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                          >
                            Approve
                          </button>

                          <button
                            disabled={isProcessing}
                            onClick={() =>
                              handleReject(user.id)
                            }
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="p-10 text-center text-sm text-slate-500">
              No users found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const className =
    status === "APPROVED"
      ? "bg-emerald-50 text-emerald-700"
      : status === "PENDING"
        ? "bg-amber-50 text-amber-700"
        : "bg-red-50 text-red-700";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      {status}
    </span>
  );
}