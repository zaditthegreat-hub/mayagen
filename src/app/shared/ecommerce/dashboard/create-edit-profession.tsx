'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { SubmitHandler, Controller, useForm } from 'react-hook-form';
import { Input, Button, Title, Checkbox, Textarea, Text, ActionIcon } from 'rizzui';
import { PiPlusBold, PiPencilSimpleBold } from 'react-icons/pi';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { routes } from '@/config/routes';
import Link from 'next/link';
import cn from '@core/utils/class-names';

export type Profession = {
    id?: string;
    code: string;
    name: string;
    description: string;
    category: string;
    active: boolean;
};

// Persona Type for display
type PersonaSummary = {
    id: string;
    code: string;
    name: string;
    description: string;
    active: boolean;
    professionCode: string;
};

const professionSchema = z.object({
    code: z.string().min(1, 'Code is required'),
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    category: z.string().min(1, 'Category is required'),
    active: z.boolean(),
});

type ProfessionSchema = z.infer<typeof professionSchema>;

export default function CreateEditProfession({ id }: { id?: string }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(!!id);
    const [linkedPersonas, setLinkedPersonas] = useState<PersonaSummary[]>([]);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<ProfessionSchema>({
        defaultValues: {
            code: '',
            name: '',
            description: '',
            category: '',
            active: true,
        },
    });

    const professionCode = watch('code');

    useEffect(() => {
        const fetchData = async () => {
            if (id && session?.accessToken) {
                setIsFetching(true);
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

                    // 1. Fetch Profession
                    // 1. Fetch All Professions and filter by ID
                    const profResponse = await fetch(`${apiUrl}/api/v1/admin/professions`, {
                        headers: { Authorization: `Bearer ${session.accessToken}` },
                    });

                    if (!profResponse.ok) throw new Error('Failed to fetch professions');
                    const professions = await profResponse.json();
                    const profession = Array.isArray(professions) ? professions.find((p: any) => p.id === id) : null;

                    if (!profession) {
                        toast.error('Profession not found');
                        router.push(routes.professions.dashboard);
                        return;
                    }

                    reset({
                        code: profession.code,
                        name: profession.name,
                        description: profession.description,
                        category: profession.category,
                        active: profession.active,
                    });

                    // 2. Fetch Personas linked to this profession
                    const personaResponse = await fetch(`${apiUrl}/api/v1/admin/persona-templates`, {
                        headers: { Authorization: `Bearer ${session.accessToken}` },
                    });

                    if (personaResponse.ok) {
                        const personas: PersonaSummary[] = await personaResponse.json();
                        const linked = personas.filter(p => p.professionCode === profession.code);
                        setLinkedPersonas(linked);
                    }

                } catch (error) {
                    console.error('Error fetching data:', error);
                    toast.error('Error loading data');
                } finally {
                    setIsFetching(false);
                }
            } else {
                setIsFetching(false);
            }
        };
        fetchData();
    }, [id, session, reset, router]);

    const onSubmit: SubmitHandler<ProfessionSchema> = async (data) => {
        setIsLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const isEdit = !!id;
            const url = isEdit
                ? `${apiUrl}/api/v1/admin/professions/${id}`
                : `${apiUrl}/api/v1/admin/professions`;
            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success(`Profession ${isEdit ? 'updated' : 'created'} successfully`);
                router.push(routes.professions.dashboard);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || `Failed to ${isEdit ? 'update' : 'create'} profession`);
            }
        } catch (error) {
            console.error('Error saving profession:', error);
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
                    {id ? 'Edit Profession' : 'Create New Profession'}
                </Title>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Input
                            label="Code"
                            placeholder="e.g. DEV"
                            {...register('code')}
                            error={errors.code?.message}
                            disabled={!!id}
                        />
                        <Input
                            label="Name"
                            placeholder="e.g. Developer"
                            {...register('name')}
                            error={errors.name?.message}
                        />
                    </div>

                    <Textarea
                        label="Description"
                        placeholder="Profession description..."
                        {...register('description')}
                        error={errors.description?.message}
                    />

                    <Input
                        label="Category"
                        placeholder="e.g. IT"
                        {...register('category')}
                        error={errors.category?.message}
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
                </div>

                {/* Personas Section - Only show if in Edit mode (id exists) because we need the profession code to link */}
                {id && (
                    <>
                        <hr className="border-gray-200" />
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Title as="h5" className="font-semibold">Associated Personas</Title>
                            </div>
                            <Text className="text-sm text-gray-500">Manage personas linked to this profession.</Text>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {/* Create New Card */}
                                <Link
                                    href={`${routes.personaTemplates.create}?professionCode=${professionCode}`}
                                    className="flex flex-col items-center justify-center min-h-[150px] rounded-xl border-2 border-dashed border-gray-300 p-4 hover:border-primary hover:bg-gray-50 transition-colors group cursor-pointer"
                                >
                                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors mb-2">
                                        <PiPlusBold className="h-5 w-5 text-gray-500 group-hover:text-primary" />
                                    </div>
                                    <Text className="font-medium text-gray-900 group-hover:text-primary">Create New Persona</Text>
                                </Link>

                                {/* Existing Personas */}
                                {linkedPersonas.map((persona) => (
                                    <div key={persona.id} className="relative flex flex-col rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                {persona.code.substring(0, 2)}
                                            </div>
                                            <Link href={routes.personaTemplates.edit(persona.id)}>
                                                <ActionIcon size="sm" variant="text" className="hover:bg-gray-100">
                                                    <PiPencilSimpleBold className="h-4 w-4" />
                                                </ActionIcon>
                                            </Link>
                                        </div>
                                        <Title as="h6" className="font-medium mb-1 truncate" title={persona.name}>{persona.name}</Title>
                                        <Text className="text-xs text-gray-500 mb-3">{persona.code}</Text>
                                        <Text className="text-sm text-gray-600 line-clamp-2 mb-auto">{persona.description || 'No description'}</Text>
                                        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                                            <span className={cn("text-xs font-medium px-2 py-1 rounded-full", persona.active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")}>
                                                {persona.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button variant="outline" onClick={() => router.push(routes.professions.dashboard)}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        {id ? 'Update Profession' : 'Create Profession'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
