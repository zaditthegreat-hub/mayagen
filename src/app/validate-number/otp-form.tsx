'use client';

import { useState } from 'react';
import { Button, PinCode, Input } from 'rizzui';
import { Form } from '@core/ui/form';
import { SubmitHandler, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';

type FormValues = {
    phoneNumber: string;
    otp: string;
};

export default function OtpForm() {
    const [step, setStep] = useState<'number' | 'otp'>('number');
    const router = useRouter();

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        if (step === 'number') {
            console.log('Sending OTP to:', data.phoneNumber);
            // Simulate API call to send OTP
            setStep('otp');
        } else {
            console.log('Verifying OTP:', data.otp);
            // Simulate API call to verify OTP
        }
    };

    const handleSkip = () => {
        localStorage.setItem('skip_phone_validation', 'true');
        router.push('/');
    };

    return (
        <Form<FormValues> onSubmit={onSubmit}>
            {({ register, control, setValue, formState: { errors } }) => (
                <div className="space-y-10">
                    {step === 'number' && (
                        <>
                            <Input
                                type="number"
                                label="Phone Number"
                                placeholder="Enter your phone number"
                                size="lg"
                                className="[&>label>span]:font-medium"
                                {...register('phoneNumber', { required: 'Phone number is required' })}
                                error={errors.phoneNumber?.message}
                            />
                            <Button
                                className="w-full text-base font-medium"
                                type="submit"
                                size="lg"
                            >
                                Send OTP
                            </Button>
                        </>
                    )}

                    {step === 'otp' && (
                        <>
                            <Controller
                                control={control}
                                name="otp"
                                render={({ field: { onChange, value } }) => (
                                    <PinCode
                                        variant="outline"
                                        setValue={(val) => onChange(String(val))}
                                        size="lg"
                                        className="lg:justify-start"
                                    />
                                )}
                            />
                            <Button
                                className="w-full text-base font-medium"
                                type="submit"
                                size="lg"
                            >
                                Verify Number
                            </Button>
                            <div className="">
                                <Button
                                    className="-mt-4 w-full p-0 text-base font-medium text-primary underline lg:inline-flex lg:w-auto"
                                    type="button"
                                    variant="text"
                                    onClick={() => setStep('number')}
                                >
                                    Change Phone Number
                                </Button>
                            </div>
                        </>
                    )}
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
