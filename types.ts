
export interface LoginFormData {
  cpf: string;
  password: string;
  rememberMe: boolean;
}

export interface FormErrors {
  cpf?: string;
  password?: string;
  general?: string;
}
