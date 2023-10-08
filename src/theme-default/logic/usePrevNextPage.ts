import { usePageData } from '@runtime';
import { useLocation } from 'react-router-dom';
import { SidebarItem } from 'shared/types';

export function usePrevNextPage() {
  const { pathname } = useLocation();
  const { siteData } = usePageData();

  const sidebar = siteData.themeConfig?.sidebar || {};
  const falttenTitles: SidebarItem[] = [];

  Object.keys(sidebar).forEach((key) => {
    const groups = sidebar[key] || [];
    groups.forEach((group) => {
      group.items.forEach((item) => {
        falttenTitles.push(item);
      });
    });
  });

  const pageIndex = falttenTitles.findIndex((item) => item.link === pathname);

  const prevPage = falttenTitles[pageIndex - 1] || null;
  const nextPage = falttenTitles[pageIndex + 1] || null;

  return {
    prevPage,
    nextPage
  };
}
