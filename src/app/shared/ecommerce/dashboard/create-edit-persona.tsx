'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { SubmitHandler, Controller, useFieldArray, useForm } from 'react-hook-form';
import { Input, Button, Title, Text, Checkbox, Textarea, Select, ActionIcon } from 'rizzui';
import { PiPlusBold, PiTrashBold } from 'react-icons/pi';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { routes } from '@/config/routes';
import cn from '@core/utils/class-names';

// Define the persona type based on the API response
export type Persona = {
    id?: string;
    code: string;
    name: string;
    description: string | null;
    professionCode: string;
    professionName?: string;
    baseSystem: string;
    baseStyle: string;
    baseExamples: { user: string; assisten: string }[];
    defaultVoice: string;
    active: boolean;
};

// Zod schema for validation
const personaSchema = z.object({
    code: z.string().min(1, 'Code is required'),
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    professionCode: z.string().min(1, 'Profession Code is required'),
    baseSystem: z.string().min(1, 'Base System is required'),
    baseStyle: z.string().min(1, 'Base Style is required'),
    defaultVoice: z.string().min(1, 'Default Voice is required'),
    active: z.boolean(),
    baseExamples: z.array(
        z.object({
            user: z.string().min(1, 'User input is required'),
            assisten: z.string().min(1, 'Assistant response is required'),
        })
    ),
});

type PersonaSchema = z.infer<typeof personaSchema>;

export default function CreateEditPersona({ id }: { id?: string }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(!!id);
    const [professions, setProfessions] = useState<{ label: string; value: string }[]>([]);
    const [personaData, setPersonaData] = useState<Persona | undefined>(undefined);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<PersonaSchema>({
        defaultValues: {
            code: '',
            name: '',
            description: '',
            professionCode: '',
            baseSystem: '',
            baseStyle: '',
            defaultVoice: 'id-ID-GadisNeural',
            active: true,
            baseExamples: [{ user: '', assisten: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'baseExamples',
    });

    // Fetch professions
    useEffect(() => {
        const fetchProfessions = async () => {
            if (session?.accessToken) {
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                    const response = await fetch(`${apiUrl}/api/v1/admin/professions`, {
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`,
                        },
                    });
                    if (response.ok) {
                        const result = await response.json();
                        setProfessions(result.map((p: any) => ({ label: `${p.name} (${p.code})`, value: p.code })));
                    }
                } catch (error) {
                    console.error('Error fetching professions:', error);
                }
            }
        };
        fetchProfessions();
    }, [session]);

    // Fetch persona data if id is provided
    useEffect(() => {
        const fetchPersona = async () => {
            if (id && session?.accessToken) {
                setIsFetching(true);
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                    // Fetch all personas and filter by ID since there is no get-by-id endpoint
                    const response = await fetch(`${apiUrl}/api/v1/admin/persona-templates`, {
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`,
                        },
                    });

                    if (response.ok) {
                        const result = await response.json();
                        // Result is an array of personas
                        const persona = Array.isArray(result) ? result.find((p: any) => p.id === id) : null;

                        if (persona) {
                            setPersonaData(persona);
                            reset({
                                code: persona.code,
                                name: persona.name,
                                description: persona.description || '',
                                professionCode: persona.professionCode,
                                baseSystem: persona.baseSystem,
                                baseStyle: persona.baseStyle,
                                defaultVoice: persona.defaultVoice,
                                active: persona.active,
                                baseExamples: persona.baseExamples && persona.baseExamples.length > 0 ? persona.baseExamples : [{ user: '', assisten: '' }],
                            });
                        } else {
                            toast.error('Persona not found');
                            router.push(routes.personaTemplates.dashboard);
                        }
                    } else {
                        toast.error('Failed to fetch persona details');
                    }
                } catch (error) {
                    console.error('Error fetching persona:', error);
                    toast.error('Error loading persona');
                } finally {
                    setIsFetching(false);
                }
            } else {
                setIsFetching(false);
            }
        };
        fetchPersona();
    }, [id, session, reset]);


    const onSubmit: SubmitHandler<PersonaSchema> = async (data) => {
        setIsLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const isEdit = !!id;
            const url = isEdit
                ? `${apiUrl}/api/v1/admin/persona-templates/${id}`
                : `${apiUrl}/api/v1/admin/persona-templates`;
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
                toast.success(`Persona ${isEdit ? 'updated' : 'created'} successfully`);
                router.push(routes.personaTemplates.dashboard);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || `Failed to ${isEdit ? 'update' : 'create'} persona`);
            }
        } catch (error) {
            console.error('Error saving persona:', error);
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
                    {id ? 'Edit Persona' : 'Create New Persona'}
                </Title>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input
                        label="Code"
                        placeholder="e.g. CS-GENERAL"
                        {...register('code')}
                        error={errors.code?.message}
                        disabled={!!id}
                    />
                    <Input
                        label="Name"
                        placeholder="e.g. Customer Service General"
                        {...register('name')}
                        error={errors.name?.message}
                    />
                </div>

                <Textarea
                    label="Description"
                    placeholder="Persona description..."
                    {...register('description')}
                    error={errors.description?.message}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Controller
                        name="professionCode"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Select
                                label="Profession"
                                options={professions}
                                value={value}
                                onChange={(selected: any) => onChange(selected.value)}
                                error={errors.professionCode?.message}
                                displayValue={(selected) =>
                                    professions.find((p) => p.value === selected)?.label ?? selected
                                }
                            />
                        )}
                    />
                    <Input
                        label="Default Voice"
                        placeholder="e.g. id-ID-GadisNeural"
                        {...register('defaultVoice')}
                        error={errors.defaultVoice?.message}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Textarea
                        label="Base System"
                        placeholder="System instructions..."
                        {...register('baseSystem')}
                        error={errors.baseSystem?.message}
                        className="h-full"
                        textareaClassName="h-32"
                    />
                    <Textarea
                        label="Base Style"
                        placeholder="Style instructions..."
                        {...register('baseStyle')}
                        error={errors.baseStyle?.message}
                        className="h-full"
                        textareaClassName="h-32"
                    />
                </div>

                <div className="rounded-md border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <Text className="font-semibold text-gray-900">Base Examples</Text>
                        <Button size="sm" variant="outline" onClick={() => append({ user: '', assisten: '' })}>
                            <PiPlusBold className="mr-1" /> Add Example
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-3 items-start p-3 bg-gray-50 rounded-md">
                                <div className="flex-1 grid grid-cols-1 gap-3">
                                    <Input
                                        label={index === 0 ? "User says" : undefined}
                                        placeholder="User says..."
                                        {...register(`baseExamples.${index}.user` as const)}
                                        error={errors.baseExamples?.[index]?.user?.message}
                                    />
                                    <Input
                                        label={index === 0 ? "Assistant replies" : undefined}
                                        placeholder="Assistant replies..."
                                        {...register(`baseExamples.${index}.assisten` as const)}
                                        error={errors.baseExamples?.[index]?.assisten?.message}
                                    />
                                </div>
                                <ActionIcon
                                    variant="text"
                                    color="danger"
                                    onClick={() => remove(index)}
                                    className={cn("mt-1", index === 0 && "mt-8")}
                                >
                                    <PiTrashBold className="w-5 h-5" />
                                </ActionIcon>
                            </div>
                        ))}
                    </div>
                </div>

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
                    <Button variant="outline" onClick={() => router.push(routes.personaTemplates.dashboard)}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        {id ? 'Update Persona' : 'Create Persona'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
