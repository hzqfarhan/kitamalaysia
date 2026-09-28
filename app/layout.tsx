import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Kita Malaysia — A little closer to home',
  description: 'Explore an interactive 3D Malaysia, discover six cultural stories, and collect stamps in your explorer passport.',
  icons: { icon: '/favicon.svg' },
};
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
