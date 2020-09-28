import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Things',
    icon: 'keypad-outline',
    children: [
      {
        title: 'Devices',
        icon: 'film-outline',
        link: '/pages/things/devices',
      },
      {
        title: 'Channels',
        icon: 'flip-2-outline',
        link: '/pages/things/channels',
      },
      {
        title: 'LoRa',
        icon: 'radio-outline',
        link: '/pages/things/lora',
      },
      {
        title: 'OPC-UA',
        icon: 'globe-outline',
        link: '/pages/things/opcua',
      },
      {
        title: 'Gateways',
        icon: 'hard-drive-outline',
        link: '/pages/things/gateways',
      },
    ],
  },
  {
    title: 'Admin',
    icon: 'shield-outline',
    children: [
      {
        title: 'Twins',
        icon: 'copy-outline',
        link: '/pages/admin/twins',
      },
    ],
  },
];
