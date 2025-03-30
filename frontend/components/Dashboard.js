"use client"

import { useState, useRef, useEffect } from "react"
import { Menu, X, Home, PiggyBank, BookOpen, BarChart2 } from "lucide-react" // Removed LogOut
import Link from "next/link"

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const sidebarRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest("[data-menu-trigger]")
      ) {
        setIsSidebarOpen(false)
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

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <div
        ref={sidebarRef}
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
        href="/"
        className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        onClick={() => setIsSidebarOpen(false)}
      >
        <Home size={18} />
        <span>Dashboard</span>
      </Link>
    </li>
    <li>
      <Link
        href="/savings-goals"
        className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        onClick={() => setIsSidebarOpen(false)}
      >
        <PiggyBank size={18} />
        <span>Savings Goals</span>
      </Link>
    </li>
    <li>
      <Link
        href="/education"
        className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        onClick={() => setIsSidebarOpen(false)}
      >
        <BookOpen size={18} />
        <span>Education</span>
      </Link>
    </li>
    <li>
      <Link
        href="/what-if"
        className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        onClick={() => setIsSidebarOpen(false)}
      >
        <BarChart2 size={18} />
        <span>What-If</span>
      </Link>
    </li>
  </ul>
</nav>
      </div>

      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-slate-200 transition-colors mr-3"
              aria-label="Menu"
              data-menu-trigger
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-8">
            <div className="md:w-2/3">
              <div className="bg-white rounded-2xl shadow-md p-6 min-h-[24rem] flex items-center justify-center">
                <p className="text-gray-400 text-lg">Spending Overview Chart</p>
              </div>
            </div>

            <div className="md:w-1/3 mt-6 md:mt-0">
              <div className="bg-blue-50 rounded-2xl shadow-md p-6">
                <h2 className="text-blue-800 text-xl font-semibold mb-4">AI Spending Insights</h2>

                <div className="mb-6">
                  <h3 className="text-teal-700 font-medium mb-2">What You're Doing Well 👍</h3>
                  <ul className="space-y-2 text-gray-600 list-disc list-inside">
                    <li>Consistent savings in your emergency fund</li>
                    <li>Reduced dining out expenses this month</li>
                    <li>On track with your retirement contributions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-gray-700 font-medium mb-2">Areas to Improve 🤔</h3>
                  <ul className="space-y-2 text-gray-600 list-disc list-inside">
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