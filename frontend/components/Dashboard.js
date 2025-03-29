"use client"

import { useState, useRef, useEffect } from "react"
import { Menu, X, Home, PiggyBank, BookOpen, BarChart2, LogOut } from "lucide-react"
import Link from "next/link"

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  // Removed <HTMLDivElement> type annotation from useRef
  const sidebarRef = useRef(null)

  // Close sidebar when clicking outside
  useEffect(() => {
    // Removed : MouseEvent type annotation from event parameter
    const handleClickOutside = (event) => {
      // Removed 'as Node' and 'as Element' type assertions
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest("[data-menu-trigger]") // Check if event.target has 'closest' method
      ) {
        setIsSidebarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, []) // Empty dependency array remains the same

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // The JSX structure remains identical
  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef} // ref usage remains the same
        className={`fixed top-0 left-0 h-full bg-white w-64 shadow-lg z-30 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex justify-between items-center border-b border-slate-200">
          <h1 className="text-blue-800 font-semibold text-xl">FinStudent</h1>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-slate-100 transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Home size={18} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/savings-goals" // Make sure this page exists or create it later
                className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                <PiggyBank size={18} />
                <span>Savings Goals</span>
              </Link>
            </li>
            <li>
              <Link
                href="/education" // Make sure this page exists or create it later
                className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                <BookOpen size={18} />
                <span>Education</span>
              </Link>
            </li>
            <li>
              <Link
                href="/what-if" // Make sure this page exists or create it later
                className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                <BarChart2 size={18} />
                <span>What-If</span>
              </Link>
            </li>
          </ul>

          <div className="absolute bottom-8 left-0 w-full px-4">
            <button
              className="flex items-center gap-3 p-3 w-full rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              onClick={() => {
                console.log("Logout clicked"); // Replace with actual logout logic
                setIsSidebarOpen(false);
              }}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content Area - This part was originally outside the sidebar logic in your snippet */}
      {/* You'll likely want to wrap this main content area with your Layout component */}
      {/* For this component to BE the dashboard, maybe it should ONLY return the content part, */}
      {/* and the Sidebar/Header logic should live in your Layout.js? */}
      {/* Or, rename this component to something like AppShell or DashboardLayout */}
      {/* For now, keeping structure as provided: */}
      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Menu Button - This duplicates the one in the sidebar, consider refactoring */}
          <div className="flex items-center mb-6">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-slate-200 transition-colors mr-3"
              aria-label="Menu"
              data-menu-trigger // Added data attribute to help handleClickOutside ignore menu clicks
            >
              <Menu size={24} />
            </button>
            {/* Removed duplicate h1 title, assuming title is in sidebar */}
          </div>

          {/* This is the actual dashboard content */}
          <div className="flex flex-col md:flex-row md:space-x-8">
            {/* Left Column */}
            <div className="md:w-2/3">
              <div className="bg-white rounded-2xl shadow-md p-6 min-h-[24rem] flex items-center justify-center"> {/* Added min-h for better structure */}
                <p className="text-gray-400 text-lg">Spending Overview Chart</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="md:w-1/3 mt-6 md:mt-0">
              <div className="bg-blue-50 rounded-2xl shadow-md p-6">
                <h2 className="text-blue-800 text-xl font-semibold mb-4">AI Spending Insights</h2>

                <div className="mb-6">
                  <h3 className="text-teal-700 font-medium mb-2">What You're Doing Well 👍</h3>
                  <ul className="space-y-2 text-gray-600 list-disc list-inside"> {/* Added list style */}
                    <li>Consistent savings in your emergency fund</li>
                    <li>Reduced dining out expenses this month</li>
                    <li>On track with your retirement contributions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-gray-700 font-medium mb-2">Areas to Improve 🤔</h3>
                  <ul className="space-y-2 text-gray-600 list-disc list-inside"> {/* Added list style */}
                    <li>Subscription services slightly over budget</li>
                    <li>Consider reducing impulse purchases</li>
                    <li>Look into lower-cost alternatives for utilities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard