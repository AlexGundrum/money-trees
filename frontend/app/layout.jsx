// frontend/app/layout.jsx
import './globals.css'; // Import global styles (Tailwind)

// Metadata can be exported directly as an object
export const metadata = {
  title: 'FinStudent',
  description: 'Your College Finance Companion',
};

// No type annotations needed for props
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50">{children}</body>
    </html>
  );
}