"use client";

import { History, LayoutDashboard, Upload } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Analyze", icon: Upload },
  { href: "/history", label: "History", icon: History },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link className="group flex items-center gap-2" href="/">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl group-hover:shadow-violet-500/25">
                {/* <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg transition-shadow group-hover:shadow-violet-500/25"> */}
                {/* <Leaf className="h-5 w-5 text-white" /> */}
                <Image
                  alt="CyberHealth Logo"
                  className="rounded-md"
                  height={40}
                  src="/images/logo.png"
                  width={40}
                />
              </div>
              <div className="flex flex-col">
                <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text font-bold text-lg text-transparent">
                  CyberHealth
                </span>
                <span className="-mt-1 text-[10px] text-muted-foreground">
                  AI Food Analysis
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link href={item.href} key={item.href}>
                    <Button
                      className={cn(
                        "gap-2",
                        isActive
                          ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                          : ""
                      )}
                      variant={isActive ? "secondary" : "ghost"}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Floating Bottom Navigation */}
      <motion.nav
        animate={{ y: 0, opacity: 1 }}
        className="-translate-x-1/2 fixed bottom-6 left-1/2 z-50 md:hidden"
        initial={{ y: 100, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          delay: 0.2,
        }}
      >
        <motion.div className="flex items-center gap-2 rounded-full border bg-background/80 px-2 py-2 shadow-lg backdrop-blur-lg">
          <LayoutGroup id="bottom-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link href={item.href} key={item.href}>
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/** biome-ignore lint/nursery/noLeakedRender: <na> */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                        layoutId="activeTab"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <Button
                      className={cn(
                        "relative flex h-auto flex-col items-center gap-2 rounded-full bg-transparent px-4 py-2 hover:bg-transparent",
                        isActive
                          ? "text-white"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      size="sm"
                      variant="ghost"
                    >
                      <Icon className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
              );
            })}
          </LayoutGroup>
        </motion.div>
      </motion.nav>
    </>
  );
}
