export type LoginForm = {
  email: string;
  password: string;
  code: string;
};

export type RegisterForm = {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
};

export type ResetPasswordForm = {
  email: string;
  code: string;
};
