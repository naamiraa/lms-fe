"use client";
import Alert from "@/components/shared/Alert";

import LoadingState from "@/components/shared/LoadingState";

import DataTable from "@/components/shared/DataTable";

import GlassCard from "@/components/shared/GlassCard";

import PageHeader from "@/components/shared/PageHeader";

import SummaryCard from "@/components/shared/MetricCard";

import { useEffect, useMemo, useState } from "react";

import ConfirmModal from "@/components/ConfirmModal";
import {
  approveUser,
  assignUserRole,
  getAdminUsers,
  rejectUser,
} from "@/services/admin-user.service";
import type { AdminUser } from "@/types/admin-user";

type StatusFilter = "ALL" | "APPROVED" | "PENDING" | "REJECTED";

type RoleFilter = "ALL" | "PARTICIPANT" | "INSTRUCTOR" | "ADMIN";

export default function AdminUsersView() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [processingId, setProcessingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");

  const [confirmAction, setConfirmAction] = useState<{
    type: "APPROVE" | "REJECT";
    userId: string;
    userName: string;
  } | null>(null);

  const [processingAction, setProcessingAction] = useState(false);

  const [confirmRoleChange, setConfirmRoleChange] = useState<{
    user: AdminUser;
    newRole: string;
  } | null>(null);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  function handleApprove(userId: string, userName: string) {
    setConfirmAction({
      type: "APPROVE",
      userId,
      userName,
    });
  }

  function handleReject(userId: string, userName: string) {
    setConfirmAction({
      type: "REJECT",
      userId,
      userName,
    });
  }

  async function handleConfirmAction() {
    if (!confirmAction) return;

    try {
      setProcessingAction(true);
      setError("");

      if (confirmAction.type === "APPROVE") {
        await approveUser(confirmAction.userId);
      } else {
        await rejectUser(confirmAction.userId);
      }

      setConfirmAction(null);
      await loadUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to ${confirmAction.type.toLowerCase()} user.`,
      );
    } finally {
      setProcessingAction(false);
    }
  }

  function handleRoleChange(user: AdminUser, role: string) {
    if (!role || user.roles.includes(role)) {
      return;
    }

    setConfirmRoleChange({
      user,
      newRole: role,
    });
  }

  async function handleConfirmRoleChange() {
    if (!confirmRoleChange) return;

    try {
      setProcessingId(confirmRoleChange.user.id);
      setError("");

      await assignUserRole(
        confirmRoleChange.user.id,
        confirmRoleChange.newRole,
      );

      setConfirmRoleChange(null);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update role.");
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
        statusFilter === "ALL" || user.approvalStatus === statusFilter;

      const matchesRole =
        roleFilter === "ALL" || user.roles.includes(roleFilter);

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, search, statusFilter, roleFilter]);

  const participantCount = users.filter((user) =>
    user.roles.includes("PARTICIPANT"),
  ).length;

  const instructorCount = users.filter((user) =>
    user.roles.includes("INSTRUCTOR"),
  ).length;

  const pendingCount = users.filter(
    (user) => user.approvalStatus === "PENDING",
  ).length;

  if (loading) {
    return <LoadingState label="Loading users..." />;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <PageHeader
        title={<> User Management </>}
        description={
          <> Manage LMS users, registration approvals, and access roles. </>
        }
        eyebrow={<> Administration </>}
      />

      {/* ERROR */}
      {error && <Alert>{error}</Alert>}

      {/* SUMMARY */}
      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Total Users" value={users.length} />

        <SummaryCard label="Participants" value={participantCount} />

        <SummaryCard label="Instructors" value={instructorCount} />

        <SummaryCard label="Pending Approval" value={pendingCount} />
      </div>

      {/* FILTER */}
      <GlassCard className="p-4">
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
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </GlassCard>

      {/* USER TABLE */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <DataTable className="w-full text-left text-sm">
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
                const isProcessing = processingId === user.id;

                const isAdmin = user.roles.includes("ADMIN");

                return (
                  <tr key={user.id} className="hover:bg-slate-50">
                    {/* USER */}
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {user.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {user.email}
                      </p>
                    </td>

                    {/* EMPLOYEE NUMBER */}
                    <td className="px-5 py-4 text-slate-600">
                      {user.employeeNumber || "-"}
                    </td>

                    {/* ROLE */}
                    <td className="px-5 py-4">
                      {isAdmin ? (
                        <span className="font-medium text-slate-700">
                          ADMIN
                        </span>
                      ) : (
                        <select
                          value={user.roles[0] ?? ""}
                          disabled={isProcessing || processingAction}
                          onChange={(event) =>
                            handleRoleChange(user, event.target.value)
                          }
                          className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-semibold outline-none disabled:opacity-50"
                        >
                          <option value="PARTICIPANT">PARTICIPANT</option>

                          <option value="INSTRUCTOR">INSTRUCTOR</option>
                        </select>
                      )}
                    </td>

                    {/* SOURCE */}
                    <td className="px-5 py-4 text-slate-600">
                      {user.registrationSource}
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">
                      <StatusBadge status={user.approvalStatus} />
                    </td>

                    {/* REGISTERED */}
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    {/* ACTION */}
                    <td className="px-5 py-4">
                      {user.approvalStatus === "PENDING" ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={isProcessing || processingAction}
                            onClick={() => handleApprove(user.id, user.name)}
                            className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            Approve
                          </button>

                          <button
                            type="button"
                            disabled={isProcessing || processingAction}
                            onClick={() => handleReject(user.id, user.name)}
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </DataTable>

          {filteredUsers.length === 0 && (
            <div className="p-10 text-center text-sm text-slate-500">
              No users found.
            </div>
          )}
        </div>
      </GlassCard>

      {/* APPROVE / REJECT CONFIRMATION */}
      <ConfirmModal
        open={confirmAction !== null}
        title={
          confirmAction?.type === "APPROVE" ? "Approve User?" : "Reject User?"
        }
        message={
          confirmAction
            ? confirmAction.type === "APPROVE"
              ? `Are you sure you want to approve "${confirmAction.userName}"? The user will be able to sign in after approval.`
              : `Are you sure you want to reject "${confirmAction.userName}"?`
            : ""
        }
        confirmLabel={confirmAction?.type === "APPROVE" ? "Approve" : "Reject"}
        variant={confirmAction?.type === "APPROVE" ? "success" : "danger"}
        loading={processingAction}
        onCancel={() => {
          if (!processingAction) {
            setConfirmAction(null);
          }
        }}
        onConfirm={handleConfirmAction}
      />

      {/* ROLE CHANGE CONFIRMATION */}
      <ConfirmModal
        open={confirmRoleChange !== null}
        title="Change User Role?"
        message={
          confirmRoleChange
            ? `Are you sure you want to change "${confirmRoleChange.user.name}" from ${confirmRoleChange.user.roles[0]} to ${confirmRoleChange.newRole}? This will change the user's access permissions.`
            : ""
        }
        confirmLabel="Change Role"
        variant="danger"
        loading={
          confirmRoleChange ? processingId === confirmRoleChange.user.id : false
        }
        onCancel={() => {
          if (!processingId) {
            setConfirmRoleChange(null);
          }
        }}
        onConfirm={handleConfirmRoleChange}
      />
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
