'use client';

import Image from 'next/image';
import { PiDribbbleLogo } from 'react-icons/pi';
import { Box } from 'rizzui/box';
import { Button } from 'rizzui/button';
import { Flex } from 'rizzui/flex';
import { Text, Title } from 'rizzui/typography';
// import { useAudioPlayerContext } from './music-player/audio-player-context';
import cn from '@core/utils/class-names';

export default function PlaygroundBanner({ className }: { className?: string }) {
  // const { isPlaying, handlePlayPause } = useAudioPlayerContext();
  return (
    <Flex
      justify="between"
      align="center"
      className={cn(
        'relative z-[1] overflow-hidden rounded-xl bg-[linear-gradient(268.48deg,#E3E4E6_0%,#F1F1F1_94.14%)] @container dark:bg-[linear-gradient(#181818,#181818)]',
        className
      )}
    >
      <Box className="max-w-[390px] space-y-3 p-5 py-7 @md:py-10 @2xl:max-w-[420px] @2xl:px-7 @3xl:max-w-[510px] @4xl:max-w-[580px] @4xl:pl-10 @5xl:max-w-[620px] @5xl:pl-14 @7xl:max-w-[700px] @7xl:pl-20">
        <Text className="text-xs text-gray-900 @7xl:text-lg">
          Playground Preview
        </Text>
        <Title
          as="h1"
          className="font-inter text-2xl font-semibold capitalize !leading-normal @3xl:text-3xl @5xl:text-4xl"
        >
          Coba dan uji persona AI.
        </Title>
        <Text className="text-sm text-gray-900 @7xl:text-xl @7xl:leading-relaxed">
          Lingkungan sandbox untuk menguji prompt, gaya bahasa, dan alur percakapan.
        </Text>
        <Button className="!mt-7 gap-2"
        // onClick={handlePlayPause}
        >
          {/* {isPlaying ? (
            <PiPauseFill className="size-4" />
          ) : ( */}
          <PiDribbbleLogo className="size-4" />
          {/* )} */}
          <span>Kunjungi Playground</span>
        </Button>
      </Box>
      <Box className="self-end pr-3 @md:pr-6 @4xl:pr-14">
        <Image
          src="/maya.webp"
          alt="welcome image"
          height={720}
          width={666}
          priority
          className="
            max-w-[120px]
            @sm:max-w-[150px]
            @md:max-w-[180px]
            @xl:max-w-[220px]
            @2xl:max-w-[250px]
            @4xl:max-w-[280px]
            @6xl:max-w-[400px]"
        />
      </Box>

    </Flex>
  );
}
