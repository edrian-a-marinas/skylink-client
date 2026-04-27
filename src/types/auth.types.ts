export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  new_password: string;
}

export interface ResendVerificationPayload {
  email: string;
}

export interface MessageResponse {
  message: string;
}