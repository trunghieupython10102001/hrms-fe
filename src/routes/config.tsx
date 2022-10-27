import { FC, ReactElement } from 'react';
import { RouteProps } from 'react-router';
import PrivateRoute from './PrivateRoute';
// import { useIntl } from 'react-intl';

export interface WrapperRouteProps extends RouteProps {
  /** document title locale id */
  titleId: string;
  /** authorization？ */
  auth?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WrapperRouteComponent: FC<WrapperRouteProps> = ({ titleId, auth, ...props }) => {
  // const { formatMessage } = useIntl();

  // if (titleId) {
  //   document.title = formatMessage({
  //     id: titleId,
  //   });
  // }

  return auth ? <PrivateRoute {...props} /> : (props.element as ReactElement);
};

export default WrapperRouteComponent;
