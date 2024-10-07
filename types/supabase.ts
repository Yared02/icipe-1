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
      businesses: {
        Row: {
          address: string | null
          annual_income: number | null
          annual_profit: number | null
          association_type: string | null
          business_license: string | null
          country: string | null
          created_at: string
          crop_annual_yield: number | null
          crop_harvesting_method: string | null
          crop_rotation_frequency: string | null
          crop_rotation_type: string | null
          crop_season_duration: string | null
          crop_season_timing: string | null
          crop_verity: string | null
          current_capital: number | null
          daily_sales: number | null
          email: string | null
          crop: string | null

          enterprise_activities: string | null
          establishment_year: number | null
          estimated_customers: number | null
          farming_experience: number | null
          farming_method: string | null
          farming_years_of_experience: number | null
          female_employees: number | null
          hectars_under_cultivation: number | null
          id: number
          irrigration_availability: string | null
          land_tenure_status: string | null
          latitude: number | null
          level: string | null
          longitude: number | null
          male_employees: number | null
          monthly_sales: number | null
          name: string
          number_of_idp_youth: number | null
          number_of_livestock: number | null
          number_of_plwd_youth: number | null
          number_of_refugee_youth: number | null
          number_of_youth: number | null
          participant_id: number
          phone1: string | null
          phone2: string | null
          phone3: string | null
          program_id: number | null
          rainfall_dependecy: string | null
          secondary_responsible_individual: string | null
          sector: string | null
          source_of_capital: string | null
          starting_capital: number | null
          subpartner_names: string | null
          type: string | null
          type_of_livestock: string | null
          unique_identifier: string | null
          weekly_sales: number | null
        }
        Insert: {
          address?: string | null
          annual_income?: number | null
          annual_profit?: number | null
          association_type?: string | null
          business_license?: string | null
          country?: string | null
          created_at?: string
          crop_annual_yield?: number | null
          crop_harvesting_method?: string | null
          crop_rotation_frequency?: string | null
          crop_rotation_type?: string | null
          crop_season_duration?: string | null
          crop_season_timing?: string | null
          crop_verity?: string | null
          crop?: string | null

          
          current_capital?: number | null
          daily_sales?: number | null
          email?: string | null
          enterprise_activities?: string | null
          establishment_year?: number | null
          estimated_customers?: number | null
          farming_experience?: number | null
          farming_method?: string | null
          farming_years_of_experience?: number | null
          female_employees?: number | null
          hectars_under_cultivation?: number | null
          id?: number
          irrigration_availability?: string | null
          land_tenure_status?: string | null
          latitude?: number | null
          level?: string | null
          longitude?: number | null
          male_employees?: number | null
          monthly_sales?: number | null
          name: string
          number_of_idp_youth?: number | null
          number_of_livestock?: number | null
          number_of_plwd_youth?: number | null
          number_of_refugee_youth?: number | null
          number_of_youth?: number | null
          participant_id: number
          phone1?: string | null
          phone2?: string | null
          phone3?: string | null
          program_id?: number | null
          rainfall_dependecy?: string | null
          secondary_responsible_individual?: string | null
          sector?: string | null
          source_of_capital?: string | null
          starting_capital?: number | null
          subpartner_names?: string | null
          type?: string | null
          type_of_livestock?: string | null
          unique_identifier?: string | null
          weekly_sales?: number | null
        }
        Update: {
          address?: string | null
          annual_income?: number | null
          annual_profit?: number | null
          association_type?: string | null
          business_license?: string | null
          country?: string | null
          created_at?: string
          crop_annual_yield?: number | null
          crop_harvesting_method?: string | null
          crop_rotation_frequency?: string | null
          crop_rotation_type?: string | null
          crop_season_duration?: string | null
          crop_season_timing?: string | null
          crop_verity?: string | null
          current_capital?: number | null
          daily_sales?: number | null
          email?: string | null
          enterprise_activities?: string | null
          establishment_year?: number | null
          estimated_customers?: number | null
          farming_experience?: number | null
          farming_method?: string | null
          farming_years_of_experience?: number | null
          female_employees?: number | null
          hectars_under_cultivation?: number | null
          id?: number
          irrigration_availability?: string | null
          land_tenure_status?: string | null
          latitude?: number | null
          level?: string | null
          longitude?: number | null
          male_employees?: number | null
          monthly_sales?: number | null
          name?: string
          number_of_idp_youth?: number | null
          number_of_livestock?: number | null
          number_of_plwd_youth?: number | null
          number_of_refugee_youth?: number | null
          number_of_youth?: number | null
          participant_id?: number
          phone1?: string | null
          phone2?: string | null
          phone3?: string | null
          program_id?: number | null
          rainfall_dependecy?: string | null
          secondary_responsible_individual?: string | null
          sector?: string | null
          source_of_capital?: string | null
          starting_capital?: number | null
          subpartner_names?: string | null
          type?: string | null
          type_of_livestock?: string | null
          unique_identifier?: string | null
          weekly_sales?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: true
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "businesses_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      capacity_developments: {
        Row: {
          created_at: string
          from: string | null
          id: number
          name: string
          program_id: number | null
          status: string
          to: string | null
          total_participant_capacity: number | null
          type: string
        }
        Insert: {
          created_at?: string
          from?: string | null
          id?: number
          name: string
          program_id?: number | null
          status: string
          to?: string | null
          total_participant_capacity?: number | null
          type: string
        }
        Update: {
          created_at?: string
          from?: string | null
          id?: number
          name?: string
          program_id?: number | null
          status?: string
          to?: string | null
          total_participant_capacity?: number | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "capacity_developments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "capacity_developments"
            referencedColumns: ["id"]
          },
        ]
      }
      devices: {
        Row: {
          amount: number
          created_at: string
          id: number
          model: string | null
          name: string
          operating_system: string | null
          program_id: number | null
          type: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: number
          model?: string | null
          name: string
          operating_system?: string | null
          program_id?: number | null
          type?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: number
          model?: string | null
          name?: string
          operating_system?: string | null
          program_id?: number | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devices_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      grants: {
        Row: {
          application_form: string | null
          created_at: string
          default_disbursement_amount: number | null
          description: string | null
          from: string | null
          id: number
          name: string
          program_id: number | null
          status: string | null
          to: string | null
          total_amount: number | null
        }
        Insert: {
          application_form?: string | null
          created_at?: string
          default_disbursement_amount?: number | null
          description?: string | null
          from?: string | null
          id?: number
          name: string
          program_id?: number | null
          status?: string | null
          to?: string | null
          total_amount?: number | null
        }
        Update: {
          application_form?: string | null
          created_at?: string
          default_disbursement_amount?: number | null
          description?: string | null
          from?: string | null
          id?: number
          name?: string
          program_id?: number | null
          status?: string | null
          to?: string | null
          total_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "grants_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: number
          name: string
          program_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          program_id: number
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          program_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "organizations_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      participant_capdevs: {
        Row: {
          capacity_development_id: number
          created_at: string
          id: number
          participant_id: number
        }
        Insert: {
          capacity_development_id: number
          created_at?: string
          id?: number
          participant_id: number
        }
        Update: {
          capacity_development_id?: number
          created_at?: string
          id?: number
          participant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "participant_capdevs_capacity_development_id_fkey"
            columns: ["capacity_development_id"]
            isOneToOne: false
            referencedRelation: "capacity_developments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participant_capdevs_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      participant_devices: {
        Row: {
          created_at: string
          device_id: number
          id: number
          participant_id: number
        }
        Insert: {
          created_at?: string
          device_id: number
          id?: number
          participant_id: number
        }
        Update: {
          created_at?: string
          device_id?: number
          id?: number
          participant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "participant_devices_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participant_devices_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      participant_grants: {
        Row: {
          amount: number
          created_at: string
          grant_id: number
          id: number
          participant_id: number
          program_id: number | null
        }
        Insert: {
          amount: number
          created_at?: string
          grant_id: number
          id?: number
          participant_id: number
          program_id?: number | null
        }
        Update: {
          amount?: number
          created_at?: string
          grant_id?: number
          id?: number
          participant_id?: number
          program_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "participant_grants_grant_id_fkey"
            columns: ["grant_id"]
            isOneToOne: false
            referencedRelation: "grants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participant_grants_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participant_grants_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      participants: {
        Row: {
          age: number | null
          created_at: string
          duration_of_employment: string | null
          education_level: string | null
          email: string | null
          employment_duration: string | null
          employment_status: string | null
          employment_type: string | null
          ethnicity: string | null
          firstname: string | null
          gender: string | null
          health_disability: string | null
          health_pre_existing_conditions: string | null
          home_number: string | null
          household_above_hs: number | null
          household_dependants: number | null
          household_men: number | null
          household_woman: number | null
          id: number
          income_level: string | null
          is_disabled: boolean | null
          is_idp: boolean | null
          is_refugee: boolean | null
          is_student: boolean | null
          kebele: string | null
          lastname: string | null
          latitude: number | null
          longitude: number | null
          martial_status: string | null
          monthly_expense: number | null
          monthly_mobile_card_expense: number | null
          phone: string | null
          phone2: string | null
          program_id: number | null
          region: string | null
          saving_account_availability: string | null
          subcity: string | null
          surname: string | null
          unique_identifier: string | null
          uses_atm: boolean | null
          uses_internet: boolean | null
          uses_mobile_banking: boolean | null
          uses_social_media: boolean | null
          woreda: string | null
          zone: string | null
          firstname_surname_phone: string | null
        }
        Insert: {
          age?: number | null
          created_at?: string
          duration_of_employment?: string | null
          education_level?: string | null
          email?: string | null
          employment_duration?: string | null
          employment_status?: string | null
          employment_type?: string | null
          ethnicity?: string | null
          firstname?: string | null
          gender?: string | null
          health_disability?: string | null
          health_pre_existing_conditions?: string | null
          home_number?: string | null
          household_above_hs?: number | null
          household_dependants?: number | null
          household_men?: number | null
          household_woman?: number | null
          id?: number
          income_level?: string | null
          is_disabled?: boolean | null
          is_idp?: boolean | null
          is_refugee?: boolean | null
          is_student?: boolean | null
          kebele?: string | null
          lastname?: string | null
          latitude?: number | null
          longitude?: number | null
          martial_status?: string | null
          monthly_expense?: number | null
          monthly_mobile_card_expense?: number | null
          phone?: string | null
          phone2?: string | null
          program_id?: number | null
          region?: string | null
          saving_account_availability?: string | null
          subcity?: string | null
          surname?: string | null
          unique_identifier?: string | null
          uses_atm?: boolean | null
          uses_internet?: boolean | null
          uses_mobile_banking?: boolean | null
          uses_social_media?: boolean | null
          woreda?: string | null
          zone?: string | null
        }
        Update: {
          age?: number | null
          created_at?: string
          duration_of_employment?: string | null
          education_level?: string | null
          email?: string | null
          employment_duration?: string | null
          employment_status?: string | null
          employment_type?: string | null
          ethnicity?: string | null
          firstname?: string | null
          gender?: string | null
          health_disability?: string | null
          health_pre_existing_conditions?: string | null
          home_number?: string | null
          household_above_hs?: number | null
          household_dependants?: number | null
          household_men?: number | null
          household_woman?: number | null
          id?: number
          income_level?: string | null
          is_disabled?: boolean | null
          is_idp?: boolean | null
          is_refugee?: boolean | null
          is_student?: boolean | null
          kebele?: string | null
          lastname?: string | null
          latitude?: number | null
          longitude?: number | null
          martial_status?: string | null
          monthly_expense?: number | null
          monthly_mobile_card_expense?: number | null
          phone?: string | null
          phone2?: string | null
          program_id?: number | null
          region?: string | null
          saving_account_availability?: string | null
          subcity?: string | null
          surname?: string | null
          unique_identifier?: string | null
          uses_atm?: boolean | null
          uses_internet?: boolean | null
          uses_mobile_banking?: boolean | null
          uses_social_media?: boolean | null
          woreda?: string | null
          zone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "participants_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }

      user: {
        Row: {
          created_at: string
          id: number
          first_name: string
          last_name:string
          email:string
          phone_no:string
          organization:string
        }
        Insert: {
          created_at?: string
          id?: number
          first_name: string
          last_name:string
          email:string
          phone_no:string
          organization:string
        }
        Update: {
          created_at?: string
          id?: number
          first_name: string
          last_name:string
          email:string
          phone_no:string
          organization:string        }
        Relationships: []
      }
      member: {
        Row: {
          group_id: number;
          participant_id: number;
        };
        Insert: {
          group_id: number;
          participant_id: number;// Optional for insert
        };
        Update: {
          group_id: number;
          participant_id: number;
        };
        Relationships: []
      }
    


      group: {
        Row: {
          program_id:number;
          created_at: string;
          id: number;
          name: string;
          member: Array<{ [key: string]: any }>; // Adjust this type as per your member structure
        };
        Insert: {
          program_id:number;

          created_at?: string;
          id?: number;
          name: string;
          member?: Array<{ [key: string]: any }>; // Optional for insert
        };
        Update: {
          program_id:number;

          created_at?: string;
          id?: number;
          name?: string;
          member?: Array<{ [key: string]: any }>; // Optional for update
        };
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      firstname_surname_phone: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      get_participan_grants_month_aggregate: {
        Args: Record<PropertyKey, never>
        Returns: Record<string, unknown>[]
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
