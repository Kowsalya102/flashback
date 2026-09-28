"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AppRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const mode = searchParams?.get("mode");
    const target = mode ? `/chat?mode=${mode}` : "/chat";
    router.replace(target);
  }, [router, searchParams]);

  return (
    <div className="h-screen min-h-[100dvh] bg-[#09090D] flex items-center justify-center font-mono text-xs text-[#06B6D4]">
      Opening Flashback Debug Session...
    </div>
  );
}

export default function AppPage() {
  return (
    <Suspense fallback={<div className="h-screen min-h-[100dvh] bg-[#09090D] flex items-center justify-center font-mono text-xs text-[#06B6D4]">Loading...</div>}>
      <AppRedirectContent />
    </Suspense>
  );
}
