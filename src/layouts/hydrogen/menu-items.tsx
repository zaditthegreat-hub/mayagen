import { DUMMY_ID } from '@/config/constants';
import { routes } from '@/config/routes';
import DribbleIcon from '@core/components/icons/dribble';
import {
  PiAirplaneTiltDuotone,
  PiApplePodcastsLogoDuotone,
  PiArrowsOutDuotone,
  PiArrowsOutLineHorizontalDuotone,
  PiBellSimpleRingingDuotone,
  PiBinocularsDuotone,
  PiBriefcaseDuotone,
  PiBrowserDuotone,
  PiCalendarDuotone,
  PiCalendarPlusDuotone,
  PiCaretCircleUpDownDuotone,
  PiChartBarDuotone,
  PiChartLineUpDuotone,
  PiChartPieSliceDuotone,
  PiChatCenteredDotsDuotone,
  PiClipboardTextDuotone,
  PiCodesandboxLogoDuotone,
  PiCoinDuotone,
  PiCreditCardDuotone,
  PiCurrencyCircleDollarDuotone,
  PiCurrencyDollarDuotone,
  PiDribbbleLogo,
  PiEnvelopeDuotone,
  PiEnvelopeSimpleOpenDuotone,
  PiFeatherDuotone,
  PiFolderDuotone,
  PiFolderLockDuotone,
  PiFoldersDuotone,
  PiFolderUserDuotone,
  PiGridFourDuotone,
  PiHammerDuotone,
  PiHeadsetDuotone,
  PiHourglassSimpleDuotone,
  PiHouseLineDuotone,
  PiListNumbersDuotone,
  PiLockKeyDuotone,
  PiMapPinLineDuotone,
  PiNewspaperClippingDuotone,
  PiNoteBlankDuotone,
  PiPackageDuotone,
  PiPresentationChartDuotone,
  PiPushPinDuotone,
  PiRocketLaunchDuotone,
  PiScalesDuotone,
  PiShapesDuotone,
  PiShieldCheckDuotone,
  PiShootingStarDuotone,
  PiShoppingCartDuotone,
  PiSparkleDuotone,
  PiSquaresFourDuotone,
  PiStairsDuotone,
  PiStepsDuotone,
  PiTableDuotone,
  PiUserCircleDuotone,
  PiUserDuotone,
  PiUserGearDuotone,
  PiUserPlusDuotone,
  PiUsersDuotone,
} from 'react-icons/pi';

// Note: do not add href in the label object, it is rendering as label
export const adminMenuItems = [
  // label start
  {
    name: 'Overview',
  },
  // label end
  {
    name: 'Dashboard',
    href: '/',
    icon: <PiFolderDuotone />,
  },
  {
    name: 'Plans',
    href: routes.plans.dashboard,
    icon: <PiClipboardTextDuotone />,
  },
  {
    name: 'Professions',
    href: routes.professions.dashboard,
    icon: <PiBriefcaseDuotone />,
  },

  {
    name: 'Tenants',
    href: routes.tenants.dashboard,
    icon: <PiUserGearDuotone />,
  },
  {
    name: 'Users',
    href: routes.users.dashboard,
    icon: <PiUsersDuotone />,
  },
  {
    name: 'Guardrails',
    href: routes.guardrails.dashboard,
    icon: <PiShieldCheckDuotone />,
  },
  {
    name: 'Playground',
    href: routes.conversation.playground,
    icon: <PiDribbbleLogo />,
  },
];

export const tenantMenuItems = [
  // label start
  {
    name: 'Overview',
  },
  // label end
  {
    name: 'Dashboard',
    href: '/',
    icon: <PiFolderDuotone />,
  },

  {
    name: 'Subscriptions',
    href: routes.plans.dashboard,
    icon: <PiClipboardTextDuotone />,
  },
  {
    name: 'Users',
    href: routes.users.dashboard,
    icon: <PiUsersDuotone />,
  },
  {
    name: 'Guardrails',
    href: routes.guardrails.dashboard,
    icon: <PiShieldCheckDuotone />,
  },
  {
    name: 'Playground',
    href: routes.conversation.playground,
    icon: <PiDribbbleLogo />,
  },
];

export const menuItems = adminMenuItems; // Default fallback
