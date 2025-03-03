"use client";

import { Header } from "@/components/layout/header/header";
import Loading from "@/components/loading/loading";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthorizedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      // Store the attempted URL to redirect back after login
      sessionStorage.setItem("redirectAfterLogin", pathname);
      router.push("/login");
    }
  }, [user, loading, router, pathname]);

  // Show loading state while checking auth
  if (loading) {
    return <Loading />;
  }

  // If no user and not loading, don't render content (will redirect)
  if (!user && !loading) {
    return null;
  }

  // User is authenticated, render protected content
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-zinc-900">
      <Header />

      <div className="w-full h-full overflow-auto px-10 py-4">{children}</div>
    </div>
  );
}
