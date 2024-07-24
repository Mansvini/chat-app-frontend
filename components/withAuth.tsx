"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const withAuth = (WrappedComponent: React.ComponentType, requiresAuth = true) => {
  const ComponentWithAuth = (props: any) => {
    const router = useRouter();
    const {isAuthenticated} = useAuth();

    useEffect(() => {
      if (requiresAuth && !isAuthenticated) {
        router.push('/login');
      } else if (!requiresAuth && isAuthenticated) {
        router.push('/');
      }
    }, []);

    if (requiresAuth && !isAuthenticated) return null;
    if (!requiresAuth && isAuthenticated) return null;

    return <WrappedComponent {...props} />;
  };

  ComponentWithAuth.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;

  return ComponentWithAuth;
};

const getDisplayName = (WrappedComponent: any) => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

export default withAuth;