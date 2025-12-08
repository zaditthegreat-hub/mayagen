import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            // Add other user properties here if needed
        } & DefaultSession['user'];
        accessToken: string;
        refreshToken: string;
        expiresAt: number;
        error?: string;
    }

    interface User {
        id: string;
        email: string;
        accessToken: string;
        refreshToken: string;
        expiresIn?: number; // Optional, if backend provides it
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken: string;
        refreshToken: string;
        expiresAt: number;
        error?: string;
        user?: any;
    }
}
