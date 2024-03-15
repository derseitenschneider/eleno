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
          createdAt: string
          dayOfLesson: string | null
          durationMinutes: number | null
          endOfLesson: string | null
          groupName: string
          id: number
          startOfLesson: string | null
          students: string[] | null
          userId: string
        }
        Insert: {
          archive?: boolean
          createdAt?: string
          dayOfLesson?: string | null
          durationMinutes?: number | null
          endOfLesson?: string | null
          groupName: string
          id?: number
          startOfLesson?: string | null
          students?: string[] | null
          userId: string
        }
        Update: {
          archive?: boolean
          createdAt?: string
          dayOfLesson?: string | null
          durationMinutes?: number | null
          endOfLesson?: string | null
          groupName?: string
          id?: number
          startOfLesson?: string | null
          students?: string[] | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: 'public_groups_userId_fkey'
            columns: ['userId']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      lessons: {
        Row: {
          created_at: string | null
          date: string | null
          homework: string | null
          homeworkKey: string
          id: number
          lessonContent: string | null
          studentId: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          homework?: string | null
          homeworkKey?: string
          id?: number
          lessonContent?: string | null
          studentId: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string | null
          homework?: string | null
          homeworkKey?: string
          id?: number
          lessonContent?: string | null
          studentId?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'lessons_studentId_fkey'
            columns: ['studentId']
            isOneToOne: false
            referencedRelation: 'students'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'lessons_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      notes: {
        Row: {
          backgroundColor:
            | Database['public']['Enums']['background_colors']
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
            | Database['public']['Enums']['background_colors']
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
            | Database['public']['Enums']['background_colors']
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
            foreignKeyName: 'notes_studentId_fkey'
            columns: ['studentId']
            isOneToOne: false
            referencedRelation: 'students'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'notes_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
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
          stripe_customer: string | null
          stripe_subscription: boolean
        }
        Insert: {
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          lifetime_membership?: boolean
          stripe_customer?: string | null
          stripe_subscription?: boolean
        }
        Update: {
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          lifetime_membership?: boolean
          stripe_customer?: string | null
          stripe_subscription?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
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
            foreignKeyName: 'repertoire_studentId_fkey'
            columns: ['studentId']
            isOneToOne: false
            referencedRelation: 'students'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'repertoire_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
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
            foreignKeyName: 'settings_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      students: {
        Row: {
          archive: boolean | null
          created_at: string | null
          dayOfLesson: string | null
          durationMinutes: string | null
          endOfLesson: string | null
          firstName: string | null
          id: number
          instrument: string | null
          lastName: string | null
          location: string | null
          startOfLesson: string | null
          user_id: string
        }
        Insert: {
          archive?: boolean | null
          created_at?: string | null
          dayOfLesson?: string | null
          durationMinutes?: string | null
          endOfLesson?: string | null
          firstName?: string | null
          id?: number
          instrument?: string | null
          lastName?: string | null
          location?: string | null
          startOfLesson?: string | null
          user_id: string
        }
        Update: {
          archive?: boolean | null
          created_at?: string | null
          dayOfLesson?: string | null
          durationMinutes?: string | null
          endOfLesson?: string | null
          firstName?: string | null
          id?: number
          instrument?: string | null
          lastName?: string | null
          location?: string | null
          startOfLesson?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'students_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
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
            foreignKeyName: 'todos_student_id_fkey'
            columns: ['student_id']
            isOneToOne: false
            referencedRelation: 'students'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'todos_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
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
            foreignKeyName: 'lessons_studentId_fkey'
            columns: ['studentId']
            isOneToOne: false
            referencedRelation: 'students'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'lessons_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      only_active_notes: {
        Row: {
          backgroundColor:
            | Database['public']['Enums']['background_colors']
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
            foreignKeyName: 'notes_studentId_fkey'
            columns: ['studentId']
            isOneToOne: false
            referencedRelation: 'students'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'notes_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
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
      background_colors: 'blue' | 'red' | 'green' | 'yellow'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
        Database['public']['Views'])
    ? (Database['public']['Tables'] &
        Database['public']['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database['public']['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
    ? Database['public']['Enums'][PublicEnumNameOrOptions]
    : never
