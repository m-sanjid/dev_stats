import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string;
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role: string;
      hasGithubToken: boolean;
      subscription: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    sub: string;
    role?: string;
    githubAccessToken?: string;
  }
}
