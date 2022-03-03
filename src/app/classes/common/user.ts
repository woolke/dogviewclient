export class LoginResponse {
  roles: string[];
  user: User;
  manager: User;
}

export class User {
  id: number;
  username: string;
  fullname: string;
  email: string;
}
