// frontend/app/(main)/layout.jsx
"use client"; // Still need "use client" for hooks

import { useState, useRef, useEffect } from "react";
import { Menu, X, Home, PiggyBank, BookOpen, BarChart2, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // Use for logout navigation

// No type annotations needed for props
export default function MainAppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null); // No type needed for ref
  const router = useRouter(); // For logout
  const pathname = usePathname();

  // Effect for closing sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (event) => { // No type needed for event
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest("[data-menu-trigger]")
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = () => {
    console.log("Logout triggered (Fake)");
    closeSidebar();
    router.push('/'); // Redirect to login page
  }

  const navItems = [
    { name: 'Dashboard', path: '/main/dashboard', icon: '📊' },
    { name: 'Budgeting', path: '/main/budgeting', icon: '💰' },
    { name: 'Savings Goal', path: '/main/savings', icon: '🎯' },
    { name: 'Education', path: '/main/education', icon: '📚' },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Sidebar Overlay for mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-white w-64 shadow-lg z-30 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
         {/* Sidebar content */}
         <div className="p-6 flex justify-between items-center border-b border-slate-200">
            <h1 className="text-blue-800 font-semibold text-xl">FinStudent</h1>
            <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-slate-100 transition-colors md:hidden" aria-label="Close menu"><X size={20} /></button>
         </div>
         <nav className="p-4 flex flex-col h-[calc(100vh-65px)]">
             <ul className="space-y-2 flex-grow">
                 {/* Update hrefs */}
                 {navItems.map((item) => (
                   <li key={item.path}>
                     <Link
                       href={item.path}
                       className={`flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                         pathname === item.path
                           ? 'bg-blue-50 text-blue-600'
                           : ''
                       }`}
                       onClick={closeSidebar}
                     >
                       <span className="text-xl">{item.icon}</span>
                       <span>{item.name}</span>
                     </Link>
                   </li>
                 ))}
             </ul>
             <div className="mt-auto pb-4">
                 <button className="flex items-center gap-3 p-3 w-full rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors" onClick={handleLogout}><LogOut size={18} /><span>Logout</span></button>
             </div>
         </nav>
      </div>

      {/* Main Content Area */}
      <main className="md:ml-64">
         {/* Mobile header */}
         <div className="sticky top-0 bg-slate-50/80 backdrop-blur-sm z-10 p-4 md:p-6 flex items-center border-b border-slate-200 md:hidden">
             <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-slate-200 transition-colors mr-3" aria-label="Menu" data-menu-trigger>
                 <Menu size={24} />
             </button>
             <h1 className="text-blue-800 font-semibold text-xl">FinStudent</h1>
         </div>

         {/* Page content */}
          <div className="p-6 md:p-8">
             <div className="max-w-7xl mx-auto">
               {children} {/* Page content injected here */}
             </div>
          </div>
      </main>
    </div>
  );
}