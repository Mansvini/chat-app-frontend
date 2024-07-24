import Navbar from '../components/ui/NavBar';
import { Toaster } from '../components/ui/toaster';
import { AuthProvider } from '../context/AuthContext';
import SocketManager from '../components/SocketManager';
import { ThemeProvider } from '../components/theme-provider';
import type { AppProps } from 'next/app';
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
    return (
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
            <Component {...pageProps} />
          <Toaster />
          <SocketManager />
        </ThemeProvider>
      </AuthProvider>
    );
  }
  
  export default MyApp;