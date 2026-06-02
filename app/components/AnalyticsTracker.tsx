"use client";

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function trackEvent(type: string, metadata: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;

  void fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type,
      path: window.location.pathname,
      metadata,
    }),
    keepalive: true,
  }).catch(() => {});
}

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    trackEvent('page_view', {
      referrer: document.referrer || null,
      title: document.title,
    });
  }, [pathname]);

  return null;
}
