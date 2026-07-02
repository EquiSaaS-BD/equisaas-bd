"use client";

import { useMemo, useState } from "react";
import { Building2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEPARTMENT_OPTIONS, getDepartmentTitle } from "@/lib/catalog";
import { saveDepartmentSelection } from "@/lib/firestore/lms";

export function DepartmentActivationPanel({
  user,
  profile,
  copy,
  title,
  description,
  saveSuccessText = "",
  onSaved = null,
}) {
  const [departmentId, setDepartmentId] = useState(profile?.departmentId || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const selectedTitle = useMemo(() => getDepartmentTitle(departmentId), [departmentId]);

  const handleSave = async () => {
    if (!user?.uid || !departmentId || saving) return;
    setSaving(true);
    setMessage("");

    try {
      await saveDepartmentSelection(user, departmentId);
      setMessage(
        saveSuccessText ||
          copy(
            `${selectedTitle} has been saved. Your learning routes will open automatically now.`,
            `${selectedTitle} সংরক্ষণ হয়েছে। এখন আপনার learning route নিজে থেকেই খুলে যাবে।`,
          ),
      );
      onSaved?.(departmentId);
    } catch (error) {
      setMessage(
        error?.message ||
          copy(
            "The department could not be saved right now. Please try once more.",
            "এই মুহূর্তে department save করা যায়নি। আবার চেষ্টা করুন।",
          ),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="bg-card/80 backdrop-blur-xl border shadow-xl rounded-[2rem]">
      <CardHeader className="space-y-4">
        <Badge variant="subtle" className="w-fit rounded-full px-4 py-1.5 text-sm">
          {copy("Department required", "ডিপার্টমেন্ট প্রয়োজন")}
        </Badge>
        <div className="space-y-2">
          <CardTitle>{title || copy("Choose your department first", "আগে আপনার ডিপার্টমেন্ট বেছে নিন")}</CardTitle>
          <CardDescription className="text-base leading-7">
            {description ||
              copy(
                "One department opens your course path, lessons, proof tasks, mentors, and announcements.",
                "একটি department বেছে নিলেই course path, lesson, proof task, mentor, আর announcement খুলে যাবে।",
              )}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-[1.5rem] border bg-background/70 p-5">
          <div className="space-y-2">
            <Label htmlFor="inline-department-select">{copy("Department", "ডিপার্টমেন্ট")}</Label>
            <Select value={departmentId} onValueChange={setDepartmentId}>
              <SelectTrigger id="inline-department-select">
                <SelectValue placeholder={copy("Select a department", "একটি ডিপার্টমেন্ট নির্বাচন করুন")} />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENT_OPTIONS.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button className="mt-4 w-full" disabled={!departmentId || saving} onClick={handleSave}>
            <Building2 className="h-4 w-4" />
            {saving
              ? copy("Saving department...", "ডিপার্টমেন্ট সংরক্ষণ হচ্ছে...")
              : copy("Save department", "ডিপার্টমেন্ট সংরক্ষণ করুন")}
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {[
            copy("Choose one department only.", "একবারে একটি department-ই বেছে নিন।"),
            copy("Your lessons and tasks will align automatically.", "আপনার lesson ও task নিজে থেকেই align হবে।"),
            copy("You can continue from this page right after saving.", "Save করার পর এই page থেকেই চালিয়ে যেতে পারবেন।"),
          ].map((item) => (
            <div key={item} className="rounded-[1.5rem] border bg-background/70 p-4 text-sm leading-6 text-muted-foreground">
              {item}
            </div>
          ))}
        </div>

        {message ? (
          <div className="flex items-start gap-3 rounded-[1.5rem] border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p>{message}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
