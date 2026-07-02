"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ShieldCheck, UserMinus } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { adjustUserPoints, removeManagedUser, updateUserAccess } from "@/lib/firestore/lms";
import { getDepartmentTitle, getPrimaryRole, getRoleList, roleLabel, roleLabels, STATUS_OPTIONS } from "@/lib/catalog";

const getSelectedUser = (users, userId) => users.find((item) => item.id === userId) || null;
const SCOPED_ROLES = ["department_head", "mentor", "member"];

export function PeopleManagementPanel({
  actor,
  activeDepartmentId,
  users,
  rosterUsers,
  isSuperAdmin,
  assignableRoles,
  accessForm,
  setAccessForm,
  departmentOptions,
  onWorkspaceReload,
  runAction,
  confirmAndRun,
}) {
  const { copy } = useLocale();
  const [pointsForm, setPointsForm] = useState({
    targetUserId: "",
    nextTotalPoints: "",
    reason: "",
  });

  const accessTarget = useMemo(
    () => getSelectedUser(users, accessForm.targetUserId),
    [accessForm.targetUserId, users],
  );
  const pointsTarget = useMemo(
    () => getSelectedUser(users, pointsForm.targetUserId),
    [pointsForm.targetUserId, users],
  );
  const selectedAccessRoles = useMemo(
    () => getRoleList(accessForm.roles),
    [accessForm.roles],
  );
  const primaryAccessRole = getPrimaryRole(selectedAccessRoles);
  const roleNeedsDepartment = selectedAccessRoles.some((roleId) => SCOPED_ROLES.includes(roleId));
  const accessDepartmentValue = accessForm.departmentId === ""
    ? ""
    : accessForm.departmentId || activeDepartmentId || departmentOptions[0]?.id || "";
  const accessTargetRoleLabels = accessTarget ? roleLabels(accessTarget) : [];
  const pointsTargetRoleLabels = pointsTarget ? roleLabels(pointsTarget) : [];

  const toggleRoleSelection = (roleId) => {
    setAccessForm((current) => {
      const currentRoles = getRoleList(current.roles);
      const hasRoleSelected = currentRoles.includes(roleId);
      const nextRoles = hasRoleSelected
        ? currentRoles.filter((item) => item !== roleId)
        : [...currentRoles, roleId];

      return {
        ...current,
        roles: getRoleList(nextRoles.length ? nextRoles : currentRoles),
      };
    });
  };

  useEffect(() => {
    if (!pointsTarget) return;
    setPointsForm((current) => ({
      ...current,
      nextTotalPoints: String(Number(pointsTarget.totalPoints || 0)),
    }));
  }, [pointsTarget?.id]);

  useEffect(() => {
    if (!accessTarget) return;
    setAccessForm((current) => ({
      ...current,
      roles: getRoleList(accessTarget),
      status: accessTarget.status || "active",
      departmentId: accessTarget.departmentId || "",
    }));
  }, [accessTarget?.id, setAccessForm]);

  const resetAccessForm = () => {
    setAccessForm({
      targetUserId: "",
      roles: [assignableRoles[0] || "member"],
      status: "active",
      departmentId: activeDepartmentId,
    });
  };

  const resetPointsForm = () => {
    setPointsForm({
      targetUserId: "",
      nextTotalPoints: "",
      reason: "",
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-6">
        <Card className="rounded-[1.75rem] border border-border/50 bg-background/85">
          <CardHeader>
            <CardTitle>{copy("Update user access", "ইউজার অ্যাকসেস আপডেট করুন")}</CardTitle>
            <CardDescription>
              {copy(
                "Put each registered user into the right role, department, and operating status.",
                "প্রতিটি রেজিস্টার্ড ইউজারকে সঠিক role, department, এবং status-এ রাখুন।",
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={accessForm.targetUserId || "none"}
              onValueChange={(value) => setAccessForm((current) => ({ ...current, targetUserId: value === "none" ? "" : value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={copy("Select user", "ইউজার নির্বাচন করুন")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{copy("Select user", "ইউজার নির্বাচন করুন")}</SelectItem>
                {users.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.displayName || item.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="space-y-2">
              <Label>{copy("Member status", "সদস্যের স্ট্যাটাস")}</Label>
              <Select value={accessForm.status} onValueChange={(value) => setAccessForm((current) => ({ ...current, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label>{copy("Assigned roles", "অ্যাসাইন করা রোল")}</Label>
                <p className="text-sm text-muted-foreground">
                  {copy(
                    "Select one or more roles. The highest authority among them becomes the primary role automatically.",
                    "একটি বা একাধিক role বেছে নিন। এগুলোর মধ্যে highest authority role স্বয়ংক্রিয়ভাবে primary role হবে।",
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {assignableRoles.map((item) => {
                  const selected = selectedAccessRoles.includes(item);
                  return (
                    <Button
                      key={item}
                      type="button"
                      variant={selected ? "default" : "outline"}
                      className="rounded-full"
                      aria-pressed={selected}
                      onClick={() => toggleRoleSelection(item)}
                    >
                      {roleLabel(item)}
                    </Button>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="subtle">
                  {copy("Primary role", "প্রাইমারি রোল")}: {roleLabel(primaryAccessRole)}
                </Badge>
                {selectedAccessRoles.map((roleId) => (
                  <Badge key={roleId} variant="outline">{roleLabel(roleId)}</Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="people-department-select">
                {copy("Department scope", "ডিপার্টমেন্ট স্কোপ")}
              </Label>
              <Select
                value={accessDepartmentValue === "" ? "none" : accessDepartmentValue}
                onValueChange={(value) => setAccessForm((current) => ({ ...current, departmentId: value === "none" ? "" : value }))}
              >
                <SelectTrigger id="people-department-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" disabled={roleNeedsDepartment}>
                    {roleNeedsDepartment
                      ? copy("Choose a department", "ডিপার্টমেন্ট বেছে নিন")
                      : copy("Keep unassigned", "Unassigned রাখুন")}
                  </SelectItem>
                  {departmentOptions.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {roleNeedsDepartment ? (
              <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>{copy("Department is required", "ডিপার্টমেন্ট আবশ্যক")}</AlertTitle>
                <AlertDescription>
                  {selectedAccessRoles.includes("mentor")
                    ? copy(
                        "A mentor must stay inside one department so reviews, lessons, and proof queues stay scoped correctly.",
                        "মেন্টরকে একটি department-এর মধ্যে রাখতে হবে যাতে review, lesson, এবং proof queue সঠিক scope-এ থাকে।",
                      )
                    : copy(
                        "This role must stay connected to a department workspace before it can operate normally.",
                        "এই role-টিকে কাজের আগে একটি department workspace-এর সাথে যুক্ত থাকতে হবে।",
                      )}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{copy("Leadership can stay global", "Leadership global থাকতে পারে")}</AlertTitle>
                <AlertDescription>
                  {copy(
                    "Directors and super admins may stay unassigned if they work across the full LMS.",
                    "Director এবং super admin পুরো LMS জুড়ে কাজ করলে unassigned থাকতে পারে।",
                  )}
                </AlertDescription>
              </Alert>
            )}

            {accessTarget ? (
              <div className="rounded-3xl border bg-background/80 p-4 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  {accessTargetRoleLabels.map((label) => (
                    <Badge key={label} variant="outline">{label}</Badge>
                  ))}
                  <Badge variant="outline">{accessTarget.status || "active"}</Badge>
                  <Badge variant="outline">{getDepartmentTitle(accessTarget.departmentId)}</Badge>
                </div>
                <p className="mt-3 font-medium">{accessTarget.displayName || accessTarget.email}</p>
                <p className="mt-1 break-all text-xs text-muted-foreground">{accessTarget.email}</p>
              </div>
            ) : null}

            <Button
              className="w-full"
              onClick={() =>
                runAction(
                  async () => {
                    await updateUserAccess({
                      targetUserId: accessForm.targetUserId,
                      actor,
                      values: { ...accessForm, roles: selectedAccessRoles, departmentId: accessDepartmentValue },
                    });
                    resetAccessForm();
                    await onWorkspaceReload();
                  },
                  copy("User access saved successfully.", "ইউজার অ্যাকসেস সফলভাবে সংরক্ষিত হয়েছে।"),
                )
              }
            >
              {copy("Save access", "অ্যাকসেস সংরক্ষণ করুন")}
            </Button>
          </CardContent>
        </Card>

        {isSuperAdmin ? (
          <Card className="rounded-[1.75rem] border border-border/50 bg-background/85">
            <CardHeader>
              <CardTitle>{copy("Direct points adjustment", "সরাসরি পয়েন্ট সমন্বয়")}</CardTitle>
              <CardDescription>
                {copy(
                  "Set any member's running total from one place. Every change still writes a traceable ledger record.",
                  "যে কোনো member-এর running total এখান থেকে সেট করুন। প্রতিটি change এখনও traceable ledger record তৈরি করবে।",
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={pointsForm.targetUserId || "none"}
                onValueChange={(value) => setPointsForm((current) => ({
                  ...current,
                  targetUserId: value === "none" ? "" : value,
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={copy("Select member", "মেম্বার নির্বাচন করুন")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{copy("Select member", "মেম্বার নির্বাচন করুন")}</SelectItem>
                  {users.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.displayName || item.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {pointsTarget ? (
                <div className="grid gap-4 rounded-3xl border bg-background/80 p-4 md:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {copy("Current total", "বর্তমান মোট")}
                    </p>
                    <p className="mt-2 text-2xl font-semibold">{Number(pointsTarget.totalPoints || 0)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {copy("Roles", "রোলসমূহ")}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {pointsTargetRoleLabels.map((label) => (
                        <Badge key={label} variant="outline">{label}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {copy("Department", "ডিপার্টমেন্ট")}
                    </p>
                    <p className="mt-2 text-sm font-medium">{getDepartmentTitle(pointsTarget.departmentId)}</p>
                  </div>
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="points-next-total">{copy("Set total points", "মোট পয়েন্ট সেট করুন")}</Label>
                  <Input
                    id="points-next-total"
                    type="number"
                    min="0"
                    value={pointsForm.nextTotalPoints}
                    onChange={(event) => setPointsForm((current) => ({ ...current, nextTotalPoints: event.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="points-reason">{copy("Reason", "কারণ")}</Label>
                  <Textarea
                    id="points-reason"
                    className="min-h-[82px]"
                    value={pointsForm.reason}
                    onChange={(event) => setPointsForm((current) => ({ ...current, reason: event.target.value }))}
                    placeholder={copy("Optional reason for the audit log", "Audit log-এর জন্য optional reason")}
                  />
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() =>
                  runAction(
                    async () => {
                      await adjustUserPoints({
                        actor,
                        targetUserId: pointsForm.targetUserId,
                        nextTotalPoints: pointsForm.nextTotalPoints,
                        reason: pointsForm.reason,
                      });
                      resetPointsForm();
                      await onWorkspaceReload();
                    },
                    copy("Total points updated successfully.", "মোট পয়েন্ট সফলভাবে আপডেট হয়েছে।"),
                  )
                }
              >
                {copy("Update total points", "মোট পয়েন্ট আপডেট করুন")}
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <Card className="rounded-[1.75rem] border border-border/50 bg-background/85">
        <CardHeader>
          <CardTitle>{copy("Department roster", "ডিপার্টমেন্ট রোস্টার")}</CardTitle>
          <CardDescription>
            {copy(
              "See who is active inside this workspace and how many approved points they currently hold.",
              "এই workspace-এ কারা active আছে এবং তাদের approved points কত, তা এখানে দেখুন।",
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {rosterUsers.length ? rosterUsers.map((item) => (
            <div key={item.id} className="rounded-3xl border bg-background/80 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">{item.displayName || item.email}</p>
                  <p className="break-all text-xs text-muted-foreground">{item.email}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {roleLabels(item).map((label) => (
                      <Badge key={`${item.id}-${label}`} variant="outline">{label}</Badge>
                    ))}
                    <Badge variant="outline">{item.status || "active"}</Badge>
                    <Badge variant="outline">{Number(item.totalPoints || 0)} {copy("points", "পয়েন্ট")}</Badge>
                  </div>
                </div>
                {isSuperAdmin ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      confirmAndRun(
                        copy(
                          "Remove this member from the active roster and unassign the department?",
                          "এই member-কে active roster থেকে সরিয়ে department unassign করতে চান?",
                        ),
                        async () => {
                          await removeManagedUser({ targetUserId: item.id, actor });
                          await onWorkspaceReload();
                        },
                        copy("Member removed from the active roster.", "মেম্বারকে active roster থেকে সরানো হয়েছে।"),
                      )
                    }
                  >
                    <UserMinus className="h-4 w-4" />
                    {copy("Remove", "সরান")}
                  </Button>
                ) : null}
              </div>
            </div>
          )) : (
            <p className="text-sm text-muted-foreground">
              {copy("No users mapped to this department yet.", "এখনও কোনো user এই department-এ map হয়নি।")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
