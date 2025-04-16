import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { config } from "@/utils/config";


export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "email", type: "text", placeholder: "ruth@a2sv.org" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        // const res: any = await fetch(`${config.apiUrl}/v1/admin/login`, {

        const res: any = await fetch(`${process.env.NEXT_PUBLIC_PROD_API_URL}/v1/admin/login`, {
           method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });
        
        const user = await res.json();
        if (user.statusCode === '200') {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, profile }) {
      if (user) {
        token.user = user;
        token.profile = profile
      }
      
      return token;
    },
    // async signIn({ credentials }) {
    //   return true
    // },
    session: async({session, token}) => {
      // session.accessToken = token.accessToken
      const user:any = token.user

      return { ...session,
        user: { ...session.user,
          name: `${user.data.profile.firstName} ${user.data.profile.lastName}`,
          email: user.data.profile.email,
        },
        profile: { ...session.user,
          name: `${user.data.profile.firstName} ${user.data.profile.lastName}`,
          firstName: user.data.profile.firstName,
          lastName: user.data.profile.lastName,
          email: user.data.profile.email,
          phone: user.data.profile.phone,
          role: user.data.profile.role,
          profileImage: user.data.profile.profileImage
        },
        tokens: { ...session.user,
          accessToken: user.data.tokens.accessToken,
          refreshToken: user.data.tokens.refreshToken
        },
      }
    }
    
  },
  session: {
    strategy: "jwt",
    maxAge:  30 * 24 * 60 * 60, // 30 days
  },
//   cookies: {
//     sessionToken: {
//         name: "next-auth.session-token",
//         options: {
//             expires: new Date(Date.now() + 30 * 3600000) // 8 hours from now
//         }
//     }
// }
});