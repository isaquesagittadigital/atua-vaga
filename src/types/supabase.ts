export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
            academic_education: {
                Row: {
                    course: string | null
                    created_at: string | null
                    end_date: string | null
                    id: string
                    institution: string
                    level: string
                    start_date: string | null
                    status: string | null
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    course?: string | null
                    created_at?: string | null
                    end_date?: string | null
                    id?: string
                    institution: string
                    level: string
                    start_date?: string | null
                    status?: string | null
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    course?: string | null
                    created_at?: string | null
                    end_date?: string | null
                    id?: string
                    institution?: string
                    level?: string
                    start_date?: string | null
                    status?: string | null
                    updated_at?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "academic_education_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            behavioral_tests: {
                Row: {
                    created_at: string | null
                    description: string | null
                    file_size: string | null
                    id: string
                    pdf_url: string | null
                    title: string
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    file_size?: string | null
                    id?: string
                    pdf_url?: string | null
                    title: string
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    file_size?: string | null
                    id?: string
                    pdf_url?: string | null
                    title?: string
                    updated_at?: string | null
                }
                Relationships: []
            }
            candidate_skills: {
                Row: {
                    created_at: string | null
                    id: string
                    name: string
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    name: string
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    name?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "candidate_skills_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            candidate_test_results: {
                Row: {
                    completed_at: string | null
                    id: string
                    responses: Json | null
                    scores: Json | null
                    test_id: string | null
                    user_id: string | null
                }
                Insert: {
                    completed_at?: string | null
                    id?: string
                    responses?: Json | null
                    scores?: Json | null
                    test_id?: string | null
                    user_id?: string | null
                }
                Update: {
                    completed_at?: string | null
                    id?: string
                    responses?: Json | null
                    scores?: Json | null
                    test_id?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "candidate_test_results_test_id_fkey"
                        columns: ["test_id"]
                        isOneToOne: false
                        referencedRelation: "behavioral_tests"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "candidate_test_results_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            company_members: {
                Row: {
                    company_id: string
                    created_at: string | null
                    id: string
                    role: string
                    user_id: string
                }
                Insert: {
                    company_id: string
                    created_at?: string | null
                    id?: string
                    role?: string
                    user_id: string
                }
                Update: {
                    company_id?: string
                    created_at?: string | null
                    id?: string
                    role?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "company_members_company_id_fkey"
                        columns: ["company_id"]
                        isOneToOne: false
                        referencedRelation: "companies"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "company_members_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            companies: {
                Row: {
                    active: boolean | null
                    address: string | null
                    benefits: string | null
                    company_size: string | null
                    created_at: string | null
                    culture: string | null
                    description: string | null
                    document: string
                    founded_year: number | null
                    id: string
                    industry: string | null
                    linkedin: string | null
                    logo_url: string | null
                    name: string
                    site: string | null
                    updated_at: string | null
                }
                Insert: {
                    active?: boolean | null
                    address?: string | null
                    benefits?: string | null
                    company_size?: string | null
                    created_at?: string | null
                    culture?: string | null
                    description?: string | null
                    document: string
                    founded_year?: number | null
                    id?: string
                    industry?: string | null
                    linkedin?: string | null
                    logo_url?: string | null
                    name: string
                    site?: string | null
                    updated_at?: string | null
                }
                Update: {
                    active?: boolean | null
                    address?: string | null
                    benefits?: string | null
                    company_size?: string | null
                    created_at?: string | null
                    culture?: string | null
                    description?: string | null
                    document?: string
                    founded_year?: number | null
                    id?: string
                    industry?: string | null
                    linkedin?: string | null
                    logo_url?: string | null
                    name?: string
                    site?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            job_alerts: {
                Row: {
                    created_at: string | null
                    id: string
                    is_active: boolean | null
                    keywords: string[] | null
                    locations: string[] | null
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    is_active?: boolean | null
                    keywords?: string[] | null
                    locations?: string[] | null
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    is_active?: boolean | null
                    keywords?: string[] | null
                    locations?: string[] | null
                    updated_at?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "job_alerts_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: true
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            job_applications: {
                Row: {
                    applied_at: string | null
                    cover_letter: string | null
                    id: string
                    job_id: string
                    resume_url: string | null
                    status: Database["public"]["Enums"]["job_status"] | null
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    applied_at?: string | null
                    cover_letter?: string | null
                    id?: string
                    job_id: string
                    resume_url?: string | null
                    status?: Database["public"]["Enums"]["job_status"] | null
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    applied_at?: string | null
                    cover_letter?: string | null
                    id?: string
                    job_id?: string
                    resume_url?: string | null
                    status?: Database["public"]["Enums"]["job_status"] | null
                    updated_at?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "job_applications_job_id_fkey"
                        columns: ["job_id"]
                        isOneToOne: false
                        referencedRelation: "jobs"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "job_applications_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            jobs: {
                Row: {
                    benefits: string[] | null
                    company_id: string
                    created_at: string | null
                    description: string
                    experience_level: string | null
                    id: string
                    location: string | null
                    match_score: number | null
                    posted_at: string | null
                    remote_policy: string | null
                    requirements: string[] | null
                    salary_max: number | null
                    salary_min: number | null
                    status: Database["public"]["Enums"]["job_status"] | null
                    title: string
                    type: Database["public"]["Enums"]["job_type"]
                    updated_at: string | null
                }
                Insert: {
                    benefits?: string[] | null
                    company_id: string
                    created_at?: string | null
                    description: string
                    experience_level?: string | null
                    id?: string
                    location?: string | null
                    match_score?: number | null
                    posted_at?: string | null
                    remote_policy?: string | null
                    requirements?: string[] | null
                    salary_max?: number | null
                    salary_min?: number | null
                    status?: Database["public"]["Enums"]["job_status"] | null
                    title: string
                    type: Database["public"]["Enums"]["job_type"]
                    updated_at?: string | null
                }
                Update: {
                    benefits?: string[] | null
                    company_id?: string
                    created_at?: string | null
                    description?: string
                    experience_level?: string | null
                    id?: string
                    location?: string | null
                    match_score?: number | null
                    posted_at?: string | null
                    remote_policy?: string | null
                    requirements?: string[] | null
                    salary_max?: number | null
                    salary_min?: number | null
                    status?: Database["public"]["Enums"]["job_status"] | null
                    title?: string
                    type?: Database["public"]["Enums"]["job_type"]
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "jobs_company_id_fkey"
                        columns: ["company_id"]
                        isOneToOne: false
                        referencedRelation: "companies"
                        referencedColumns: ["id"]
                    },
                ]
            }
            notifications: {
                Row: {
                    created_at: string | null
                    id: string
                    is_read: boolean | null
                    link: string | null
                    message: string
                    title: string
                    type: string
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    is_read?: boolean | null
                    link?: string | null
                    message: string
                    title: string
                    type: string
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    is_read?: boolean | null
                    link?: string | null
                    message?: string
                    title?: string
                    type?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "notifications_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            professional_experience: {
                Row: {
                    company_name: string
                    created_at: string | null
                    description: string | null
                    end_date: string | null
                    id: string
                    is_current: boolean | null
                    is_variable_salary: boolean | null
                    role: string
                    salary: number | null
                    start_date: string | null
                    updated_at: string | null
                    user_id: string
                    variable_salary_amount: number | null
                }
                Insert: {
                    company_name: string
                    created_at?: string | null
                    description?: string | null
                    end_date?: string | null
                    id?: string
                    is_current?: boolean | null
                    is_variable_salary?: boolean | null
                    role: string
                    salary?: number | null
                    start_date?: string | null
                    updated_at?: string | null
                    user_id: string
                    variable_salary_amount?: number | null
                }
                Update: {
                    company_name?: string
                    created_at?: string | null
                    description?: string | null
                    end_date?: string | null
                    id?: string
                    is_current?: boolean | null
                    is_variable_salary?: boolean | null
                    role?: string
                    salary?: number | null
                    start_date?: string | null
                    updated_at?: string | null
                    user_id?: string
                    variable_salary_amount?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "professional_experience_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    address: string | null
                    availability_move: boolean | null
                    availability_sleep: boolean | null
                    availability_travel: boolean | null
                    bio: string | null
                    birth_date: string | null
                    civil_status: string | null
                    cnh: boolean | null
                    cpf: string | null
                    created_at: string | null
                    diversity_info: string | null
                    email: string
                    full_name: string | null
                    id: string
                    job_objective: string | null
                    name: string | null
                    phone: string | null
                    role: Database["public"]["Enums"]["user_role"]
                    salary_objective: number | null
                    social_links: Json | null
                    trainings: string | null
                    updated_at: string | null
                }
                Insert: {
                    address?: string | null
                    availability_move?: boolean | null
                    availability_sleep?: boolean | null
                    availability_travel?: boolean | null
                    bio?: string | null
                    birth_date?: string | null
                    civil_status?: string | null
                    cnh?: boolean | null
                    cpf?: string | null
                    created_at?: string | null
                    diversity_info?: string | null
                    email: string
                    full_name?: string | null
                    id: string
                    job_objective?: string | null
                    name?: string | null
                    phone?: string | null
                    role?: Database["public"]["Enums"]["user_role"]
                    salary_objective?: number | null
                    social_links?: Json | null
                    trainings?: string | null
                    updated_at?: string | null
                }
                Update: {
                    address?: string | null
                    availability_move?: boolean | null
                    availability_sleep?: boolean | null
                    availability_travel?: boolean | null
                    bio?: string | null
                    birth_date?: string | null
                    civil_status?: string | null
                    cnh?: boolean | null
                    cpf?: string | null
                    created_at?: string | null
                    diversity_info?: string | null
                    email?: string
                    full_name?: string | null
                    id?: string
                    job_objective?: string | null
                    name?: string | null
                    phone?: string | null
                    role?: Database["public"]["Enums"]["user_role"]
                    salary_objective?: number | null
                    social_links?: Json | null
                    trainings?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            test_questions: {
                Row: {
                    category: string | null
                    created_at: string | null
                    id: string
                    order_index: number | null
                    question_text: string
                    test_id: string | null
                }
                Insert: {
                    category?: string | null
                    created_at?: string | null
                    id?: string
                    order_index?: number | null
                    question_text: string
                    test_id?: string | null
                }
                Update: {
                    category?: string | null
                    created_at?: string | null
                    id?: string
                    order_index?: number | null
                    question_text?: string
                    test_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "test_questions_test_id_fkey"
                        columns: ["test_id"]
                        isOneToOne: false
                        referencedRelation: "behavioral_tests"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            job_status: "open" | "closed" | "draft"
            job_type: "remote" | "onsite" | "hybrid"
            user_role: "candidate" | "company_admin" | "company_user" | "super_admin"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
