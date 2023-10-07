import { usePageData, Content } from '@runtime';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import styles from './index.module.scss';
import { DocFooter } from '../../components/DocFooter';

export function Doclayout() {
  const { siteData } = usePageData();
  const sidebarData = siteData.themeConfig?.sidebar || {};
  const { pathname } = useLocation();

  const matchedSiderbarKey = Object.keys(sidebarData).find((key) => {
    if (pathname.startsWith(key)) {
      return true;
    }
  });

  const matchedSidebar = sidebarData[matchedSiderbarKey] || [];
  return (
    <div>
      <Sidebar sidebarData={matchedSidebar} pathname={pathname} />
      <div className={styles.content}>
        <div className="islas-doc">
          <Content />
        </div>
        <DocFooter />
      </div>
    </div>
  );
}
