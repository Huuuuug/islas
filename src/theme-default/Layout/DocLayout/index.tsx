import { usePageData, Content } from '@runtime';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import styles from './index.module.scss';
import { DocFooter } from '../../components/DocFooter';
import { Aside } from '../../components/Aside';

export function Doclayout() {
  const { siteData, toc, pagePath } = usePageData();
  const sidebarData = siteData.themeConfig?.sidebar || {};
  const { pathname } = useLocation();

  const matchedSiderbarKey = Object.keys(sidebarData).find((key) => {
    if (pathname.startsWith(key)) {
      return true;
    }
  });

  const matchedSidebar = sidebarData[matchedSiderbarKey] || [];
  return (
    <div className={styles.contentContainer}>
      <Sidebar sidebarData={matchedSidebar} pathname={pathname} />
      <div className={styles.content} flex="~ 1 shrink-0">
        <div className={styles.docContent}>
          <div className="islas-doc">
            <Content />
          </div>
          <DocFooter />
        </div>
        <div className={styles.asideContainer}>
          <Aside headers={toc} pagePath={pagePath} />
        </div>
      </div>
    </div>
  );
}
