import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { env } from '@/env.mjs';
import { pagesOptions } from './pages-options';
import { JWT } from 'next-auth/jwt';

async function refreshAccessToken(token: JWT) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/refreshToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      console.error('Refresh token failed:', refreshedTokens);
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: (refreshedTokens as any).accessToken ?? token.accessToken,
      expiresAt: Date.now() + ((refreshedTokens as any).expiresIn ?? 3600) * 1000, // Default 1 hour if not provided
      refreshToken: (refreshedTokens as any).refreshToken ?? token.refreshToken,
    };
  } catch (error) {
    console.error('RefreshAccessTokenError', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  pages: {
    ...pagesOptions,
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      console.log('Session callback - token:', token);
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role,
          number: (token.user as any)?.number,
          emailValidated: (token.user as any)?.emailValidated,
        },
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        error: token.error,
      };
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        console.log('Initial sign in, user:', user);
        return {
          ...token,
          accessToken: (user as any).accessToken,
          refreshToken: (user as any).refreshToken,
          expiresAt: Date.now() + ((user as any).expiresIn ?? 3600) * 1000,
          role: (user as any).role,
          user,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.expiresAt) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          console.log(`Attempting login to ${apiUrl}/authenticate`);

          const res = await fetch(`${apiUrl}/authenticate`, {
            method: 'POST',
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          const user = await res.json();
          console.log('Login response:', user);

          if (res.ok && user) {
            // Fetch user profile details using the access token
            try {
              const profileRes = await fetch(`${apiUrl}/api/v1/admin/users/me`, {
                headers: {
                  Authorization: `Bearer ${(user as any).accessToken}`,
                },
              });

              if (profileRes.ok) {
                const profile = await profileRes.json();
                console.log('User profile fetched:', profile);

                // Merge profile data with user (token) data
                return {
                  ...user,
                  ...profile, // This will overwrite any matching keys with profile data (e.g., role)
                };
              } else {
                console.error('Failed to fetch user profile:', profileRes.status);
              }
            } catch (profileError) {
              console.error('Error fetching user profile:', profileError);
            }

            return user as any;
          }
          return null;
        } catch (e) {
          console.error('Authorize error:', e);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID || '',
      clientSecret: env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],
};
