import { Navbar } from "@/components/navbar";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />
      {/* Decorative background elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="-top-40 -right-40 absolute h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="-bottom-40 -left-40 absolute h-80 w-80 rounded-full bg-fuchsia-200/40 blur-3xl" />
      </div>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:h-16 md:flex-row">
          <p className="text-muted-foreground text-sm">
            Powered by{" "}
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text font-semibold text-transparent">
              BoldSpark (Team 7)
            </span>
          </p>
          <p className="text-muted-foreground text-sm">
            © 2025 HealthScore. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
