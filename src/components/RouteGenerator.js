import { useSelector } from 'react-redux';
import { useRoutes } from 'react-router-dom';
import { ROUTES } from '../routes/index'

const RouteGenerator = () => {
  const { userInfo } = useSelector(state => state.userLogin)
  const routing = useRoutes(ROUTES(userInfo && userInfo.isAdmin));

  return routing
}

export default RouteGenerator;