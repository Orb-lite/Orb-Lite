export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      platform_users: {
        Row: {
          company: string | null;
          created_at: string | null;
          customer_number: number | null;
          custom_settings: Json | null;
          email: string | null;
          full_name: string | null;
          host: string;
          id: string;
          is_parent: boolean;
          parent_user_id: number | null;
          phone: string | null;
          role: string;
          shared_permissions: Json | null;
          updated_at: string | null;
          wialon_user_id: number;
          wialon_username: string;
        };
        Insert: {
          company?: string | null;
          created_at?: string | null;
          customer_number?: number | null;
          custom_settings?: Json | null;
          email?: string | null;
          full_name?: string | null;
          host: string;
          id?: string;
          is_parent?: boolean;
          parent_user_id?: number | null;
          phone?: string | null;
          role?: string;
          shared_permissions?: Json | null;
          updated_at?: string | null;
          wialon_user_id: number;
          wialon_username: string;
        };
        Update: {
          company?: string | null;
          created_at?: string | null;
          customer_number?: number | null;
          custom_settings?: Json | null;
          email?: string | null;
          full_name?: string | null;
          host?: string;
          id?: string;
          is_parent?: boolean;
          parent_user_id?: number | null;
          phone?: string | null;
          role?: string;
          shared_permissions?: Json | null;
          updated_at?: string | null;
          wialon_user_id?: number;
          wialon_username?: string;
        };
        Relationships: [];
      };

      crm_access_codes: {
        Row: {
          code_hash: string;
          created_at: string;
          email: string;
          expires_at: string;
          id: string;
          used_at: string | null;
        };
        Insert: {
          code_hash: string;
          created_at?: string;
          email: string;
          expires_at: string;
          id?: string;
          used_at?: string | null;
        };
        Update: {
          code_hash?: string;
          created_at?: string;
          email?: string;
          expires_at?: string;
          id?: string;
          used_at?: string | null;
        };
        Relationships: [];
      };
      customers: {
        Row: {
          billing: Json | null;
          constancia_file_name: string | null;
          constancia_path: string | null;
          constancia_uploaded_at: string | null;
          constancia_url: string | null;
          contact: Json | null;
          created_at: string;
          customer_number: number;
          email: string | null;
          full_name: string;
          id: string;
          last_order_id: string | null;
          orders_count: number;
          phone: string;
          total_spent: number;
          updated_at: string;
        };
        Insert: {
          billing?: Json | null;
          constancia_file_name?: string | null;
          constancia_path?: string | null;
          constancia_uploaded_at?: string | null;
          constancia_url?: string | null;
          contact?: Json | null;
          created_at?: string;
          customer_number: number;
          email?: string | null;
          full_name: string;
          id?: string;
          last_order_id?: string | null;
          orders_count?: number;
          phone: string;
          total_spent?: number;
          updated_at?: string;
        };
        Update: {
          billing?: Json | null;
          constancia_file_name?: string | null;
          constancia_path?: string | null;
          constancia_uploaded_at?: string | null;
          constancia_url?: string | null;
          contact?: Json | null;
          created_at?: string;
          customer_number?: number;
          email?: string | null;
          full_name?: string;
          id?: string;
          last_order_id?: string | null;
          orders_count?: number;
          phone?: string;
          total_spent?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      demo_requests: {
        Row: {
          company: string | null;
          created_at: string;
          demo_user_id: string | null;
          demo_username: string | null;
          email: string;
          first_name: string;
          id: string;
          last_name: string;
          message: string | null;
          notes: string | null;
          phone: string;
          platform: string;
          sent_at: string | null;
          status: string;
          units: string | null;
          updated_at: string;
        };
        Insert: {
          company?: string | null;
          created_at?: string;
          demo_user_id?: string | null;
          demo_username?: string | null;
          email: string;
          first_name: string;
          id?: string;
          last_name: string;
          message?: string | null;
          notes?: string | null;
          phone: string;
          platform?: string;
          sent_at?: string | null;
          status?: string;
          units?: string | null;
          updated_at?: string;
        };
        Update: {
          company?: string | null;
          created_at?: string;
          demo_user_id?: string | null;
          demo_username?: string | null;
          email?: string;
          first_name?: string;
          id?: string;
          last_name?: string;
          message?: string | null;
          notes?: string | null;
          phone?: string;
          platform?: string;
          sent_at?: string | null;
          status?: string;
          units?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      demo_users: {
        Row: {
          company: string | null;
          created_at: string;
          customer_number: number | null;
          full_name: string;
          id: string;
          notes: string | null;
          password: string;
          platform: string;
          updated_at: string;
          username: string;
        };
        Insert: {
          company?: string | null;
          created_at?: string;
          customer_number?: number | null;
          full_name: string;
          id?: string;
          notes?: string | null;
          password?: string;
          platform?: string;
          updated_at?: string;
          username: string;
        };
        Update: {
          company?: string | null;
          created_at?: string;
          customer_number?: number | null;
          full_name?: string;
          id?: string;
          notes?: string | null;
          password?: string;
          platform?: string;
          updated_at?: string;
          username?: string;
        };
        Relationships: [];
      };
      geofences: {
        Row: {
          color: string;
          created_at: string;
          created_by_id: string;
          created_by_name: string | null;
          description: string | null;
          geometry: Json;
          id: string;
          name: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          color?: string;
          created_at?: string;
          created_by_id: string;
          created_by_name?: string | null;
          description?: string | null;
          geometry: Json;
          id?: string;
          name: string;
          type?: string;
          updated_at?: string;
        };
        Update: {
          color?: string;
          created_at?: string;
          created_by_id?: string;
          created_by_name?: string | null;
          description?: string | null;
          geometry?: Json;
          id?: string;
          name?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      geofence_assignments: {
        Row: {
          assigned_at: string;
          assigned_user_id: string;
          geofence_id: string;
          id: string;
        };
        Insert: {
          assigned_at?: string;
          assigned_user_id: string;
          geofence_id: string;
          id?: string;
        };
        Update: {
          assigned_at?: string;
          assigned_user_id?: string;
          geofence_id?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "geofence_assignments_geofence_id_fkey";
            columns: ["geofence_id"];
            isOneToOne: false;
            referencedRelation: "geofences";
            referencedColumns: ["id"];
          },
        ];
      };
      hardware_command_definitions: {
        Row: {
          command_code: string;
          command_name: string;
          created_at: string;
          description: string | null;
          hardware_brand: string;
          id: string;
          input_label: string | null;
          requires_input: boolean | null;
        };
        Insert: {
          command_code: string;
          command_name: string;
          created_at?: string;
          description?: string | null;
          hardware_brand: string;
          id?: string;
          input_label?: string | null;
          requires_input?: boolean | null;
        };
        Update: {
          command_code?: string;
          command_name?: string;
          created_at?: string;
          description?: string | null;
          hardware_brand?: string;
          id?: string;
          input_label?: string | null;
          requires_input?: boolean | null;
        };
        Relationships: [];
      };
      renovaciones: {
        Row: {
          amount: number;
          created_at: string;
          customer_email: string | null;
          customer_name: string | null;
          customer_number: number | null;
          customer_phone: string | null;
          iccid: string | null;
          id: string;
          imei: string | null;
          last_order_id: string | null;
          last_paid_at: string | null;
          notices: Json;
          platform: string | null;
          renewal_date: string;
          renewal_kind: string;
          renewal_period: string;
          sim_phone: string | null;
          status: string;
          unit_name: string | null;
          updated_at: string;
          variant_id: string;
          variant_name: string;
        };
        Insert: {
          amount?: number;
          created_at?: string;
          customer_email?: string | null;
          customer_name?: string | null;
          customer_number?: number | null;
          customer_phone?: string | null;
          iccid?: string | null;
          id?: string;
          imei?: string | null;
          last_order_id?: string | null;
          last_paid_at?: string | null;
          notices?: Json;
          platform?: string | null;
          renewal_date: string;
          renewal_kind?: string;
          renewal_period?: string;
          sim_phone?: string | null;
          status?: string;
          unit_name?: string | null;
          updated_at?: string;
          variant_id: string;
          variant_name: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          customer_email?: string | null;
          customer_name?: string | null;
          customer_number?: number | null;
          customer_phone?: string | null;
          iccid?: string | null;
          id?: string;
          imei?: string | null;
          last_order_id?: string | null;
          last_paid_at?: string | null;
          notices?: Json;
          platform?: string | null;
          renewal_date?: string;
          renewal_kind?: string;
          renewal_period?: string;
          sim_phone?: string | null;
          status?: string;
          unit_name?: string | null;
          updated_at?: string;
          variant_id?: string;
          variant_name?: string;
        };
        Relationships: [];
      };
      shared_links: {
        Row: {
          created_at: string;
          created_by_id: string | null;
          created_by_name: string | null;
          expires_at: string | null;
          id: string;
          is_active: boolean;
          name: string | null;
          route_id: string | null;
          token: string | null;
          unit_id: string | null;
        };
        Insert: {
          created_at?: string;
          created_by_id?: string | null;
          created_by_name?: string | null;
          expires_at?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string | null;
          route_id?: string | null;
          token?: string | null;
          unit_id?: string | null;
        };
        Update: {
          created_at?: string;
          created_by_id?: string | null;
          created_by_name?: string | null;
          expires_at?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string | null;
          route_id?: string | null;
          token?: string | null;
          unit_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "shared_links_route_id_fkey";
            columns: ["route_id"];
            isOneToOne: false;
            referencedRelation: "user_routes";
            referencedColumns: ["id"];
          },
        ];
      };
      shared_link_assignments: {
        Row: {
          assigned_at: string;
          assigned_user_id: string;
          id: string;
          shared_link_id: string;
        };
        Insert: {
          assigned_at?: string;
          assigned_user_id: string;
          id?: string;
          shared_link_id: string;
        };
        Update: {
          assigned_at?: string;
          assigned_user_id?: string;
          id?: string;
          shared_link_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "shared_link_assignments_shared_link_id_fkey";
            columns: ["shared_link_id"];
            isOneToOne: false;
            referencedRelation: "shared_links";
            referencedColumns: ["id"];
          },
        ];
      };
      solicitudes: {
        Row: {
          billing: Json | null;
          created_at: string;
          customer_number: number | null;
          email: string | null;
          full_name: string | null;
          id: string;
          items: Json;
          notes: string | null;
          order_id: string;
          phone: string | null;
          shipping_label: string | null;
          status: string;
          total: number;
          updated_at: string;
          wants_invoice: boolean;
        };
        Insert: {
          billing?: Json | null;
          created_at?: string;
          customer_number?: number | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          items?: Json;
          notes?: string | null;
          order_id: string;
          phone?: string | null;
          shipping_label?: string | null;
          status?: string;
          total?: number;
          updated_at?: string;
          wants_invoice?: boolean;
        };
        Update: {
          billing?: Json | null;
          created_at?: string;
          customer_number?: number | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          items?: Json;
          notes?: string | null;
          order_id?: string;
          phone?: string | null;
          shipping_label?: string | null;
          status?: string;
          total?: number;
          updated_at?: string;
          wants_invoice?: boolean;
        };
        Relationships: [];
      };
      user_routes: {
        Row: {
          addresses: Json | null;
          color: string;
          created_at: string;
          distance_meters: number | null;
          duration_seconds: number | null;
          id: string;
          name: string;
          origin: string | null;
          points: Json;
          report_email: string | null;
          report_sent_at: string | null;
          route_stops: Json | null;
          share_token: string | null;
          stops: Json | null;
          user_id: number;
          user_name: string | null;
        };
        Insert: {
          addresses?: Json | null;
          color?: string;
          created_at?: string;
          distance_meters?: number | null;
          duration_seconds?: number | null;
          id: string;
          name: string;
          origin?: string | null;
          points?: Json;
          report_email?: string | null;
          report_sent_at?: string | null;
          route_stops?: Json | null;
          share_token?: string | null;
          stops?: Json | null;
          user_id: number;
          user_name?: string | null;
        };
        Update: {
          addresses?: Json | null;
          color?: string;
          created_at?: string;
          distance_meters?: number | null;
          duration_seconds?: number | null;
          id?: string;
          name?: string;
          origin?: string | null;
          points?: Json;
          report_email?: string | null;
          report_sent_at?: string | null;
          route_stops?: Json | null;
          share_token?: string | null;
          stops?: Json | null;
          user_id?: number;
          user_name?: string | null;
        };
        Relationships: [];
      };
      user_route_assignments: {
        Row: {
          assigned_at: string;
          assigned_user_id: string;
          id: string;
          route_id: string;
        };
        Insert: {
          assigned_at?: string;
          assigned_user_id: string;
          id?: string;
          route_id: string;
        };
        Update: {
          assigned_at?: string;
          assigned_user_id?: string;
          id?: string;
          route_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_route_assignments_route_id_fkey";
            columns: ["route_id"];
            isOneToOne: false;
            referencedRelation: "user_routes";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
