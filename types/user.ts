export interface User {
  id: string;
  username: string;
  password: string; // hashed in real, but for mock plain
  createdAt: Date;
}