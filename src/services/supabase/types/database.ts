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
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
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
      companies: {
        Row: {
          created_at: string
          id: number
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_technologies: {
        Row: {
          created_at: string
          id: number
          is_required: boolean | null
          job_id: number | null
          technology_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_required?: boolean | null
          job_id?: number | null
          technology_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          is_required?: boolean | null
          job_id?: number | null
          technology_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'job_technologies_job_id_fkey'
            columns: ['job_id']
            isOneToOne: false
            referencedRelation: 'jobs'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'job_technologies_technology_id_fkey'
            columns: ['technology_id']
            isOneToOne: false
            referencedRelation: 'technologies'
            referencedColumns: ['id']
          },
        ]
      }
      jobs: {
        Row: {
          application_url: string
          benefits: string[] | null
          city: string
          company_id: number | null
          created_at: string
          description: string
          employment_type: Database['public']['Enums']['employment_type_enum']
          experience_level: Database['public']['Enums']['experience_level_enum']
          id: number
          is_active: boolean | null
          job_function: Database['public']['Enums']['job_function_enum']
          language: Database['public']['Enums']['language_enum']
          location: Database['public']['Enums']['location_enum']
          main_technologies: string[] | null
          province: Database['public']['Enums']['province_enum']
          responsibilities: string[] | null
          search_vector: unknown
          signature: string | null
          skill_must_have: string[] | null
          skill_nice_have: string[] | null
          title: string
          updated_at: string
          work_mode: Database['public']['Enums']['work_mode_enum']
        }
        Insert: {
          application_url: string
          benefits?: string[] | null
          city: string
          company_id?: number | null
          created_at?: string
          description: string
          employment_type: Database['public']['Enums']['employment_type_enum']
          experience_level: Database['public']['Enums']['experience_level_enum']
          id?: number
          is_active?: boolean | null
          job_function: Database['public']['Enums']['job_function_enum']
          language?: Database['public']['Enums']['language_enum']
          location: Database['public']['Enums']['location_enum']
          main_technologies?: string[] | null
          province: Database['public']['Enums']['province_enum']
          responsibilities?: string[] | null
          search_vector?: unknown
          signature?: string | null
          skill_must_have?: string[] | null
          skill_nice_have?: string[] | null
          title: string
          updated_at?: string
          work_mode: Database['public']['Enums']['work_mode_enum']
        }
        Update: {
          application_url?: string
          benefits?: string[] | null
          city?: string
          company_id?: number | null
          created_at?: string
          description?: string
          employment_type?: Database['public']['Enums']['employment_type_enum']
          experience_level?: Database['public']['Enums']['experience_level_enum']
          id?: number
          is_active?: boolean | null
          job_function?: Database['public']['Enums']['job_function_enum']
          language?: Database['public']['Enums']['language_enum']
          location?: Database['public']['Enums']['location_enum']
          main_technologies?: string[] | null
          province?: Database['public']['Enums']['province_enum']
          responsibilities?: string[] | null
          search_vector?: unknown
          signature?: string | null
          skill_must_have?: string[] | null
          skill_nice_have?: string[] | null
          title?: string
          updated_at?: string
          work_mode?: Database['public']['Enums']['work_mode_enum']
        }
        Relationships: [
          {
            foreignKeyName: 'jobs_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
        ]
      }
      technologies: {
        Row: {
          created_at: string
          id: number
          name: string
          parent_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          parent_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          parent_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'technologies_parent_id_fkey'
            columns: ['parent_id']
            isOneToOne: false
            referencedRelation: 'technologies'
            referencedColumns: ['id']
          },
        ]
      }
      technology_aliases: {
        Row: {
          alias: string
          created_at: string
          id: number
          technology_id: number
        }
        Insert: {
          alias: string
          created_at?: string
          id?: number
          technology_id: number
        }
        Update: {
          alias?: string
          created_at?: string
          id?: number
          technology_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'technology_aliases_technology_id_fkey'
            columns: ['technology_id']
            isOneToOne: false
            referencedRelation: 'technologies'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_companies_for_search: {
        Args: {
          p_date_from?: string
          p_date_to?: string
          p_employment_type?: Database['public']['Enums']['employment_type_enum'][]
          p_experience_level?: Database['public']['Enums']['experience_level_enum'][]
          p_job_function?: Database['public']['Enums']['job_function_enum'][]
          p_language?: Database['public']['Enums']['language_enum']
          p_limit?: number
          p_province?: Database['public']['Enums']['province_enum'][]
          p_work_mode?: Database['public']['Enums']['work_mode_enum'][]
          search_query: string
        }
        Returns: {
          company_name: string
          job_count: number
        }[]
      }
      search_jobs: {
        Args: {
          p_company?: string[]
          p_date_from?: string
          p_date_to?: string
          p_employment_type?: Database['public']['Enums']['employment_type_enum'][]
          p_experience_level?: Database['public']['Enums']['experience_level_enum'][]
          p_job_function?: Database['public']['Enums']['job_function_enum'][]
          p_language?: Database['public']['Enums']['language_enum']
          p_limit?: number
          p_offset?: number
          p_province?: Database['public']['Enums']['province_enum'][]
          p_work_mode?: Database['public']['Enums']['work_mode_enum'][]
          search_query: string
        }
        Returns: {
          application_url: string
          benefits: string[]
          city: string
          company_id: number
          company_name: string
          created_at: string
          description: string
          employment_type: Database['public']['Enums']['employment_type_enum']
          experience_level: Database['public']['Enums']['experience_level_enum']
          id: number
          is_active: boolean
          job_function: Database['public']['Enums']['job_function_enum']
          language: Database['public']['Enums']['language_enum']
          location: Database['public']['Enums']['location_enum']
          main_technologies: string[]
          province: Database['public']['Enums']['province_enum']
          responsibilities: string[]
          skill_must_have: string[]
          skill_nice_have: string[]
          title: string
          total_count: number
          updated_at: string
          work_mode: Database['public']['Enums']['work_mode_enum']
        }[]
      }
    }
    Enums: {
      employment_type_enum:
        | 'full-time'
        | 'part-time'
        | 'contractor'
        | 'temporary'
        | 'internship'
      experience_level_enum:
        | 'entry-level'
        | 'mid-level'
        | 'senior'
        | 'manager'
        | 'director'
        | 'executive'
      job_function_enum:
        | 'technology-engineering'
        | 'sales-business-development'
        | 'marketing-communications'
        | 'operations-logistics'
        | 'finance-accounting'
        | 'human-resources'
        | 'customer-success-support'
        | 'product-management'
        | 'data-analytics'
        | 'healthcare-medical'
        | 'legal-compliance'
        | 'design-creative'
        | 'administrative-office'
        | 'consulting-strategy'
        | 'general-management'
        | 'other'
      language_enum: 'english' | 'spanish'
      location_enum: 'costa-rica' | 'latam'
      province_enum:
        | 'san-jose'
        | 'alajuela'
        | 'heredia'
        | 'guanacaste'
        | 'puntarenas'
        | 'limon'
        | 'cartago'
      work_mode_enum: 'remote' | 'hybrid' | 'onsite'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      employment_type_enum: [
        'full-time',
        'part-time',
        'contractor',
        'temporary',
        'internship',
      ],
      experience_level_enum: [
        'entry-level',
        'mid-level',
        'senior',
        'manager',
        'director',
        'executive',
      ],
      job_function_enum: [
        'technology-engineering',
        'sales-business-development',
        'marketing-communications',
        'operations-logistics',
        'finance-accounting',
        'human-resources',
        'customer-success-support',
        'product-management',
        'data-analytics',
        'healthcare-medical',
        'legal-compliance',
        'design-creative',
        'administrative-office',
        'consulting-strategy',
        'general-management',
        'other',
      ],
      language_enum: ['english', 'spanish'],
      location_enum: ['costa-rica', 'latam'],
      province_enum: [
        'san-jose',
        'alajuela',
        'heredia',
        'guanacaste',
        'puntarenas',
        'limon',
        'cartago',
      ],
      work_mode_enum: ['remote', 'hybrid', 'onsite'],
    },
  },
} as const
