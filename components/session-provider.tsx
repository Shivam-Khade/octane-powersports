"use client";

import { SessionProvider, signOut, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function SessionGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const pathname = usePathname();
  const guardRan = useRef(false);
  const listenerSetUp = useRef(false);

  // Run the session guard exactly once when status first resolves
  useEffect(() => {
    if (status === "loading" || guardRan.current) return;
    guardRan.current = true;

    // Skip guard on admin routes — admin layout has its own server-side auth
    if (pathname?.startsWith("/admin")) {
      sessionStorage.setItem("octane_session_active", "true");
      return;
    }

    if (status === "unauthenticated") return;

    // User has a session cookie. Check if this browser session is still active.
    const isActive = sessionStorage.getItem("octane_session_active");
    if (isActive) return;

    // No sessionStorage flag → ask other tabs or sign out
    const channel = new BroadcastChannel("octane_session_check");
    let responded = false;

    channel.onmessage = (event) => {
      if (event.data === "ACTIVE") {
        responded = true;
        sessionStorage.setItem("octane_session_active", "true");
        channel.close();
      }
    };

    channel.postMessage("CHECK");

    const timer = setTimeout(() => {
      channel.close();
      if (!responded) {
        signOut({ redirect: false });
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      try { channel.close(); } catch {}
    };
  }, [status, pathname]);

  // Listen for CHECK requests from other tabs (set up once)
  useEffect(() => {
    if (status !== "authenticated" || listenerSetUp.current) return;
    listenerSetUp.current = true;

    const channel = new BroadcastChannel("octane_session_check");
    channel.onmessage = (event) => {
      if (event.data === "CHECK") {
        channel.postMessage("ACTIVE");
      }
    };
    return () => {
      channel.close();
      listenerSetUp.current = false;
    };
  }, [status]);

  // Never return null — that unmounts the entire tree and causes
  // Next.js to re-execute all server components (the infinite loop)
  return <>{children}</>;
}

export default function NextAuthSessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <SessionProvider session={session}>
      <SessionGuard>{children}</SessionGuard>
    </SessionProvider>
  );
}
