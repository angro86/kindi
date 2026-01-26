import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kindi - Educational Videos for Kids',
  description: 'Curated educational videos for kids ages 2-8 with quizzes and rewards',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
