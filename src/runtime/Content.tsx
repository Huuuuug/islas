import { useRoutes } from 'react-router-dom';
import { routes } from 'islas:routes';

export const Content = () => {
  console.log(111);

  const routeElement = useRoutes(routes);
  return routeElement;
};
