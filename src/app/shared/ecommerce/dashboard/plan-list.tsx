'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toCurrency } from '@core/utils/to-currency';
import Link from 'next/link';
import { Box } from 'rizzui/box';
import { Button } from 'rizzui/button';
import { Flex } from 'rizzui/flex';
import { Grid } from 'rizzui/grid';
import { Text, Title, Loader, ActionIcon, Badge } from 'rizzui';
import cn from '@core/utils/class-names';
import { PiPlusBold, PiTrashBold, PiPencilSimpleBold } from 'react-icons/pi';
import { Plan } from './create-edit-plan';
import toast from 'react-hot-toast';
import { routes } from '@/config/routes';
import { useRouter } from 'next/navigation';

const BADGE_COLORS = [
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'info',
] as const;

export default function PlanList({ className }: { className?: string }) {
    const { data: session } = useSession();
    const router = useRouter();
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
        if (confirm('Are you sure you want to delete this plan?')) {
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
            <Grid className="grid-cols-1 gap-6 @xl:grid-cols-2 @4xl:grid-cols-3">
                {plans.map((plan) => (
                    <PlanItem
                        key={plan.id}
                        plan={plan}
                        onEdit={() => router.push(routes.plans.edit(plan.code))}
                        onDelete={() => handleDelete(plan.id!)}
                    />
                ))}
            </Grid>
        </Box>
    );
}

function PlanItem({
    plan,
    className,
    onEdit,
    onDelete,
}: {
    plan: Plan;
    className?: string;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const getFeatureBadge = (key: string, value: any) => {
        const stringValue = String(value).toLowerCase();
        if (stringValue === 'true') {
            return `${key} Available`;
        }

        // Check if it's a number (or string number)
        if (!isNaN(Number(value))) {
            return `${value} ${key}`;
        }
        // Fallback for other strings
        return `${value} ${key}`;
    };

    return (
        <Flex
            direction="col"
            gap="2"
            className={cn(
                'rounded-xl border border-muted bg-white p-3 dark:bg-gray-50',
                className
            )}
        >
            <Box className="relative aspect-[309/200] w-full bg-gray-100 rounded-[10px] overflow-hidden">
                {/* Placeholder image since API doesn't provide one */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <span className="text-4xl font-bold">{plan.code}</span>
                </div>
            </Box>
            <Flex direction="col" gap="2" className="mt-2 grow px-3">
                <Text
                    as="span"
                    className="block text-xs font-semibold uppercase text-primary"
                >
                    {plan.billingCycle}
                </Text>
                <Title as="h6" className="block text-base font-medium text-gray-900">
                    {plan.name}
                </Title>
                <Text className="text-sm text-gray-500 line-clamp-2">
                    {plan.description}
                </Text>

                {/* Features Badges */}
                <div className="flex flex-wrap gap-2 mt-2">
                    {plan.features && Object.entries(plan.features).map(([key, value], index) => (
                        <Badge
                            key={key}
                            variant="flat"
                            color={BADGE_COLORS[index % BADGE_COLORS.length]}
                            className="rounded-full px-3"
                        >
                            {getFeatureBadge(key, value)}
                        </Badge>
                    ))}
                </div>

                <Flex align="end" justify="between" className="mt-auto pt-4 flex-wrap">
                    <Flex direction="col" className="w-auto gap-y-2">
                        <Text as="span" className="text-xs">
                            Price:{' '}
                            <span className="font-semibold text-gray-900">
                                {toCurrency(plan.priceCents / 100, true)} {plan.currency}
                            </span>
                        </Text>
                    </Flex>
                    <div className="flex gap-2">
                        <ActionIcon
                            size="sm"
                            variant="outline"
                            onClick={onEdit}
                            className="hover:!border-gray-900 hover:text-gray-700"
                        >
                            <PiPencilSimpleBold className="h-4 w-4" />
                        </ActionIcon>
                        <ActionIcon
                            size="sm"
                            variant="outline"
                            color="danger"
                            onClick={onDelete}
                            className="hover:!border-red-600 hover:text-red-600"
                        >
                            <PiTrashBold className="h-4 w-4" />
                        </ActionIcon>
                    </div>
                </Flex>
            </Flex>
        </Flex>
    );
}
