"use client";

import { useParams } from "next/navigation";
import { RoleForm } from "@/components/portal/role-form";

export default function EditRolePage() {
  const { id } = useParams<{ id: string }>();
  return <RoleForm roleId={id} />;
}
