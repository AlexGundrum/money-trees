// frontend/app/main/layout.jsx
"use client"; // Still need "use client" for hooks

import NavBar from '@/components/NavBar';

export default function MainAppLayout({ children }) {
  return (
    <NavBar>
      {children}
    </NavBar>
  );
}