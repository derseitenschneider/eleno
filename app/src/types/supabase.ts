export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
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
          students: string[] | null
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
          students?: string[] | null
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
          students?: string[] | null
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
          created_at: string
          date: string
          homework: string | null
          homeworkKey: string
          id: number
          lessonContent: string | null
          studentId: number
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          homework?: string | null
          homeworkKey?: string
          id?: number
          lessonContent?: string | null
          studentId: number
          user_id?: string
        }
        Update: {
          created_at?: string
          date?: string
          homework?: string | null
          homeworkKey?: string
          id?: number
          lessonContent?: string | null
          studentId?: number
          user_id?: string
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
      notes: {
        Row: {
          backgroundColor:
            | Database["public"]["Enums"]["background_colors"]
            | null
          created_at: string | null
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
          id?: number
          order?: number
          studentId?: number | null
          text?: string | null
          title?: string | null
          user_id?: string
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
      profiles: {
        Row: {
          email: string
          first_name: string
          id: string
          last_name: string
          lifetime_membership: boolean
          stripe_customer: string | null
          stripe_subscription: boolean
        }
        Insert: {
          email: string
          first_name: string
          id: string
          last_name: string
          lifetime_membership?: boolean
          stripe_customer?: string | null
          stripe_subscription?: boolean
        }
        Update: {
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          lifetime_membership?: boolean
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
          id: number
          startDate: string | null
          studentId: number
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          endDate?: string | null
          id?: number
          startDate?: string | null
          studentId: number
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          endDate?: string | null
          id?: number
          startDate?: string | null
          studentId?: number
          title?: string
          user_id?: string | null
        }
        Relationships: [
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
          archive: boolean
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
          archive?: boolean
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
          archive?: boolean
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
          id: number
          student_id: number | null
          text: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          due?: string | null
          id?: number
          student_id?: number | null
          text: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          due?: string | null
          id?: number
          student_id?: number | null
          text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todos_student_id_fkey"
            columns: ["student_id"]
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
          created_at: string | null
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
      lesson_years: {
        Row: {
          studentId: number | null
          years: number[] | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_studentId_fkey"
            columns: ["studentId"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
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
    }
    Functions: {
      delete_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      background_colors: "blue" | "red" | "green" | "yellow" | "none"
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
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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

