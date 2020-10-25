import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Users',
    icon: 'people-outline',
    link: '/pages/users',
  },
  {
    title: 'Things',
    icon: 'film-outline',
    link: '/pages/things',
  },
  {
    title: 'Channels',
    icon: 'flip-2-outline',
    link: '/pages/channels',
  },
  {
    title: 'Twins',
    icon: 'copy-outline',
    link: '/pages/twins',
  },
  {
    title: 'Services',
    icon: 'layers-outline',
    children: [
      {
        title: 'LoRa',
        icon: 'radio-outline',
        link: '/pages/services/lora',
      },
      {
        title: 'OPC-UA',
        icon: 'globe-outline',
        link: '/pages/services/opcua',
      },
      {
        title: 'Gateways',
        icon: 'hard-drive-outline',
        link: '/pages/services/gateways',
      },
    ],
  },
];
