import 'uno.css';
import '../styles/base.css';
import '../styles/vars.css';
// import { usePageData } from '@runtime';
import { Nav } from '../components/Nav';

export function Layout() {
  // const pageData = usePageData();
  // const { pageType } = pageData;

  // const getContent = () => {
  //   if (pageType === 'home') {
  //     return <div>主页内容</div>;
  //   } else if (pageType === 'doc') {
  //     return <div>正文内容</div>;
  //   } else {
  //     return <div>404 页面</div>;
  //   }
  // };

  return (
    <div>
      {/* Nav组件 */}
      <Nav />
    </div>
  );
}
