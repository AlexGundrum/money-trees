// frontend/app/layout.jsx
import './globals.css'; // Import global styles (Tailwind)
import { Inter } from 'next/font/google';

// Configure the Inter font - must be called directly in module scope
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

// Metadata can be exported directly as an object
export const metadata = {
  title: 'MoneyTree - Grow Your Financial Future',
  description: 'A forest-themed personal finance application to help you grow your financial future',
};

// No type annotations needed for props
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-green-50 min-h-screen">{children}</body>
    </html>
  );
}