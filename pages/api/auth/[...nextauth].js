import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

/**
 * @param {import('next-auth').NextAuthOptions} options
 */
export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      if (profile.login !== process.env.GITHUB_USER_LOGIN) return false;
      return true;
    },
  },
};
export default NextAuth(authOptions);
