// src/lib/unit-share.types.ts
export interface SharedUnitLink {
  id: string;
  token: string;
  unitName: string;
  clientName?: string | null;
  clientPhone?: string | null;
  notes?: string | null;
  status: "active" | "expired" | "revoked";
  expiresAt: string;
  viewCount?: number;
}
