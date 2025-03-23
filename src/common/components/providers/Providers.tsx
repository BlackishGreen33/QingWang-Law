// import { type ThemeProviderProps } from "next-themes/dist/types";
import * as React from 'react';

// import ProgressBar from '@/common/components/elements/ProgressBar';
import Layout from '@/common/components/layouts';
// import { ModalProvider } from '@/common/components/providers/modal-provider';
import StyledComponentsRegistry from '@/common/libs/registry';
import GlobalStyles from '@/common/styles/GlobalStyles';

import { ThemeProvider } from './ThemeProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = React.memo(({ children }) => (
  <StyledComponentsRegistry>
    <GlobalStyles />
    <ThemeProvider
      attribute="class"
      defaultTheme="theme"
      enableSystem
      disableTransitionOnChange
    >
      {/* <ModalProvider /> */}
      <Layout>{children}</Layout>
    </ThemeProvider>
  </StyledComponentsRegistry>
));

export default Providers;
