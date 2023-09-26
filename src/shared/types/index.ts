import { UserConfig as ViteConfiguration } from 'vite';

export type NavItemWithLink = {
  text: string;
  link: string;
};

export type SidebarItem = {
  text: string;
  link: string;
};

export interface SidebarGroup {
  text: string;
  item: SidebarItem[];
}

export type Sidebar = {
  [path: string]: SidebarGroup[];
};

export interface Footer {
  message: string;
}

export interface ThemeConfig {
  nav?: NavItemWithLink[];
  sidebar?: Sidebar;
  footer?: Footer;
}

export interface UserConfig {
  title?: string;
  description?: string;
  themeConfig?: ThemeConfig;
  vite?: ViteConfiguration;
}

export interface SiteConifg {
  root: string;
  configPath: string;
  siteData: UserConfig;
}
