/**
 * ORB-LITE Database Types (PostgreSQL / Supabase)
 * Mapeo estricto de las 14 tablas del sistema según la arquitectura oficial.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// 1. public.customers
export interface CustomerRow {
  id: string; // uuid
  customer_number: number; // int
  full_name: string; // text
  phone: string | null; // text
  email: string | null; // text
  contact: Json | null; // jsonb
  billing: Json | null; // jsonb
  orders_count: number | null; // int
  total_spent: number | null; // numeric
  last_order_id: string | null; // text
  constancia_path: string | null; // text
  constancia_file_name: string | null; // text
  constancia_url: string | null; // text
  constancia_uploaded_at: string | null; // timestamptz
  created_at?: string | null; // timestamptz
  updated_at?: string | null; // timestamptz
}

// 2. public.solicitudes
export interface SolicitudRow {
  id: string; // uuid
  order_id: string; // text
  customer_number: number | null; // int
  full_name: string; // text
  phone: string; // text
  email: string; // text
  items: Json; // jsonb
  shipping_label: string | null; // text
  wants_invoice: boolean; // bool
  billing: Json | null; // jsonb
  total: number; // numeric
  status: "pendiente" | "vendido" | "no_vendido" | string; // text
  notes: string | null; // text
  created_at?: string | null; // timestamptz
  updated_at?: string | null; // timestamptz
}

// 3. public.crm_access_codes
export interface CrmAccessCodeRow {
  id: string; // uuid
  email: string; // text
  code_hash: string; // text
  expires_at: string; // timestamptz
  used_at: string | null; // timestamptz
  created_at?: string | null; // timestamptz
}

// 4. public.renovaciones
export interface RenovacionRow {
  id: string; // uuid
  customer_number: number | null; // int
  customer_name: string; // text
  customer_email: string | null; // text
  customer_phone: string | null; // text
  variant_id: string | null; // text
  variant_name: string | null; // text
  platform: string | null; // text
  renewal_kind: string | null; // text
  renewal_period: string | null; // text
  unit_name: string | null; // text
  imei: string | null; // text
  iccid: string | null; // text
  sim_phone: string | null; // text
  amount: number | null; // numeric
  renewal_date: string | null; // date
  status: string; // text
  notices: Json | null; // jsonb
  created_at?: string | null; // timestamptz
  updated_at?: string | null; // timestamptz
}

// 5. public.demo_users
export interface DemoUserRow {
  id: string; // uuid
  customer_number: number | null; // int
  full_name: string; // text
  company: string | null; // text
  platform: string; // text
  username: string; // text
  password: string; // text
  notes: string | null; // text
  created_at?: string | null; // timestamptz
}

// 6. public.demo_requests
export interface DemoRequestRow {
  id: string; // uuid
  first_name: string; // text
  last_name: string | null; // text
  phone: string; // text
  email: string; // text
  company: string | null; // text
  platform: string; // text
  units: string | null; // text
  message: string | null; // text
  status: string; // text
  demo_user_id: string | null; // uuid
  demo_username: string | null; // text
  sent_at: string | null; // timestamptz
  created_at?: string | null; // timestamptz
}

// 7. public.hardware_command_definitions
export interface HardwareCommandDefinitionRow {
  id: string; // uuid
  hardware_brand: string; // text
  command_name: string; // text
  command_code: string; // text
  description: string | null; // text
  requires_input: boolean; // bool
  input_label: string | null; // text
  created_at?: string | null; // timestamptz
}

// 8. public.user_routes
export interface UserRouteRow {
  id: string; // text
  user_id: number; // bigint
  user_name: string | null; // text
  name: string; // text
  color: string | null; // text
  points: Json | null; // jsonb
  route_stops: Json | null; // jsonb
  origin: string | null; // text
  addresses: Json | null; // jsonb
  distance_meters: number | null; // double precision
  duration_seconds: number | null; // double precision
  share_token: string | null; // text
  stops: Json | null; // jsonb
  report_email: string | null; // text
  report_sent_at: string | null; // timestamptz
  created_at?: string | null; // timestamptz
  updated_at?: string | null; // timestamptz
}

// 9. public.geofences
export interface GeofenceRow {
  id: string; // uuid
  name: string; // text
  description: string | null; // text
  color: string | null; // text
  type: string | null; // text
  geometry: Json; // jsonb
  created_by_id: string | null; // text
  created_by_name: string | null; // text
  created_at?: string | null; // timestamptz
  updated_at?: string | null; // timestamptz
}

// 10. public.shared_links
export interface SharedLinkRow {
  id: string; // uuid
  name: string | null; // text
  token: string; // text
  unit_id: string | null; // text
  route_id: string | null; // text -> user_routes.id
  expires_at: string | null; // timestamptz
  is_active: boolean; // bool
  created_by_id: string | null; // text
  created_by_name: string | null; // text
  created_at?: string | null; // timestamptz
}

// 11. public.user_route_assignments
export interface UserRouteAssignmentRow {
  id: string; // uuid
  route_id: string; // text -> user_routes.id
  assigned_user_id: string; // text
  assigned_at: string | null; // timestamptz
}

// 12. public.geofence_assignments
export interface GeofenceAssignmentRow {
  id: string; // uuid
  geofence_id: string; // uuid -> geofences.id
  assigned_user_id: string; // text
  assigned_at: string | null; // timestamptz
}

// 13. public.shared_link_assignments
export interface SharedLinkAssignmentRow {
  id: string; // uuid
  shared_link_id: string; // uuid -> shared_links.id
  assigned_user_id: string; // text
  assigned_at: string | null; // timestamptz
}

// 14. public.platform_users
export interface PlatformUserRow {
  id: string; // uuid
  wialon_user_id: number; // bigint
  wialon_username: string; // text
  host: string; // text
  customer_number: number | null; // int
  full_name: string | null; // text
  email: string | null; // text
  phone: string | null; // text
  company: string | null; // text
  role: string; // text ('admin' | 'operador' | 'cliente' | 'subusuario')
  is_parent: boolean; // bool
  parent_user_id: number | null; // bigint
  shared_permissions: Json | null; // jsonb
  custom_settings: Json | null; // jsonb
  created_at?: string | null; // timestamptz
  updated_at?: string | null; // timestamptz
}

/**
 * Mapa centralizado de tablas para consultas tipadas
 */
export interface SystemDatabaseTables {
  customers: CustomerRow;
  solicitudes: SolicitudRow;
  crm_access_codes: CrmAccessCodeRow;
  renovaciones: RenovacionRow;
  demo_users: DemoUserRow;
  demo_requests: DemoRequestRow;
  hardware_command_definitions: HardwareCommandDefinitionRow;
  user_routes: UserRouteRow;
  geofences: GeofenceRow;
  shared_links: SharedLinkRow;
  user_route_assignments: UserRouteAssignmentRow;
  geofence_assignments: GeofenceAssignmentRow;
  shared_link_assignments: SharedLinkAssignmentRow;
  platform_users: PlatformUserRow;
}
