"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TagRoleDialog from "./TagRoleDialog.js";

export default function UserTable({ users }) {
  return (
    <div className="bg-white rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Messages</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>
                <div>
                  <p className="font-medium">User #{user._id.slice(-6)}</p>
                  <p className="text-sm text-gray-500">
                    {user.info.name || "Anonymous"}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                {user.finalRole ? (
                  <Badge className="capitalize">{user.finalRole}</Badge>
                ) : (
                  <Badge variant="secondary">unknown</Badge>
                )}
              </TableCell>
              <TableCell>{user.chatHistory.length}</TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <TagRoleDialog
                    userId={user._id}
                    currentRole={user.finalRole}
                  />
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/users/${user._id}`}>View Chat</Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
