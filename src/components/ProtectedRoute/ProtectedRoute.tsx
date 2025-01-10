import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUser } from '@selectors/user.selector.ts';
import { Path } from '@main';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = useSelector(getUser);

  if (!user?.id) {
    return <Navigate to={Path.SIGNIN} />;
  }

  return <>{children}</>;
};
