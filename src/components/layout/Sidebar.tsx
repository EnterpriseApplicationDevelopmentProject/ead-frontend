"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { FaCar, FaCalendarAlt, FaProjectDiagram, FaUser, FaComments } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import Link from "next/link";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Toggle Button (Mobile & Tablet) */}
      <button
        onClick={() => setOpen(!open)}
        className="p-3 text-gray-700 lg:hidden fixed top-4 left-4 bg-white rounded-lg shadow-lg z-50 hover:bg-gray-100 transition-colors"
      >
        <FiMenu size={24} />
      </button>

      {/* Overlay (Mobile & Tablet) */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-1/2 md:h-screen bg-white w-44 sm:w-48 md:w-56 lg:w-60 xl:w-64 p-3 flex flex-col transition-transform duration-300 z-50 shadow-md rounded-br-lg lg:rounded-none overflow-y-auto
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex flex-col items-center mb-4">
          <div className="bg-blue-500 rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center text-white text-sm font-medium">
            User Photo
          </div>
        </div>

  <nav className="flex flex-col gap-1 text-gray-700 text-sm md:text-base lg:text-base">
          <Link
            href="/customer/dashboard"
            className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
              pathname?.includes('/customer/dashboard') ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
            }`}
          >
            <MdDashboard size={16} /> Dashboard
          </Link>
          <Link
            href="/customer/vehicles"
            className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
              pathname?.includes('/customer/vehicles') ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
            }`}
          >
            <FaCar size={16} /> My Vehicles
          </Link>
          <Link
            href="/customer/my-appointments"
            className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
              pathname?.includes('/customer/my-appointments') ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
            }`}
          >
            <FaCalendarAlt size={16} /> My Appointments
          </Link>
          <Link
            href="/customer/my-projects"
            className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
              pathname?.includes('/customer/my-projects') ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
            }`}
          >
            <FaProjectDiagram size={16} /> My Projects
          </Link>
          <Link
            href="/customer/profile"
            className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
              pathname?.includes('/customer/profile') ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
            }`}
          >
            <FaUser size={16} /> Profile
          </Link>
          <Link
            href="/customer/chatbot"
            className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
              pathname?.includes('/customer/chatbot') ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
            }`}
          >
            <FaComments size={16} /> Chatbot
          </Link>
        </nav>

        <button className="mt-auto flex items-center gap-2 p-2 rounded-md text-red-600 text-sm md:text-base lg:text-base hover:bg-red-50 transition-colors">
          <FiLogOut size={16} /> Logout
        </button>
      </div>
    </>
  );
}
