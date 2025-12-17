'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfileCompletionGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        if (status === 'loading') return;

        if (!session?.user) {
            setAllowed(true);
            return;
        }

        if (!session.user.emailValidated) {
            const isEmailSkipped = localStorage.getItem('skip_email_validation') === 'true';
            if (!isEmailSkipped && pathname !== '/validate-email') {
                router.replace('/validate-email');
                return;
            }
        }

        if (!session.user.number) {
            const isPhoneSkipped = localStorage.getItem('skip_phone_validation') === 'true';
            if (!isPhoneSkipped && pathname !== '/validate-number') {
                router.replace('/validate-number');
                return;
            }
        }

        setAllowed(true);
    }, [session, status, pathname, router]);

    if (!allowed) {
        return null; // atau spinner
    }

    return <>{children}</>;
}
