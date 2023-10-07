import 'uno.css';
import '../styles/base.css';
import '../styles/vars.css';
import '../styles/doc.css';
import { usePageData } from '@runtime';
import { Nav } from '../components/Nav';
import { HomeLayout } from './HomeLayout';
import { Doclayout } from './DocLayout';

export function Layout() {
  const pageData = usePageData();
  const { pageType } = pageData;

  const getContent = () => {
    if (pageType === 'home') {
      return <HomeLayout />;
    } else if (pageType === 'doc') {
      return <Doclayout />;
    } else {
      return <div>404 页面</div>;
    }
  };

  return (
    <div>
      {/* Nav组件 */}
      <Nav />
      <section style={{ paddingTop: 'var(--islas-nav-height)' }}>
        {getContent()}
      </section>
    </div>
  );
}
