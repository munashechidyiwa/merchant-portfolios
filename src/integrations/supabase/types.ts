export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alert_settings: {
        Row: {
          created_at: string | null
          description: string | null
          email_notification: boolean | null
          enabled: boolean | null
          id: string
          name: string
          priority: string | null
          threshold_value: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          email_notification?: boolean | null
          enabled?: boolean | null
          id?: string
          name: string
          priority?: string | null
          threshold_value?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          email_notification?: boolean | null
          enabled?: boolean | null
          id?: string
          name?: string
          priority?: string | null
          threshold_value?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      alerts: {
        Row: {
          action_required: string | null
          auto_generated: boolean | null
          created_at: string | null
          due_date: string | null
          id: string
          merchant: string
          message: string
          officer: string
          severity: string
          status: string | null
          terminal_id: string | null
          timestamp: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          action_required?: string | null
          auto_generated?: boolean | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          merchant: string
          message: string
          officer: string
          severity: string
          status?: string | null
          terminal_id?: string | null
          timestamp?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          action_required?: string | null
          auto_generated?: boolean | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          merchant?: string
          message?: string
          officer?: string
          severity?: string
          status?: string | null
          terminal_id?: string | null
          timestamp?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      communications: {
        Row: {
          auto_generated: boolean | null
          created_at: string | null
          date: string | null
          follow_up_date: string | null
          id: string
          inactive_days: number | null
          merchant_id: string | null
          merchant_name: string
          notes: string | null
          officer: string
          officer_email: string | null
          priority: string | null
          status: string | null
          subject: string
          terminal_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          auto_generated?: boolean | null
          created_at?: string | null
          date?: string | null
          follow_up_date?: string | null
          id?: string
          inactive_days?: number | null
          merchant_id?: string | null
          merchant_name: string
          notes?: string | null
          officer: string
          officer_email?: string | null
          priority?: string | null
          status?: string | null
          subject: string
          terminal_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          auto_generated?: boolean | null
          created_at?: string | null
          date?: string | null
          follow_up_date?: string | null
          id?: string
          inactive_days?: number | null
          merchant_id?: string | null
          merchant_name?: string
          notes?: string | null
          officer?: string
          officer_email?: string | null
          priority?: string | null
          status?: string | null
          subject?: string
          terminal_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      merchants: {
        Row: {
          account_cif: string
          branch_code: string | null
          business_unit: string | null
          category: string | null
          consolidated_usd: number | null
          contribution_percentage: number | null
          created_at: string | null
          id: string
          last_activity: string | null
          location: string | null
          merchant_name: string
          month_to_date_total: number | null
          sector: string | null
          status: string | null
          support_officer: string
          terminal_id: string
          updated_at: string | null
          usd_sales: number | null
          zwg_sales: number | null
        }
        Insert: {
          account_cif: string
          branch_code?: string | null
          business_unit?: string | null
          category?: string | null
          consolidated_usd?: number | null
          contribution_percentage?: number | null
          created_at?: string | null
          id?: string
          last_activity?: string | null
          location?: string | null
          merchant_name: string
          month_to_date_total?: number | null
          sector?: string | null
          status?: string | null
          support_officer: string
          terminal_id: string
          updated_at?: string | null
          usd_sales?: number | null
          zwg_sales?: number | null
        }
        Update: {
          account_cif?: string
          branch_code?: string | null
          business_unit?: string | null
          category?: string | null
          consolidated_usd?: number | null
          contribution_percentage?: number | null
          created_at?: string | null
          id?: string
          last_activity?: string | null
          location?: string | null
          merchant_name?: string
          month_to_date_total?: number | null
          sector?: string | null
          status?: string | null
          support_officer?: string
          terminal_id?: string
          updated_at?: string | null
          usd_sales?: number | null
          zwg_sales?: number | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          setting_key: string
          setting_value: Json | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: Json | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      terminals: {
        Row: {
          created_at: string | null
          id: string
          installation_date: string | null
          last_transaction: string | null
          location: string | null
          merchant_id: string | null
          merchant_name: string
          model: string | null
          officer: string
          serial_number: string | null
          status: string | null
          terminal_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          installation_date?: string | null
          last_transaction?: string | null
          location?: string | null
          merchant_id?: string | null
          merchant_name: string
          model?: string | null
          officer: string
          serial_number?: string | null
          status?: string | null
          terminal_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          installation_date?: string | null
          last_transaction?: string | null
          location?: string | null
          merchant_id?: string | null
          merchant_name?: string
          model?: string | null
          officer?: string
          serial_number?: string | null
          status?: string | null
          terminal_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          id: string
          ip_address: string | null
          login_time: string | null
          logout_time: string | null
          session_duration: unknown | null
          user_agent: string | null
          user_email: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          login_time?: string | null
          logout_time?: string | null
          session_duration?: unknown | null
          user_agent?: string | null
          user_email: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          login_time?: string | null
          logout_time?: string | null
          session_duration?: unknown | null
          user_agent?: string | null
          user_email?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
