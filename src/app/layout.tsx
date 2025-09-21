import { HoverProvider } from './context/HoverContext';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <HoverProvider>{children}</HoverProvider>
      </body>
    </html>
  );
}