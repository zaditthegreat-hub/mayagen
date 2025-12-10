'use client';

import { Button, PinCode } from 'rizzui';
import { Form } from '@core/ui/form';
import { SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';

type FormValues = {
    otp: string;
};

export default function OtpForm() {
    const router = useRouter();

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log(data);
    };

    const handleSkip = () => {
        sessionStorage.setItem('skip_email_validation', 'true');
        router.push('/');
    };

    return (
        <Form<FormValues> onSubmit={onSubmit}>
            {({ setValue }) => (
                <div className="space-y-10">
                    <PinCode
                        variant="outline"
                        setValue={(value) => setValue('otp', String(value))}
                        size="lg"
                        className="lg:justify-start"
                    />
                    <Button
                        className="w-full text-base font-medium"
                        type="submit"
                        size="lg"
                    >
                        Verify Email
                    </Button>
                    <div className="">
                        <Button
                            className="-mt-4 w-full p-0 text-base font-medium text-primary underline lg:inline-flex lg:w-auto"
                            type="submit"
                            variant="text"
                        >
                            Resend OTP
                        </Button>
                    </div>
                    <div className="">
                        <Button
                            className="-mt-4 w-full p-0 text-base font-medium text-gray-500 underline lg:inline-flex lg:w-auto"
                            type="button"
                            variant="text"
                            onClick={handleSkip}
                        >
                            Skip for now
                        </Button>
                    </div>
                </div>
            )}
        </Form>
    );
}
