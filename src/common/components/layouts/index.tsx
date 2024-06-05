import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = React.memo(({ children }) => {
  return <>{children}</>;
});

export default Layout;
