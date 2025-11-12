// src/components/admin/TagRoleDialog.js
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TagRoleDialog({ userId, currentRole }) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(currentRole || "");
  const [loading, setLoading] = useState(false);

  const roles = [
    "customer",
    "distributor",
    "partner",
    "service_agent",
    "unknown",
  ];

  const handleSave = async () => {
    if (!role || !userId) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/users/${userId}/tag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        alert("Failed to update role");
      }
    } catch (err) {
      console.error(err);
      alert("Error");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant={currentRole ? "outline" : "default"}
        onClick={() => setOpen(true)}
      >
        {currentRole ? (
          <>
            <Badge className="mr-2 capitalize">{currentRole}</Badge>
            Edit
          </>
        ) : (
          "Tag Role"
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tag User Role</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium block mb-2">
                Select Role
              </label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r} value={r}>
                      <span className="capitalize">{r.replace("_", " ")}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading || !role}>
              {loading ? "Saving..." : "Save Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
