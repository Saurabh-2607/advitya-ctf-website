"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

import {
  Menu,
  X,
  Flag,
  Trophy,
  LogOut,
  Settings,
  Users,
  Bell,
  User,
  Scale,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const { logout, isAuthenticated, user, role } = useAuth();

  const navLinks = [
    { name: "Challenges", href: "/challenges", icon: Flag },
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { name: "Teams", href: "/teams", icon: Users },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Rules", href: "/rules", icon: Scale },
    { name: "MyTeam", href: "/myTeam", icon: Users },
  ];

    const isActive = (href) => pathname === href;

    return (
        <>
            <nav className="fixed w-full z-50 top-0 bg-black/40 backdrop-blur-md border-b-2 border-neutral-800/70">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

            <div className="flex items-center mr-32">
              <Link href="/" className="flex-shrink-0 flex items-center ">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={130}
                  height={100}
                  priority
                  className="object-contain"
                />
              </Link>
            </div>

                        <div className="hidden xl:flex items-center space-x-2 mx-16">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const active = isActive(link.href);
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`flex items-center px-3 py-2 rounded-sm text-sm font-semibold transition-all duration-200 group ${active
                                            ? "text-black bg-white/90 "
                                            : "text-white hover:text-white hover:bg-white/10"
                                            }`}
                                    >
                                        <Icon
                                            className={`h-4 w-4 mr-2 transition-colors duration-200 ${active ? "text-black" : "group-hover:text-white"
                                                }`}
                                        />
                                        {link.name}
                                    </Link>
                                );
                            })}
                            {role === "sudo" && (
                                <Link
                                    href={"/console/admin"}
                                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group ${isActive("/console/admin")
                                        ? "text-black bg-white/90 "
                                        : "text-white hover:text-white hover:bg-white/10"
                                        }`}
                                >
                                    <Settings
                                        className={`h-4 w-4 mr-2 transition-colors duration-200 ${isActive("/console/admin")
                                            ? "text-black"
                                            : "group-hover:text-white"
                                            }`}
                                    />
                                    {"Admin"}
                                </Link>
                            )}
                        </div>

                        {!isAuthenticated ? (
                            <div className="hidden xl:flex items-center space-x-4">
                                <Link
                                    href="/Auth/login"
                                    className="px-5 py-2 text-sm font-semibold text-black border border-white  rounded-4xl transition-all duration-200 bg-white"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/Auth/register"
                                    className="px-5 py-2 text-sm font-semibold rounded-4xl transition-all duration-200 text-white bg-white/10 border border-white/20 hover:bg-white/20"
                                >
                                    Register
                                </Link>
                            </div>
                        ) : (
                            <div className="hidden xl:flex items-center space-x-4">


                                <div className="flex items-center gap-2 justify-center">
                                    <User className="h-4 w-4 text-white" />
                                    <span className="text-sm font-semibold text-white whitespace-nowrap">
                                        {user.name}
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        logout();
                                        toast.success("Logged out successfully!", {
                                            theme: "dark",
                                            position: "bottom-right",
                                            autoClose: 3000,
                                        });
                                    }}
                                    className="flex items-center space-x-2 px-4 py-2 bg-white/90 hover:bg-red-900 text-black hover:text-white rounded-lg transition-all duration-200 focus:outline-none "
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="text-sm font-semibold">Logout</span>
                                </button>
                            </div>
                        )}

            {/* Mobile menu button */}
            <div className="xl:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-[#FF1A1A] hover:bg-[#121212] transition-all duration-200 focus:outline-none"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6 transition-colors duration-200 text-[#E50914]" />
                ) : (
                  <Menu className="block h-6 w-6 transition-colors duration-200 group-hover:text-[#FF1A1A]" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`xl:hidden ${isMenuOpen ? "block" : "hidden"}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#09090b]/95 backdrop-blur-xl border-t border-white/10">
            {navLinks.map((link) => {
              const Icon = link.icon;
              let active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
            flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-300
            ${
              active
                ? "bg-white/10 text-white border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }
          `}
                >
                  <Icon
                    className={`h-5 w-5 mr-3 ${
                      active ? "text-white" : "text-gray-400"
                    }`}
                  />
                  {link.name}
                </Link>
              );
            })}

            {/* Divider */}
            <div className="pt-4 pb-3 border-t border-white/10 mt-2">
              {!isAuthenticated ? (
                <div className="flex flex-col space-y-3 px-3">
                  <Link
                    href="/Auth/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="
              flex items-center justify-center
              px-6 py-3
              text-sm font-semibold
              text-black
              bg-white
              rounded-full
              hover:bg-gray-200
              transition-all duration-300
              shadow-[0_0_15px_rgba(255,255,255,0.1)]
            "
                  >
                    Login
                  </Link>

                  <Link
                    href="/Auth/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="
              flex items-center justify-center
              px-6 py-3
              text-sm font-semibold
              text-white
              bg-white/5
              border border-white/10
              rounded-full
              hover:bg-white/10
              backdrop-blur-sm
              transition-all duration-300
            "
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3 px-3">
                  {/* User */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-full">
                    <User className="h-5 w-5 text-white/70" />
                    <span className="text-sm font-medium text-white/90">
                      {user.name}
                    </span>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      logout();
                      toast.success("Logged out successfully!", {
                        theme: "dark",
                        position: "bottom-right",
                        autoClose: 3000,
                      });
                      setIsMenuOpen(false);
                    }}
                    className="
              flex items-center justify-center gap-2
              px-6 py-3
              bg-white
              text-black
              rounded-full
              font-semibold
              hover:bg-gray-200
              transition-all duration-300
              shadow-[0_0_15px_rgba(255,255,255,0.1)]
            "
                                    >
                                        <LogOut className="h-5 w-5" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
