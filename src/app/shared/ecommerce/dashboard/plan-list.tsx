'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Box } from 'rizzui/box';
import { Button } from 'rizzui/button';
import { Flex } from 'rizzui/flex';
import { Title, Loader } from 'rizzui';
import cn from '@core/utils/class-names';
import { PiPlusBold } from 'react-icons/pi';
import { Plan } from './create-edit-plan';
import toast from 'react-hot-toast';
import { routes } from '@/config/routes';
import PlansTable from './plans/table';

export default function PlanList({ className }: { className?: string }) {
    const { data: session } = useSession();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPlans = useCallback(async () => {
        if (session?.accessToken) {
            setLoading(true);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${apiUrl}/api/v1/admin/plans`, {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                });
                if (response.ok) {
                    const result = await response.json();
                    setPlans(result);
                } else {
                    console.error('Failed to fetch plans');
                }
            } catch (error) {
                console.error('Error fetching plans:', error);
            } finally {
                setLoading(false);
            }
        }
    }, [session]);

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    const handleDelete = async (id: string) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${apiUrl}/api/v1/admin/plans/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            });

            if (response.ok) {
                toast.success('Plan deleted successfully');
                fetchPlans();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to delete plan');
            }
        } catch (error) {
            console.error('Error deleting plan:', error);
            toast.error('Something went wrong');
        }
    };

    if (loading && plans.length === 0) {
        return (
            <div className={cn('flex h-64 items-center justify-center', className)}>
                <Loader variant="spinner" />
            </div>
        );
    }

    return (
        <Box className={cn('col-span-full @container', className)}>
            <Flex justify="between" align="center" className="mb-3 2xl:mb-5">
                <Title as="h3" className="text-lg font-semibold xl:text-xl">
                    Plans
                </Title>
                <Link href={routes.plans.create}>
                    <Button className="mt-0">
                        <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
                        Create Plan
                    </Button>
                </Link>
            </Flex>
            <PlansTable
                data={plans}
                isLoading={loading}
                onDelete={handleDelete}
            />
        </Box>
    );
}
