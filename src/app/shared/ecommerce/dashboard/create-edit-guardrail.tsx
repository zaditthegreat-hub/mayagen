'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { SubmitHandler, Controller, useForm } from 'react-hook-form';
import { Input, Button, Title, Text, Checkbox, Textarea, Select } from 'rizzui';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { routes } from '@/config/routes';

// Define types
type GuardrailRules = {
    blockedKeywords: string[];
    maxInputChars: number;
    maxOutputChars: number;
    allowContactInfo: boolean;
};

type Guardrail = {
    id?: string;
    code: string;
    name: string;
    description: string;
    direction: string;
    active: boolean;
    rulesJson: GuardrailRules;
};

// Zod schema
const guardrailSchema = z.object({
    code: z.string().min(1, 'Code is required'),
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    direction: z.string().min(1, 'Direction is required'),
    active: z.boolean(),
    // Rules fields flattened for form
    blockedKeywords: z.string().optional(), // Comma separated
    maxInputChars: z.number().min(0),
    maxOutputChars: z.number().min(0),
    allowContactInfo: z.boolean(),
});

type GuardrailSchema = z.infer<typeof guardrailSchema>;

const directionOptions = [
    { label: 'Input', value: 'INPUT' },
    { label: 'Output', value: 'OUTPUT' },
    { label: 'Both', value: 'BOTH' },
];

export default function CreateEditGuardrail({ id }: { id?: string }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(!!id);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<GuardrailSchema>({
        defaultValues: {
            code: '',
            name: '',
            description: '',
            direction: 'BOTH',
            active: true,
            blockedKeywords: '',
            maxInputChars: 3000,
            maxOutputChars: 3000,
            allowContactInfo: false,
        },
    });

    useEffect(() => {
        const fetchGuardrail = async () => {
            if (id && session?.accessToken) {
                setIsFetching(true);
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                    // Fetch all and find (since get-by-id might not be available or consistent, 
                    // but user provided GET /id example, so let's try that first)
                    // User provided: GET /api/v1/admin/guardrails (list) and PUT /api/v1/admin/guardrails/{id}
                    // User DID NOT explicitly provide GET /id in the first request, but in the second request (users) they did.
                    // Let's check the user request again.
                    // "GET /api/v1/admin/guardrails List semua guardrail"
                    // "PUT /api/v1/admin/guardrails/{id}"
                    // "DELETE /api/v1/admin/guardrails/{id}"
                    // No GET /id shown for guardrails. I will fetch all and filter.

                    const response = await fetch(`${apiUrl}/api/v1/admin/guardrails`, {
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`,
                        },
                    });

                    if (response.ok) {
                        const result = await response.json();
                        const guardrail = Array.isArray(result) ? result.find((g: any) => g.id === id) : null;

                        if (guardrail) {
                            reset({
                                code: guardrail.code,
                                name: guardrail.name,
                                description: guardrail.description || '',
                                direction: guardrail.direction,
                                active: guardrail.active,
                                blockedKeywords: guardrail.rulesJson?.blockedKeywords?.join(', ') || '',
                                maxInputChars: guardrail.rulesJson?.maxInputChars || 3000,
                                maxOutputChars: guardrail.rulesJson?.maxOutputChars || 3000,
                                allowContactInfo: guardrail.rulesJson?.allowContactInfo || false,
                            });
                        } else {
                            toast.error('Guardrail not found');
                            router.push(routes.guardrails.dashboard);
                        }
                    } else {
                        toast.error('Failed to fetch guardrail details');
                    }
                } catch (error) {
                    console.error('Error fetching guardrail:', error);
                    toast.error('Error loading guardrail');
                } finally {
                    setIsFetching(false);
                }
            } else {
                setIsFetching(false);
            }
        };
        fetchGuardrail();
    }, [id, session, reset, router]);

    const onSubmit: SubmitHandler<GuardrailSchema> = async (data) => {
        setIsLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const isEdit = !!id;
            const url = isEdit
                ? `${apiUrl}/api/v1/admin/guardrails/${id}`
                : `${apiUrl}/api/v1/admin/guardrails`;
            const method = isEdit ? 'PUT' : 'POST';

            // Construct payload
            const payload = {
                code: data.code,
                name: data.name,
                description: data.description,
                direction: data.direction,
                active: data.active,
                rulesJson: {
                    blockedKeywords: data.blockedKeywords
                        ? data.blockedKeywords.split(',').map((k) => k.trim()).filter((k) => k)
                        : [],
                    maxInputChars: Number(data.maxInputChars),
                    maxOutputChars: Number(data.maxOutputChars),
                    allowContactInfo: data.allowContactInfo,
                },
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
                toast.success(`Guardrail ${isEdit ? 'updated' : 'created'} successfully`);
                router.push(routes.guardrails.dashboard);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || `Failed to ${isEdit ? 'update' : 'create'} guardrail`);
            }
        } catch (error) {
            console.error('Error saving guardrail:', error);
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div>Loading...</div>;
    }

    return (
        <div className="@container">
            <div className="mb-6 flex items-center justify-between">
                <Title as="h4" className="font-semibold">
                    {id ? 'Edit Guardrail' : 'Create New Guardrail'}
                </Title>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input
                        label="Code"
                        placeholder="e.g. global-safe-basic"
                        {...register('code')}
                        error={errors.code?.message}
                        disabled={!!id}
                    />
                    <Input
                        label="Name"
                        placeholder="e.g. Global Basic Safety"
                        {...register('name')}
                        error={errors.name?.message}
                    />
                </div>

                <Textarea
                    label="Description"
                    placeholder="Guardrail description..."
                    {...register('description')}
                    error={errors.description?.message}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Controller
                        name="direction"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Select
                                label="Direction"
                                options={directionOptions}
                                value={value}
                                onChange={(selected: any) => onChange(selected.value)}
                                error={errors.direction?.message}
                                displayValue={(selected) =>
                                    directionOptions.find((p) => p.value === selected)?.label ?? selected
                                }
                            />
                        )}
                    />
                    <Controller
                        name="active"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <Checkbox
                                label="Active"
                                checked={value}
                                onChange={onChange}
                                className="mt-8"
                            />
                        )}
                    />
                </div>

                <div className="rounded-md border border-gray-200 p-4">
                    <Text className="font-semibold text-gray-900 mb-3">Rules Configuration</Text>

                    <div className="space-y-4">
                        <Textarea
                            label="Blocked Keywords (comma separated)"
                            placeholder="e.g. badword1, badword2"
                            {...register('blockedKeywords')}
                            error={errors.blockedKeywords?.message}
                        />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Input
                                label="Max Input Characters"
                                type="number"
                                {...register('maxInputChars', { valueAsNumber: true })}
                                error={errors.maxInputChars?.message}
                            />
                            <Input
                                label="Max Output Characters"
                                type="number"
                                {...register('maxOutputChars', { valueAsNumber: true })}
                                error={errors.maxOutputChars?.message}
                            />
                        </div>

                        <Controller
                            name="allowContactInfo"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <Checkbox
                                    label="Allow Contact Info"
                                    checked={value}
                                    onChange={onChange}
                                />
                            )}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button variant="outline" onClick={() => router.push(routes.guardrails.dashboard)}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        {id ? 'Update Guardrail' : 'Create Guardrail'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
