import type { ScenarioPlatform } from '../App';

export interface PlatformTheme {
  /** Name shown in the chat header (the person you're talking to) */
  contactName: string;
  /** Sub-line under the contact name in the header */
  contactStatus: string;
  /** Emoji used as the contact's avatar */
  contactAvatar: string;
  /** Short label for the app itself */
  appName: string;
  /** Accent colour for the app chrome (header bar etc.) */
  headerBg: string;
  headerFg: string;
  /** Colour of an incoming (their) bubble */
  theirBubbleBg: string;
  theirBubbleFg: string;
  /** Colour of an outgoing (your) bubble */
  myBubbleBg: string;
  myBubbleFg: string;
  /** Wallpaper behind the conversation */
  chatBg: string;
  /** What the little "sent" marker under your messages says */
  sentLabel: string;
  /** How the conversation is drawn. */
  renderStyle: 'bubble' | 'snapchat' | 'whatsapp' | 'roblox';
  /** snapchat/roblox: colour of the "you" label / bar */
  meColor?: string;
  /** snapchat/roblox: colour of the other person's label / bar */
  themColor?: string;
}

export const platformThemes: Record<ScenarioPlatform, PlatformTheme> = {
  roblox: {
    contactName: 'NeonShadow99',
    contactStatus: 'In game · BloxWorld RP',
    contactAvatar: '🎮',
    appName: 'Roblox',
    headerBg: 'transparent',
    headerFg: '#ffffff',
    theirBubbleBg: 'rgba(30,34,42,0.55)',
    theirBubbleFg: '#ffffff',
    myBubbleBg: 'rgba(30,34,42,0.55)',
    myBubbleFg: '#ffffff',
    chatBg:
      'radial-gradient(120% 80% at 70% 12%, rgba(255,255,255,0.35), transparent 60%), ' +
      'linear-gradient(180deg, #7fa8cf 0%, #a7c6e0 34%, #d8e6ef 46%, #cdd9e0 60%, #b9c4cb 100%)',
    sentLabel: 'Sent',
    renderStyle: 'roblox',
    meColor: '#3aa5ff',
    themColor: '#ff5470',
  },
  whatsapp: {
    contactName: 'Hartburn Legends ⚽🎮',
    contactStatus: 'Ben, Leo, Maya, you, +12',
    contactAvatar: '👥',
    appName: 'WhatsApp',
    headerBg: '#075e54',
    headerFg: '#ffffff',
    theirBubbleBg: '#ffffff',
    theirBubbleFg: '#111b21',
    myBubbleBg: '#d9fdd3',
    myBubbleFg: '#111b21',
    chatBg:
      "#efe7de url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90' viewBox='0 0 90 90'%3E%3Cg fill='none' stroke='%23d9cfc2' stroke-width='1.4'%3E%3Ccircle cx='12' cy='14' r='4'/%3E%3Cpath d='M60 8l6 6-6 6-6-6z'/%3E%3Cpath d='M30 60q8-10 16 0'/%3E%3Ccircle cx='74' cy='58' r='3'/%3E%3Cpath d='M18 40h10M23 35v10'/%3E%3Cpath d='M52 74l4 4 8-8'/%3E%3C/g%3E%3C/svg%3E\")",
    sentLabel: '✓✓',
    renderStyle: 'whatsapp',
  },
  snapchat: {
    contactName: 'Kai_X24',
    contactStatus: 'Active now',
    contactAvatar: '👻',
    appName: 'Snapchat',
    headerBg: '#ffffff',
    headerFg: '#111111',
    theirBubbleBg: '#f2f2f5',
    theirBubbleFg: '#111111',
    myBubbleBg: '#dbeeff',
    myBubbleFg: '#111111',
    chatBg: '#ffffff',
    sentLabel: 'Delivered',
    renderStyle: 'snapchat',
    meColor: '#f23c57',
    themColor: '#00aeff',
  },
};
