'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfileCompletionGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (status === 'loading') return;

        if (session?.user) {
            // Check if email is not validated
            // Assuming emailValidated is boolean or null/undefined
            if (!session.user.emailValidated) {
                const isEmailSkipped = sessionStorage.getItem('skip_email_validation') === 'true';
                if (!isEmailSkipped) {
                    if (pathname !== '/validate-email') {
                        router.push('/validate-email');
                    }
                    return;
                }
            }

            // Check if number is missing
            if (!session.user.number) {
                const isPhoneSkipped = sessionStorage.getItem('skip_phone_validation') === 'true';
                if (!isPhoneSkipped) {
                    if (pathname !== '/validate-number') {
                        router.push('/validate-number');
                    }
                    return;
                }
            }
        }
    }, [session, status, pathname, router]);

    return <>{children}</>;
}
