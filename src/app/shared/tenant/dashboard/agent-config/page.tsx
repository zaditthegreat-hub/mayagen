'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button, Input, Title, Text, Switch, ActionIcon } from 'rizzui';
import cn from '@core/utils/class-names';
import { PiX } from 'react-icons/pi';
import dynamic from 'next/dynamic';
import { SubmitHandler, Controller, useForm } from 'react-hook-form';
import { Form } from '@core/ui/form';
import FormGroup from '@/app/shared/form-group';
import FormFooter from '@core/components/form-footer';

import {
  getAgentProfile,
  updateAgentProfile,
  checkWAActive,
  checkTGActive,
  checkWebActive,
  checkWebAppStatus,
  connectWAToggle,
  disconnectWAToggle,
  connectTGToggle,
  disconnectTGToggle,
  connectWebToggle,
  disconnectWebToggle,
  connectWebApp,
  disconnectWebApp,
} from '@/api';

import ModalButton from '@/app/shared/modal-button';
import ConnectWhatsappModal from '@/app/shared/connect-whatsapp';

import AndroidIcon from '@core/components/icons/android';
import WebAppIcon from '@core/components/icons/webApp';
import WebIcon from '@core/components/icons/web';
import WhatsappIcon from '@core/components/icons/whatsapp';
import TelegramIcon from '@core/components/icons/telegram';
import InstagramIcon from '@core/components/icons/instagram';
import TikTokIcon from '@core/components/icons/tiktok';
import { FaQrcode } from 'react-icons/fa';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const QuillEditor = dynamic(() => import('@core/ui/quill-editor'), { ssr: false });

/* -------------------------------
      FORM TYPES & VALIDATION 
--------------------------------*/
type AgentProfileFormTypes = {
  tenant_id: string;
  tenant_name: string;
  agent_name: string;
  agent_persona: string;
  timezone: string;
  display_name: string;
};

const agentProfileFormSchema = z.object({
  tenant_id: z.string().min(1),
  tenant_name: z.string().min(1),
  agent_name: z.string().min(1),
  agent_persona: z.string().min(1),
  timezone: z.string().min(1),
  display_name: z.string().min(1),
});

/* -------------------------------
             TEAMS
--------------------------------*/
const teams = [
  {
    name: 'WhatsApp',
    icon: <WhatsappIcon className="h-9 w-9" />,
    content: 'Aktifkan atau non-aktifkan saluran chatbot via WhatsApp.',
    isAvailable: true,
    child: (
      <ModalButton
        label="Hubungkan WhatsApp"
        view={<ConnectWhatsappModal />}
        className="px-3 py-1 bg-green-600 text-white rounded-lg flex items-center hover:bg-green-700"
        icon={<FaQrcode className="mr-1" />}
      />
    ),
  },
  {
    name: 'Mayagen Visual WEB',
    icon: <WebIcon className="h-9 w-9" />,
    content: 'Aktifkan atau non-aktifkan saluran maya visual via Web.',
    isAvailable: true,
  },
  {
    name: 'Mayagen Visual APK',
    icon: <AndroidIcon className="h-9 w-9" />,
    content: 'Aktifkan atau non-aktifkan saluran maya visual via APK.',
    isAvailable: true,
  },
  {
    name: 'Web APP',
    icon: <WebIcon className="h-9 w-9" />,
    content: 'Aktifkan atau non-aktifkan chatbot via Web App.',
    isAvailable: true,
  },
  {
    name: 'Web Chat',
    icon: <WebAppIcon className="h-9 w-9" />,
    content: 'Aktifkan atau non-aktifkan chatbot via Web Chat.',
    url: 'https://figma.com/redQ',
    moreInfo: 'Kunjungi Website',
    isAvailable: true,
  },
  {
    name: 'Telegram',
    icon: <TelegramIcon className="h-9 w-9" />,
    content: 'Aktifkan atau non-aktifkan chatbot via Telegram.',
    isAvailable: true,
  },
  {
    name: 'Instagram',
    icon: <InstagramIcon className="h-9 w-9" />,
    content: 'Instagram belum tersedia.',
    isAvailable: false,
  },
  {
    name: 'TikTok',
    icon: <TikTokIcon className="h-9 w-9" />,
    content: 'TikTok belum tersedia.',
    isAvailable: false,
  },
];

