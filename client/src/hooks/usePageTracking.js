import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../analytics';

export default function usePageTracking() {
  const { pathname } = useLocation();

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);
}
