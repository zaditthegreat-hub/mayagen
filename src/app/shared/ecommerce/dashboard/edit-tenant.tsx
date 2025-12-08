'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { SubmitHandler, Controller, useForm } from 'react-hook-form';
import { Input, Button, Title, Text, Select, Loader } from 'rizzui';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { routes } from '@/config/routes';

// Define types
type Tenant = {
    id: string;
    name: string;
    email: string;
    code: string;
    address: string | null;
    contact: string | null;
    description: string | null;
    website: string | null;
};

type Plan = {
    id: string;
    code: string;
    name: string;
};

// Zod schema for validation
const subscriptionSchema = z.object({
    planId: z.string().min(1, 'Plan is required'),
    startDate: z.string().min(1, 'Start Date is required'),
});

type SubscriptionSchema = z.infer<typeof subscriptionSchema>;

export default function EditTenant({ id }: { id: string }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [plans, setPlans] = useState<{ label: string; value: string }[]>([]);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SubscriptionSchema>({
        defaultValues: {
            planId: '',
            startDate: new Date().toISOString().split('T')[0], // Default to today
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            if (session?.accessToken) {
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

                    // Fetch all tenants to find the current one
                    const tenantsResponse = await fetch(`${apiUrl}/api/v1/admin/tenants`, {
                        headers: { Authorization: `Bearer ${session.accessToken}` },
                    });

                    // Fetch all plans
                    const plansResponse = await fetch(`${apiUrl}/api/v1/admin/plans`, {
                        headers: { Authorization: `Bearer ${session.accessToken}` },
                    });

                    if (tenantsResponse.ok && plansResponse.ok) {
                        const tenantsResult = await tenantsResponse.json();
                        const plansResult = await plansResponse.json();

                        const foundTenant = tenantsResult.find((t: Tenant) => t.id === id);
                        if (foundTenant) {
                            setTenant(foundTenant);
                        } else {
                            toast.error('Tenant not found');
                            router.push(routes.tenants.dashboard);
                        }

                        setPlans(plansResult.map((p: Plan) => ({ label: `${p.name} (${p.code})`, value: p.id })));
                    } else {
                        toast.error('Failed to load data');
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                    toast.error('Error loading data');
                } finally {
                    setIsFetching(false);
                }
            }
        };
        fetchData();
    }, [id, session, router]);

    const onSubmit: SubmitHandler<SubscriptionSchema> = async (data) => {
        setIsLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${apiUrl}/api/v1/admin/tenants/${id}/subscriptions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success('Subscription added successfully');
                router.push(routes.tenants.dashboard);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to add subscription');
            }
        } catch (error) {
            console.error('Error adding subscription:', error);
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

    if (!tenant) return null;

    return (
        <div className="@container">
            <div className="mb-6">
                <Title as="h4" className="font-semibold">
                    Manage Subscription for {tenant.name}
                </Title>
                <Text className="mt-1 text-gray-500">
                    Code: {tenant.code} | Email: {tenant.email}
                </Text>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4 max-w-lg">
                <Controller
                    name="planId"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <Select
                            label="Select Plan"
                            options={plans}
                            value={value}
                            onChange={(selected: any) => onChange(selected.value)}
                            error={errors.planId?.message}
                            displayValue={(selected) =>
                                plans.find((p) => p.value === selected)?.label ?? selected
                            }
                        />
                    )}
                />

                <Input
                    label="Start Date"
                    type="date"
                    {...register('startDate')}
                    error={errors.startDate?.message}
                />

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button variant="outline" onClick={() => router.push(routes.tenants.dashboard)}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        Add Subscription
                    </Button>
                </div>
            </form>
        </div>
    );
}
