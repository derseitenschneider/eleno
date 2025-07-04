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
      feature_flag_users: {
        Row: {
          flag_id: number | null
          id: number
          user_id: string | null
        }
        Insert: {
          flag_id?: number | null
          id?: number
          user_id?: string | null
        }
        Update: {
          flag_id?: number | null
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_flag_users_flag_id_fkey"
            columns: ["flag_id"]
            isOneToOne: false
            referencedRelation: "feature_flags"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          enabled: boolean | null
          flag_name: string
          id: number
        }
        Insert: {
          enabled?: boolean | null
          flag_name: string
          id?: number
        }
        Update: {
          enabled?: boolean | null
          flag_name?: string
          id?: number
        }
        Relationships: []
      }
      groups: {
        Row: {
          archive: boolean
          created_at: string
          dayOfLesson: Database["public"]["Enums"]["weekdays"] | null
          durationMinutes: number | null
          endOfLesson: string | null
          homework_sharing_authorized: boolean
          id: number
          location: string | null
          name: string
          startOfLesson: string | null
          students: Json[] | null
          user_id: string | null
        }
        Insert: {
          archive?: boolean
          created_at?: string
          dayOfLesson?: Database["public"]["Enums"]["weekdays"] | null
          durationMinutes?: number | null
          endOfLesson?: string | null
          homework_sharing_authorized?: boolean
          id?: number
          location?: string | null
          name: string
          startOfLesson?: string | null
          students?: Json[] | null
          user_id?: string | null
        }
        Update: {
          archive?: boolean
          created_at?: string
          dayOfLesson?: Database["public"]["Enums"]["weekdays"] | null
          durationMinutes?: number | null
          endOfLesson?: string | null
          homework_sharing_authorized?: boolean
          id?: number
          location?: string | null
          name?: string
          startOfLesson?: string | null
          students?: Json[] | null
          user_id?: string | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          created_at: string | null
          date: string | null
          expiration_base: string
          groupId: number | null
          homework: string | null
          homeworkKey: string
          id: number
          lessonContent: string | null
          studentId: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          expiration_base?: string
          groupId?: number | null
          homework?: string | null
          homeworkKey?: string
          id?: number
          lessonContent?: string | null
          studentId?: number | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          date?: string | null
          expiration_base?: string
          groupId?: number | null
          homework?: string | null
          homeworkKey?: string
          id?: number
          lessonContent?: string | null
          studentId?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_groupId_fkey"
            columns: ["groupId"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_studentId_fkey"
            columns: ["studentId"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      message_templates: {
        Row: {
          body: string
          id: number
          name: string
          subject: string
        }
        Insert: {
          body: string
          id?: number
          name: string
          subject: string
        }
        Update: {
          body?: string
          id?: number
          name?: string
          subject?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string | null
          created_at: string
          id: string
          recipient: string
          status: Database["public"]["Enums"]["message_status"]
          subject: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          recipient: string
          status?: Database["public"]["Enums"]["message_status"]
          subject?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          recipient?: string
          status?: Database["public"]["Enums"]["message_status"]
          subject?: string | null
        }
        Relationships: []
      }
      notes: {
        Row: {
          backgroundColor:
            | Database["public"]["Enums"]["background_colors"]
            | null
          created_at: string | null
          groupId: number | null
          id: number
          order: number
          studentId: number | null
          text: string | null
          title: string | null
          user_id: string
        }
        Insert: {
          backgroundColor?:
            | Database["public"]["Enums"]["background_colors"]
            | null
          created_at?: string | null
          groupId?: number | null
          id?: number
          order?: number
          studentId?: number | null
          text?: string | null
          title?: string | null
          user_id: string
        }
        Update: {
          backgroundColor?:
            | Database["public"]["Enums"]["background_colors"]
            | null
          created_at?: string | null
          groupId?: number | null
          id?: number
          order?: number
          studentId?: number | null
          text?: string | null
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_groupId_fkey"
            columns: ["groupId"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_studentId_fkey"
            columns: ["studentId"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_views: {
        Row: {
          action_taken: Database["public"]["Enums"]["notification_action_taken"]
          created_at: string
          id: number
          notification_id: number
          results: Json | null
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          action_taken: Database["public"]["Enums"]["notification_action_taken"]
          created_at?: string
          id?: number
          notification_id: number
          results?: Json | null
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          action_taken?: Database["public"]["Enums"]["notification_action_taken"]
          created_at?: string
          id?: number
          notification_id?: number
          results?: Json | null
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_views_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          active: boolean
          created_at: string
          display_frequency:
            | Database["public"]["Enums"]["notification_display_frequency"]
            | null
          expires_at: string | null
          id: number
          identifier: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          active?: boolean
          created_at?: string
          display_frequency?:
            | Database["public"]["Enums"]["notification_display_frequency"]
            | null
          expires_at?: string | null
          id?: number
          identifier: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          active?: boolean
          created_at?: string
          display_frequency?:
            | Database["public"]["Enums"]["notification_display_frequency"]
            | null
          expires_at?: string | null
          id?: number
          identifier?: string
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: []
      }
      organizations: {
        Row: {
          active: boolean
          admin_contact_email: string | null
          billing_cycle_start: string
          billing_interval: Database["public"]["Enums"]["billing_interval"]
          city: string | null
          country: string | null
          created_at: string | null
          id: string
          license_count: number
          name: string
          street: string | null
          street_number: string | null
          zip_code: string | null
        }
        Insert: {
          active?: boolean
          admin_contact_email?: string | null
          billing_cycle_start?: string
          billing_interval?: Database["public"]["Enums"]["billing_interval"]
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          license_count?: number
          name: string
          street?: string | null
          street_number?: string | null
          zip_code?: string | null
        }
        Update: {
          active?: boolean
          admin_contact_email?: string | null
          billing_cycle_start?: string
          billing_interval?: Database["public"]["Enums"]["billing_interval"]
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          license_count?: number
          name?: string
          street?: string | null
          street_number?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          email: string | null
          first_name: string | null
          id: string
          last_lesson_creation: string | null
          last_name: string | null
          login_count: number | null
          organization_id: string | null
          organization_role:
            | Database["public"]["Enums"]["organization_role"]
            | null
        }
        Insert: {
          email?: string | null
          first_name?: string | null
          id: string
          last_lesson_creation?: string | null
          last_name?: string | null
          login_count?: number | null
          organization_id?: string | null
          organization_role?:
            | Database["public"]["Enums"]["organization_role"]
            | null
        }
        Update: {
          email?: string | null
          first_name?: string | null
          id?: string
          last_lesson_creation?: string | null
          last_name?: string | null
          login_count?: number | null
          organization_id?: string | null
          organization_role?:
            | Database["public"]["Enums"]["organization_role"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      repertoire: {
        Row: {
          created_at: string
          endDate: string | null
          groupId: number | null
          id: number
          startDate: string | null
          studentId: number | null
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          endDate?: string | null
          groupId?: number | null
          id?: number
          startDate?: string | null
          studentId?: number | null
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          endDate?: string | null
          groupId?: number | null
          id?: number
          startDate?: string | null
          studentId?: number | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repertoire_groupId_fkey"
            columns: ["groupId"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repertoire_studentId_fkey"
            columns: ["studentId"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string | null
          id: number
          lesson_main_layout: Database["public"]["Enums"]["lesson_main_layout"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          lesson_main_layout?: Database["public"]["Enums"]["lesson_main_layout"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          lesson_main_layout?: Database["public"]["Enums"]["lesson_main_layout"]
          user_id?: string | null
        }
        Relationships: []
      }
      stripe_subscriptions: {
        Row: {
          created_at: string | null
          currency: string | null
          failed_payment_attempts: number
          id: string
          needs_stripe_customer: boolean
          payment_status: string | null
          period_end: string | null
          period_start: string | null
          plan: Database["public"]["Enums"]["subscription_plan"] | null
          stripe_customer_id: string | null
          stripe_invoice_id: string | null
          stripe_subscription_id: string | null
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          failed_payment_attempts?: number
          id?: string
          needs_stripe_customer?: boolean
          payment_status?: string | null
          period_end?: string | null
          period_start?: string | null
          plan?: Database["public"]["Enums"]["subscription_plan"] | null
          stripe_customer_id?: string | null
          stripe_invoice_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          failed_payment_attempts?: number
          id?: string
          needs_stripe_customer?: boolean
          payment_status?: string | null
          period_end?: string | null
          period_start?: string | null
          plan?: Database["public"]["Enums"]["subscription_plan"] | null
          stripe_customer_id?: string | null
          stripe_invoice_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          user_id?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          archive: boolean | null
          created_at: string | null
          dayOfLesson: Database["public"]["Enums"]["weekdays"] | null
          durationMinutes: number | null
          endOfLesson: string | null
          firstName: string
          homework_sharing_authorized: boolean
          id: number
          instrument: string
          lastName: string
          location: string | null
          startOfLesson: string | null
          user_id: string
        }
        Insert: {
          archive?: boolean | null
          created_at?: string | null
          dayOfLesson?: Database["public"]["Enums"]["weekdays"] | null
          durationMinutes?: number | null
          endOfLesson?: string | null
          firstName: string
          homework_sharing_authorized?: boolean
          id?: number
          instrument: string
          lastName: string
          location?: string | null
          startOfLesson?: string | null
          user_id?: string
        }
        Update: {
          archive?: boolean | null
          created_at?: string | null
          dayOfLesson?: Database["public"]["Enums"]["weekdays"] | null
          durationMinutes?: number | null
          endOfLesson?: string | null
          firstName?: string
          homework_sharing_authorized?: boolean
          id?: number
          instrument?: string
          lastName?: string
          location?: string | null
          startOfLesson?: string | null
          user_id?: string
        }
        Relationships: []
      }
      todos: {
        Row: {
          completed: boolean | null
          created_at: string | null
          due: string | null
          groupId: number | null
          id: number
          studentId: number | null
          text: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          due?: string | null
          groupId?: number | null
          id?: number
          studentId?: number | null
          text: string
          user_id?: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          due?: string | null
          groupId?: number | null
          id?: number
          studentId?: number | null
          text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todos_groupId_fkey"
            columns: ["groupId"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todos_studentId_fkey"
            columns: ["studentId"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      last_3_lessons: {
        Row: {
          created_at: string | null
          date: string | null
          expiration_base: string | null
          groupId: number | null
          homework: string | null
          homeworkKey: string | null
          id: number | null
          lessonContent: string | null
          studentId: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_groupId_fkey"
            columns: ["groupId"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_studentId_fkey"
            columns: ["studentId"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_years: {
        Row: {
          entity_id: number | null
          entity_type: string | null
          years: number[] | null
        }
        Relationships: []
      }
      only_active_notes: {
        Row: {
          backgroundColor:
            | Database["public"]["Enums"]["background_colors"]
            | null
          groupId: number | null
          id: number | null
          order: number | null
          studentId: number | null
          text: string | null
          title: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_groupId_fkey"
            columns: ["groupId"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_studentId_fkey"
            columns: ["studentId"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      convert_student_to_group: {
        Args: { p_student_id: number; p_group_data: Json }
        Returns: Json
      }
      delete_current_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      delete_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_user_created_at: {
        Args: { user_id: string }
        Returns: string
      }
      send_bulk_eleno_messages: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      background_colors: "blue" | "red" | "green" | "yellow"
      billing_interval: "month" | "year"
      currencies: "CHF" | "EUR"
      lesson_main_layout: "regular" | "reverse"
      message_status: "sent" | "read" | "trash"
      notification_action_taken: "dismissed" | "completed" | "clicked"
      notification_action_type: "survey" | "link" | "dismiss_only" | "custom"
      notification_display_frequency: "once" | "daily" | "always"
      notification_display_position: "bottom" | "corner" | "center" | "top"
      notification_type: "survey" | "update" | "news" | "alert"
      organization_role: "admin" | "member"
      recurring_intervals: "day" | "week" | "month" | "year"
      subscription_plan: "month" | "year" | "lifetime" | "licensed"
      subscription_status:
        | "active"
        | "canceled"
        | "trial"
        | "expired"
        | "licensed"
      weekdays:
        | "Montag"
        | "Dienstag"
        | "Mittwoch"
        | "Donnerstag"
        | "Freitag"
        | "Samstag"
        | "Sonntag"
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
    Enums: {
      background_colors: ["blue", "red", "green", "yellow"],
      billing_interval: ["month", "year"],
      currencies: ["CHF", "EUR"],
      lesson_main_layout: ["regular", "reverse"],
      message_status: ["sent", "read", "trash"],
      notification_action_taken: ["dismissed", "completed", "clicked"],
      notification_action_type: ["survey", "link", "dismiss_only", "custom"],
      notification_display_frequency: ["once", "daily", "always"],
      notification_display_position: ["bottom", "corner", "center", "top"],
      notification_type: ["survey", "update", "news", "alert"],
      organization_role: ["admin", "member"],
      recurring_intervals: ["day", "week", "month", "year"],
      subscription_plan: ["month", "year", "lifetime", "licensed"],
      subscription_status: [
        "active",
        "canceled",
        "trial",
        "expired",
        "licensed",
      ],
      weekdays: [
        "Montag",
        "Dienstag",
        "Mittwoch",
        "Donnerstag",
        "Freitag",
        "Samstag",
        "Sonntag",
      ],
    },
  },
} as const
