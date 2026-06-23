"use client";

import { SessionProvider, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    // No session = nothing to guard, render normally
    if (status === "unauthenticated") {
      setValidated(true);
      return;
    }

    // User has a session cookie. Check if this browser session is still active.
    // sessionStorage is ALWAYS cleared when browser quits — even Chrome with "Continue where you left off".
    const isActive = sessionStorage.getItem("octane_session_active");
    if (isActive) {
      setValidated(true);
      return;
    }

    // No sessionStorage flag. Could be browser restart OR a new tab.
    // Ask other open tabs if they have an active session.
    const channel = new BroadcastChannel("octane_session_check");
    let responded = false;

    channel.onmessage = (event) => {
      if (event.data === "ACTIVE") {
        responded = true;
        sessionStorage.setItem("octane_session_active", "true");
        setValidated(true);
        channel.close();
      }
    };

    channel.postMessage("CHECK");

    const timer = setTimeout(() => {
      channel.close();
      if (!responded) {
        // No other tabs are active → browser was restarted → force logout silently
        signOut({ redirect: false });
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      try { channel.close(); } catch {}
    };
  }, [status]);

  // Once validated, listen for CHECK requests from new tabs
  useEffect(() => {
    if (!validated || status !== "authenticated") return;

    const channel = new BroadcastChannel("octane_session_check");
    channel.onmessage = (event) => {
      if (event.data === "CHECK") {
        channel.postMessage("ACTIVE");
      }
    };
    return () => channel.close();
  }, [validated, status]);

  if (!validated) {
    return null;
  }

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
