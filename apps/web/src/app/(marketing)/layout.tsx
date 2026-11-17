import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AuthModalProvider } from '@/components/auth/auth-modal-context';
import { AuthModal } from '@/components/auth/auth-modal';

// ---------------------------------------------------------------------------
// Marketing layout — wraps all public marketing pages.
// Route group: (marketing) — does not affect URL paths.
// ---------------------------------------------------------------------------
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthModalProvider>
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
      <AuthModal />
    </AuthModalProvider>
  );
}
