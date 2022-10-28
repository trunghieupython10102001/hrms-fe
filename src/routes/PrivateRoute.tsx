import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteProps, useLocation } from 'react-router';
import { useSelector } from 'react-redux';

const PrivateRoute: FC<RouteProps> = props => {
  const logged = useSelector(state => state.user.logged);
  const location = useLocation();

  if (!logged) {
    return <Navigate to={`/login${'?from=' + encodeURIComponent(location.pathname)}`} replace />;
  }

  return props.element as React.ReactElement;
};

export default PrivateRoute;
