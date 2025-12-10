"use client";

import { History, LayoutDashboard, Leaf, Menu, Upload } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Analyze", icon: Upload },
  { href: "/history", label: "History", icon: History },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link className="group flex items-center gap-2" href="/">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg transition-shadow group-hover:shadow-violet-500/25">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text font-bold text-lg text-transparent">
                HealthScore
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

          {/* Mobile menu */}
          <Sheet onOpenChange={setIsOpen} open={isOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button size="icon" variant="ghost">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-72" side="right">
              <div className="mt-8 flex flex-col gap-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      href={item.href}
                      key={item.href}
                      onClick={() => setIsOpen(false)}
                    >
                      <Button
                        className={cn(
                          "w-full justify-start gap-3",
                          isActive
                            ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                            : ""
                        )}
                        variant={isActive ? "secondary" : "ghost"}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
                <Separator className="my-2" />
                <div className="text-center text-muted-foreground text-xs">
                  Powered by Google Gemini AI
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
