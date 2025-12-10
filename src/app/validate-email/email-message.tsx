'use client';

import { useSession } from 'next-auth/react';
import { Text } from 'rizzui/typography';

export default function EmailMessage() {
    const { data: session } = useSession();
    const email = session?.user?.email;

    return (
        <Text className="-mt-1 mb-9 text-center text-[15px] leading-[1.85] text-gray-700 md:text-base md:!leading-loose lg:text-start xl:-mt-6">
            We have sent a verification code to <span className="font-semibold text-gray-900">{email}</span>. Please enter the code below to verify your email address.
        </Text>
    );
}
