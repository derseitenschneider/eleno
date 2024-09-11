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
      groups: {
        Row: {
          archive: boolean
          created_at: string
          dayOfLesson: Database["public"]["Enums"]["weekdays"] | null
          durationMinutes: number | null
          endOfLesson: string | null
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
          id?: number
          location?: string | null
          name?: string
          startOfLesson?: string | null
          students?: Json[] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          created_at: string | null
          date: string | null
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
          {
            foreignKeyName: "lessons_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          lifetime_membership: boolean
          login_count: number | null
          stripe_customer: string | null
          stripe_subscription: boolean
        }
        Insert: {
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          lifetime_membership?: boolean
          login_count?: number | null
          stripe_customer?: string | null
          stripe_subscription?: boolean
        }
        Update: {
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          lifetime_membership?: boolean
          login_count?: number | null
          stripe_customer?: string | null
          stripe_subscription?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
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
          {
            foreignKeyName: "repertoire_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string | null
          id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          archive: boolean | null
          created_at: string | null
          dayOfLesson: Database["public"]["Enums"]["weekdays"] | null
          durationMinutes: number | null
          endOfLesson: string | null
          firstName: string
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
          id?: number
          instrument?: string
          lastName?: string
          location?: string | null
          startOfLesson?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
          {
            foreignKeyName: "todos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      last_3_lessons: {
        Row: {
          date: string | null
          homework: string | null
          homeworkKey: string | null
          id: number | null
          lessonContent: string | null
          studentId: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_studentId_fkey"
            columns: ["studentId"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      last_3_lessons_new: {
        Row: {
          created_at: string | null
          date: string | null
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
          {
            foreignKeyName: "lessons_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
          id: number | null
          order: number | null
          studentId: number | null
          text: string | null
          title: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_studentId_fkey"
            columns: ["studentId"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_login_stats: {
        Row: {
          avg_weekly_login_count: number | null
          first_name: string | null
          last_name: string | null
          login_count: number | null
        }
        Insert: {
          avg_weekly_login_count?: never
          first_name?: string | null
          last_name?: string | null
          login_count?: number | null
        }
        Update: {
          avg_weekly_login_count?: never
          first_name?: string | null
          last_name?: string | null
          login_count?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      convert_student_to_group: {
        Args: {
          p_student_id: number
          p_group_data: Json
        }
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
        Args: {
          user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      background_colors: "blue" | "red" | "green" | "yellow"
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