/* -------------------------------
        MAIN PAGE COMPONENT
--------------------------------*/
export default function AgentConfigPage() {
  const { tenantId } = useParams();

  const [showBanner, setShowBanner] = useState(true);
  const [highlightTeams, setHighlightTeams] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [loadedProfile, setLoadedProfile] = useState<any>(null);

  const [channelStatuses, setChannelStatuses] = useState({
    whatsapp: false,
    telegram: false,
    web: false,
    webApp: false,
  });

  /* -------------------------------
        FETCH CHANNEL STATUS
  --------------------------------*/
  useEffect(() => {
    if (!tenantId) return;

    async function fetchStatus() {
      try {
        const [wa, tg, web, webApp] = await Promise.all([
          checkWAActive(tenantId),
          checkTGActive(tenantId),
          checkWebActive(tenantId),
          checkWebAppStatus(tenantId),
        ]);

        setChannelStatuses({
          whatsapp: wa.active,
          telegram: tg.active,
          web: web.active,
          webApp: webApp.active,
        });
      } catch (err) {
        console.error('Failed to fetch status:', err);
      }
    }

    fetchStatus();
  }, [tenantId]);

  /* -------------------------------
           SUBMIT HANDLER
  --------------------------------*/
  const onSubmit: SubmitHandler<AgentProfileFormTypes> = async (data) => {
    setIsLoading(true);
    try {
      await updateAgentProfile(data, tenantId);
    } catch (err) {
      console.error('Failed to update:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------------------
          TOGGLE CHANNEL
  --------------------------------*/
  const handleChannelToggle = async (teamName: string, isChecked: boolean) => {
    try {
      if (teamName === 'WhatsApp') {
        isChecked ? await connectWAToggle(tenantId) : await disconnectWAToggle(tenantId);
        setChannelStatuses((s) => ({ ...s, whatsapp: isChecked }));
      }

      if (teamName === 'Telegram') {
        isChecked ? await connectTGToggle(tenantId) : await disconnectTGToggle(tenantId);
        setChannelStatuses((s) => ({ ...s, telegram: isChecked }));
      }

      if (teamName === 'Web APP') {
        isChecked ? await connectWebToggle(tenantId) : await disconnectWebToggle(tenantId);
        setChannelStatuses((s) => ({ ...s, web: isChecked }));
      }

      if (teamName === 'Web Chat') {
        isChecked ? await connectWebApp(tenantId) : await disconnectWebApp(tenantId);
        setChannelStatuses((s) => ({ ...s, webApp: isChecked }));
      }
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  /* -------------------------------
            RENDER PAGE
  --------------------------------*/
  /* -------------------------------
        FORM SETUP
  --------------------------------*/
  const {
    register,
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<AgentProfileFormTypes>({
    resolver: zodResolver(agentProfileFormSchema),
    defaultValues: {
      tenant_id: tenantId ?? '',
      tenant_name: '',
      agent_name: '',
      agent_persona: '',
      timezone: '',
      display_name: '',
    },
  });

  /* -------------------------------
        RESET FORM WHEN PROFILE LOADED
  --------------------------------*/
  useEffect(() => {
    if (!tenantId) return;
    async function loadProfile() {
      const profile = await getAgentProfile(tenantId as string);
      reset({
        tenant_id: tenantId as string,
        ...profile,
      });
    }
    loadProfile();
  }, [tenantId, reset]);

  /* -------------------------------
            RENDER PAGE
  --------------------------------*/
  return (
    <div className="@container">

      {/* Promo Banner */}
      {showBanner && (
        <PromoBanner
          className="mt-10"
          onClose={setShowBanner}
          onActivate={() => {
            setHighlightTeams(['Mayagen Visual WEB', 'Mayagen Visual APK']);
            setTimeout(() => setHighlightTeams([]), 2000);
          }}
        />
      )}

      {/* ------------------ FORM ------------------ */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="@container"
      >
        <FormGroup
          title="Karakter Dasar Agent"
          description="Konfigurasi karakter dasar Maya."
          className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
        />

        <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">

          {/* INPUT FIELDS */}
          {['tenant_name', 'agent_name', 'timezone', 'display_name'].map((field) => (
            <FormGroup key={field} title={field.replace('_', ' ').toUpperCase()}>
              <Input
                placeholder={field.replace('_', ' ')}
                {...register(field as keyof AgentProfileFormTypes)}
                error={errors[field as keyof AgentProfileFormTypes]?.message}
              />
            </FormGroup>
          ))}

          {/* AGENT PERSONA */}
          <FormGroup title="Agent Persona" className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11">
            <Controller
              control={control}
              name="agent_persona"
              render={({ field }) => (
                <textarea
                  {...field}
                  className="w-full min-h-[100px] rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  placeholder="Masukkan persona agent..."
                />
              )}
            />
            {errors.agent_persona && (
              <p className="text-red-500 text-sm mt-1">
                {errors.agent_persona.message}
              </p>
            )}
          </FormGroup>
        </div>

        <FormFooter altBtnText="Cancel" submitBtnText="Save" isLoading={isLoading} />
      </form>

      <HorizontalFormBlockWrapper title="Saluran" description="Konfigurasi saluran yang cocok untuk layanan AI anda." />

      {/* CHANNEL LIST */}
      <div className="flex flex-col">
        {teams.map((team, idx) => (
          <div
            key={idx}
            className={cn(
              'col-span-2 my-3 flex gap-3 rounded-lg border border-muted p-6 sm:my-4 transition-all',
              !team.isAvailable && 'opacity-50',
              highlightTeams.includes(team.name) && 'border-yellow-400 bg-yellow-50'
            )}
          >
            <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden">{team.icon}</div>
            <div className="flex flex-grow flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Title as="h3" className="mb-1 text-base font-semibold">{team.name}</Title>
                <Text className="text-sm text-gray-500 transition-colors">{team.content}</Text>
                {team.url && (
                  <a href={team.url} target="_blank" rel="noopener noreferrer nofollow noindex" className="mt-3 inline-block w-auto flex-shrink-0 justify-start p-0 text-xs font-medium capitalize text-gray-900 sm:justify-center">
                    {team.moreInfo || 'Learn More'}
                  </a>
                )}

                {team.child && <div className="mt-3">{team.child}</div>}
              </div>
            </div>

            {/* SWITCH */}
            <Switch
              variant="flat"
              disabled={!team.isAvailable}
              checked={
                team.name === 'WhatsApp'
                  ? channelStatuses.whatsapp
                  : team.name === 'Telegram'
                    ? channelStatuses.telegram
                    : team.name === 'Web APP'
                      ? channelStatuses.web
                      : team.name === 'Web Chat'
                        ? channelStatuses.webApp
                        : false
              }
              onChange={(e) => handleChannelToggle(team.name, e.target.checked)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------
        EXTRA COMPONENTS
--------------------------------*/
function PromoBanner({ className, onClose, onActivate }: any) {
  return (
    <div className={cn('relative flex flex-col items-center overflow-hidden rounded-xl border border-muted xs:flex-row', className)}>
      <div className="relative h-full min-h-[200px] w-full sm:max-w-[223px]">
        <Image className="aspect-[223/170] rounded-t-xl object-cover xs:rounded-none xs:rounded-s-xl" src="/maya.png" alt="promo" fill />
      </div>
      <div className="flex flex-col justify-between p-5 pb-6 sm:p-6">
        <h5 className="mb-2 text-lg font-semibold tracking-tight text-gray-900">Update Terbaru Telah Hadir!</h5>
        <p className="mb-5 text-sm font-normal text-gray-500">Kenalkan, Maya – Asisten Virtual Visual terbaru kami.</p>
        <div className="flex items-center gap-3">
          <Button variant="solid" onClick={onActivate} className="w-full sm:w-auto">Aktifkan</Button>
        </div>
      </div>
      <ActionIcon variant="outline" rounded="full" className="absolute right-5 top-5" onClick={() => onClose(false)}>
        <PiX className="h-5 w-5" />
      </ActionIcon>
    </div>
  );
}

function HorizontalFormBlockWrapper({ title, titleClassName, description, children, className }: React.PropsWithChildren<{ title: React.ReactNode; description?: React.ReactNode; titleClassName?: string; className?: string }>) {
  return (
    <div className={cn('pb-3 pt-9 @2xl:grid @2xl:grid-cols-6 @2xl:pt-11', className)}>
      <div className="col-span-2 mb-6 @5xl:mb-0">
        <Title as="h6" className={cn('text-xl font-semibold', titleClassName)}>{title}</Title>
        {description && <Text className="mt-1 text-sm text-gray-500">{description}</Text>}
      </div>
      <div className="col-span-4">{children}</div>
    </div>
  );
}
