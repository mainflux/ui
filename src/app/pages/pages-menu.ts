import { environment } from 'environments/environment';
import { NbMenuItem } from '@nebular/theme';

const appPrefix = '/' + environment.appPrefix ;
export const MENU_ITEMS: NbMenuItem[] = environment.production ?
  [
    {
      title: 'Home',
      icon: 'home-outline',
      link: appPrefix + '/pages/home',
      home: true,
    },
    {
      title: 'Things',
      icon: 'film-outline',
      link: appPrefix + '/pages/things',
    },
    {
      title: 'Channels',
      icon: 'flip-2-outline',
      link: appPrefix + '/pages/channels',
    },
  ] :
  [
    {
      title: 'Home',
      icon: 'home-outline',
      link: appPrefix + '/pages/home',
      home: true,
    },
    {
      title: 'User Groups',
      icon: 'shield-outline',
      link: appPrefix + '/pages/users/groups',
    },
    {
      title: 'Users',
      icon: 'people-outline',
      link: appPrefix + '/pages/users',
    },
    {
      title: 'Things',
      icon: 'film-outline',
      link: appPrefix + '/pages/things',
    },
    {
      title: 'Channels',
      icon: 'flip-2-outline',
      link: appPrefix + '/pages/channels',
    },
    {
      title: 'Services',
      icon: 'layers-outline',
      children: [
        {
          title: 'Twins',
          icon: 'copy-outline',
          link: '/pages/twins',
        },
        {
          title: 'LoRa',
          icon: 'radio-outline',
          link: appPrefix + '/pages/services/lora',
        },
        {
          title: 'OPC-UA',
          icon: 'globe-outline',
          link: appPrefix + '/pages/services/opcua',
        },
        {
          title: 'Gateways',
          icon: 'hard-drive-outline',
          link: appPrefix + '/pages/services/gateways',
        },
      ],
    },
  ];
