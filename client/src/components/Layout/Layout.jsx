import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import usePageTracking from '../../hooks/usePageTracking';

export default function Layout() {
  usePageTracking();

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
