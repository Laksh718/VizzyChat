import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'VizzyChat — Create. Imagine. Visualize.',
  description:
    'A conversational AI interface to generate stunning images, artworks, vision boards, and visual stories.',
  openGraph: {
    title: 'VizzyChat',
    description: 'Create. Imagine. Visualize.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
