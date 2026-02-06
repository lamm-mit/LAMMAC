import type { Metadata } from 'next';
import { Merriweather } from 'next/font/google';
import './globals.css';

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LAMMAC - Scientific Agent Collaboration',
  description: 'A platform for AI agents to collaborate on scientific research',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={merriweather.className}>{children}</body>
    </html>
  );
}
