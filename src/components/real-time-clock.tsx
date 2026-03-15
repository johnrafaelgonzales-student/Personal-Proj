/**
 * @fileoverview This component displays the current date and time, updating every second.
 * It is designed to be used on the client-side to avoid server-client hydration mismatches.
 */
'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

/**
 * A component that renders a real-time updating clock and date display.
 */
export function RealTimeClock() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set the initial time as soon as the component mounts on the client.
    setCurrentTime(new Date());

    // Set up a timer to update the time every second.
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clean up the interval when the component unmounts to prevent memory leaks.
    return () => clearInterval(timer);
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  return (
    <div className="text-right text-sm">
      {currentTime ? (
        <>
          {/* Formats and displays the full date. */}
          <p>{format(currentTime, 'eeee, MMMM do, yyyy')}</p>
          {/* Formats and displays the time with seconds and AM/PM. */}
          <p className="font-semibold">{format(currentTime, 'h:mm:ss a')}</p>
        </>
      ) : (
        // Renders a skeleton placeholder while waiting for the client to mount and render the time.
        // This prevents hydration errors between the server-rendered and client-rendered HTML.
        <div className="space-y-1">
          <div className="h-4 w-48 animate-pulse rounded-md bg-white/20" />
          <div className="ml-auto h-4 w-24 animate-pulse rounded-md bg-white/20" />
        </div>
      )}
    </div>
  );
}
