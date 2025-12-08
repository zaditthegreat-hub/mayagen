'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { SubmitHandler, Controller, useForm } from 'react-hook-form';
import { Input, Button, Title, Text, Select, Checkbox, Textarea, Loader } from 'rizzui';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { routes } from '@/config/routes';

// Define the plan type based on the API response
export type Plan = {
    id?: string;
    code: string;
    name: string;
    description: string;
    billingCycle: string;
    priceCents: number;
    currency: string;
    active: boolean;
    features: Record<string, any>;
};

// Zod schema for validation
const planSchema = z.object({
    code: z.string().min(1, 'Code is required'),
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    billingCycle: z.string().min(1, 'Billing Cycle is required'),
    priceCents: z.coerce.number().min(0, 'Price must be 0 or greater'),
    currency: z.string().min(1, 'Currency is required'),
    active: z.boolean(),
});

type PlanSchema = z.infer<typeof planSchema>;

const billingCycleOptions = [
    { label: 'Monthly', value: 'MONTHLY' },
    { label: 'Yearly', value: 'YEARLY' },
];

const currencyOptions = [
    { label: 'IDR', value: 'IDR' },
    { label: 'USD', value: 'USD' },
];

export default function CreateEditPlan({ id }: { id?: string }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(!!id);
    const [planId, setPlanId] = useState<string | undefined>(undefined);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<PlanSchema>({
        defaultValues: {
            code: '',
            name: '',
            description: '',
            billingCycle: 'MONTHLY',
            priceCents: 0,
            currency: 'IDR',
            active: true,
        },
    });

    useEffect(() => {
        const fetchPlan = async () => {
            if (id && session?.accessToken) {
                setIsFetching(true);
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                    // Fetch by code (id prop is the code)
                    const response = await fetch(`${apiUrl}/api/v1/admin/plans/${id}`, {
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`,
                        },
                    });

                    if (response.ok) {
                        const result = await response.json();
                        // Handle if result is an array (though it should be an object for get-by-id/code)
                        const planData = Array.isArray(result) ? result[0] : result;

                        setPlanId(planData.id); // Store the real ID for updates

                        reset({
                            code: planData.code,
                            name: planData.name,
                            description: planData.description,
                            billingCycle: planData.billingCycle,
                            priceCents: planData.priceCents,
                            currency: planData.currency,
                            active: planData.active,
                        });
                    } else {
                        toast.error('Failed to fetch plan details');
                    }
                } catch (error) {
                    console.error('Error fetching plan:', error);
                    toast.error('Error loading plan');
                } finally {
                    setIsFetching(false);
                }
            } else {
                setIsFetching(false);
            }
        };
        fetchPlan();
    }, [id, session, reset]);

    const onSubmit: SubmitHandler<PlanSchema> = async (data) => {
        setIsLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const isEdit = !!id;
            // For update, use the stored planId (UUID), for create use base URL
            const url = isEdit
                ? `${apiUrl}/api/v1/admin/plans/${planId}`
                : `${apiUrl}/api/v1/admin/plans`;
            const method = isEdit ? 'PUT' : 'POST';

            // Prepare payload
            const payload = {
                ...data,
                features: {
                    "Website Widget": true,
                    "Channel": 2,
                    "Webchat": true,
                    "Human Agent": "Unlimited",
                    "AI Agent": "Unlimited"
                }, // Default features for now
            };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                toast.success(`Plan ${isEdit ? 'updated' : 'created'} successfully`);
                router.push(routes.plans.dashboard);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || `Failed to ${isEdit ? 'update' : 'create'} plan`);
            }
        } catch (error) {
            console.error('Error saving plan:', error);
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader variant="spinner" />
            </div>
        );
    }

    return (
        <div className="@container">
            <div className="mb-6 flex items-center justify-between">
                <Title as="h4" className="font-semibold">
                    {id ? 'Edit Plan' : 'Create New Plan'}
                </Title>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input
                        label="Code"
                        placeholder="e.g. PRO"
                        {...register('code')}
                        error={errors.code?.message}
                        disabled={!!id}
                    />
                    <Input
                        label="Name"
                        placeholder="e.g. Professional Plan"
                        {...register('name')}
                        error={errors.name?.message}
                    />
                </div>

                <Textarea
                    label="Description"
                    placeholder="Plan description..."
                    {...register('description')}
                    error={errors.description?.message}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Controller
                        name="billingCycle"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Select
                                label="Billing Cycle"
                                options={billingCycleOptions}
                                value={value}
                                onChange={onChange}
                                error={errors.billingCycle?.message}
                            />
                        )}
                    />
                    <Controller
                        name="currency"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Select
                                label="Currency"
                                options={currencyOptions}
                                value={value}
                                onChange={onChange}
                                error={errors.currency?.message}
                            />
                        )}
                    />
                </div>

                <Input
                    label="Price (in cents)"
                    type="number"
                    placeholder="0"
                    {...register('priceCents')}
                    error={errors.priceCents?.message}
                />

                <Controller
                    name="active"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <Checkbox
                            label="Active"
                            checked={value}
                            onChange={onChange}
                        />
                    )}
                />

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button variant="outline" onClick={() => router.push(routes.plans.dashboard)}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        {id ? 'Update Plan' : 'Create Plan'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
