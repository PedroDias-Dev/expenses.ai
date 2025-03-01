export interface UserData {
  uid: string;
  email: string;
  name: string;
  phone?: string;
}

export interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
}
