"use client"

import { useState, useRef, useEffect } from "react"
import { Menu, X, Home, PiggyBank, BookOpen, BarChart2, LogOut, Leaf, User, Settings, Wallet } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"

const NavBar = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const sidebarRef = useRef(null)
  const profileRef = useRef(null)
  const pathname = usePathname()
  const router = useRouter()

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest("[data-menu-trigger]")
      ) {
        setIsSidebarOpen(false)
      }
      
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        !event.target.closest("[data-profile-trigger]")
      ) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }
  
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen)
  }

  const handleNavigation = (href) => {
    // Force page refresh for navigation
    window.location.href = href
    setIsSidebarOpen(false)
  }

  const navItems = [
    { href: "/main/dashboard", icon: Home, label: "Dashboard" },
    { href: "/main/budgeting", icon: Wallet, label: "Budgeting" },
    { href: "/main/savings", icon: PiggyBank, label: "Savings" },
    { href: "/main/forest", icon: Leaf, label: "Forest" },
    { href: "/main/education", icon: BookOpen, label: "Education" },
    { href: "/main/whatif", icon: BarChart2, label: "What-If" },
  ]

  // MoneyTree logo component
  const MoneyTreeLogo = () => (
    <div className="flex items-center">
      <div className="relative w-8 h-8 rounded-md bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white mr-2 shadow-sm overflow-hidden">
        <div className="absolute w-full h-1/2 bottom-0 bg-green-900/20"></div>
        <Leaf size={16} className="relative z-10" />
        <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-300 rounded-full opacity-80"></div>
      </div>
      <h1 className="text-green-800 font-semibold text-xl">MoneyTree</h1>
    </div>
  )

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm border-b border-green-100 fixed top-0 left-0 right-0 z-20 h-16">
        <div className="px-4 h-full flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-green-100 transition-colors mr-3"
              aria-label="Menu"
              data-menu-trigger
            >
              <Menu size={24} className="text-green-800" />
            </button>
            
            <MoneyTreeLogo />
          </div>
          
          {/* Profile Section */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={toggleProfile}
              className="flex items-center gap-2 p-2 rounded-full hover:bg-green-100 transition-colors"
              aria-label="Profile"
              data-profile-trigger
            >
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">
                <User size={18} />
              </div>
              <span className="hidden md:block text-sm font-medium">Chris Doe</span>
            </button>
            
            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-green-100 py-1 z-30">
                <div className="px-4 py-3 border-b border-green-100">
                  <p className="text-sm font-medium text-gray-700">Chris Doe</p>
                  <p className="text-xs text-gray-500">chris@example.com</p>
                </div>
                <a
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <User size={16} />
                  <span>Your Profile</span>
                </a>
                <a
                  href="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </a>
                <div className="border-t border-green-100 mt-1"></div>
                <a
                  href="/"
                  className="flex items-center gap-2 px-4 py-2 w-full text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                  onClick={() => {
                    console.log("Logout clicked");
                    setIsProfileOpen(false);
                  }}
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-20" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out pt-16 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex justify-between items-center border-b border-green-100">
          <MoneyTreeLogo />
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-green-100 transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 h-full flex flex-col">
          <ul className="space-y-1 flex-1">
            {navItems.map(item => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                    pathname === item.href
                      ? "bg-green-100 text-green-700 font-medium"
                      : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                  } transition-colors`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.href);
                  }}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-4 border-t border-green-100">
            <div className="px-3 py-3 mb-2">
              <p className="text-xs text-gray-500 uppercase font-medium">Account</p>
            </div>
            <a
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors text-left"
              onClick={(e) => {
                e.preventDefault();
                console.log("Logout clicked");
                handleNavigation("/");
              }}
            >
              <LogOut size={18} />
              <span>Sign out</span>
            </a>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="overflow-auto pt-16 min-h-screen bg-green-50">
        {children}
      </main>
    </>
  )
}

export default NavBar