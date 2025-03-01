// app/(unauthorized)/layout.tsx
"use client";

import Loading from "@/components/loading/loading";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UnauthorizedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is logged in, redirect to dashboard or home
    if (!loading && user) {
      // Check if there's a saved redirect path
      const redirectPath =
        sessionStorage.getItem("redirectAfterLogin") || "/dashboard";
      sessionStorage.removeItem("redirectAfterLogin");
      router.push(redirectPath);
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return <Loading />;
  }

  // If user is logged in, don't render content (will redirect)
  if (user && !loading) {
    return null;
  }

  // User is not authenticated, render public content
  return <>{children}</>;
}
