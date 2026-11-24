// auth.ts (in the root of your project)
import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
// Add more providers as needed

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // Add more providers as needed
  ],
  pages: {
    signIn: '/auth/signin',
    // Customize error, verification request pages if needed
  },
  callbacks: {
    async session({ session, token }) {
      // Add custom session properties if needed
      return session;
    },
    async jwt({ token, user }) {
      // Customize JWT token if needed
      return token;
    }
  }
}

export default NextAuth(authOptions)