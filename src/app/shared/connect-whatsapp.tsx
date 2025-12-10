'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { ActionIcon, Button, Text, Title } from 'rizzui';
import { PiXBold } from 'react-icons/pi';
import Image from 'next/image';
import cn from '@core/utils/class-names';
import { toast } from 'react-hot-toast';
import styles from './CheckmarkAnimation.module.css';

// API kamu
import { connectWA, getWAStatus } from '@/api';

export default function WhatsappConnectModal() {
  const { tenantId } = useParams();
  const { closeModal } = useModal();

  const [qrCodeImageSrc, setQrCodeImageSrc] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('Memuat QR Code...');
  const [isConnected, setIsConnected] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- Load QR Code ---
  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        setStatusText('Mengambil QR Code...');
        const data = await connectWA(tenantId);
        setQrCodeImageSrc(data.cleanBase64);
        setStatusText('Scan QR Code menggunakan WhatsApp Anda');
      } catch (error) {
        console.error('Gagal mengambil QR:', error);
        setStatusText('Gagal memuat QR Code');
      }
    };

    fetchQRCode();
  }, [tenantId]);

  // --- Polling status sampai "connected" ---
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const wa = await getWAStatus(tenantId);
        console.log("WA Status:", wa.status);

        if (wa.status === 'connected') {
          setIsConnected(true);
          setStatusText('WhatsApp berhasil terhubung ✅');

          toast.success(<Text as="b">WhatsApp berhasil terhubung!</Text>);

          clearInterval(intervalRef.current!);

          setTimeout(() => closeModal(), 3000);
        }
      } catch (err) {
        console.error("Error checking WA:", err);
      }
    };

    // Jalankan pertama kali langsung
    checkStatus();

    // Interval 5 detik
    intervalRef.current = setInterval(checkStatus, 5000);

    return () => clearInterval(intervalRef.current!);
  }, [closeModal, tenantId]);

  return (
    <div className="m-auto px-5 pb-8 pt-5 @lg:pt-6 @2xl:px-7">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Title as="h3" className="text-lg">
          Hubungkan WhatsApp
        </Title>
        <ActionIcon
          size="sm"
          variant="text"
          onClick={() => closeModal()}
          className="p-0 text-gray-500 hover:!text-gray-900"
        >
          <PiXBold className="h-[18px] w-[18px]" />
        </ActionIcon>
      </div>

      {/* QR Code */}
      <div className="flex flex-col items-center justify-center space-y-4">
        {qrCodeImageSrc ? (
          <div className="relative">
            <Image
              src={'data:image/png;base64,' + qrCodeImageSrc}
              alt="QR Code WhatsApp"
              width={200}
              height={200}
              className="rounded-lg border border-gray-200 shadow-sm"
            />

            {isConnected && (
              <div className={styles.CheckmarkOverlay}>
                <svg
                  className={styles.Checkmark}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52"
                >
                  <g
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                  >
                    <circle className={styles.CheckmarkCircle} cx="26" cy="26" r="25" />
                    <path className={styles.CheckmarkCheck} d="M14 27l7 7 16-16" />
                  </g>
                </svg>
              </div>
            )}
          </div>
        ) : (
          <div
            className="animate-spin inline-block w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
            role="status"
          ></div>
        )}

        <Text className="text-gray-600 text-center">{statusText}</Text>
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-end gap-3">
        <Button
          variant="outline"
          className={cn('w-full')}
          onClick={() => closeModal()}
        >
          Tutup
        </Button>
      </div>
    </div>
  );
}
