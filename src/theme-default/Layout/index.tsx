import 'uno.css';
import '../styles/base.css';
import '../styles/vars.css';
import { usePageData } from '@runtime';
import { Nav } from '../components/Nav';
import { HomeLayout } from './HomeLayout';

export function Layout() {
  const pageData = usePageData();
  const { pageType } = pageData;

  const getContent = () => {
    if (pageType === 'home') {
      return <HomeLayout />;
    } else if (pageType === 'doc') {
      return <div>正文内容</div>;
    } else {
      return <div>404 页面</div>;
    }
  };

  return (
    <div>
      {/* Nav组件 */}
      <Nav />
      {getContent()}
    </div>
  );
}
