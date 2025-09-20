"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

export default function GoogleProvider({ children }) {
  const clientId = (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "").trim();
  if (!clientId) return children;
  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}



