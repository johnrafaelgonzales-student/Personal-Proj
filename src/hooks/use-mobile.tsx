/**
 * @fileoverview This file defines a custom React hook `useIsMobile` to determine
 * if the application is being viewed on a mobile-sized screen.
 */
import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * A custom hook that returns `true` if the window width is less than the mobile breakpoint.
 * It listens for window resize events to update its state.
 * @returns {boolean} True if the viewport is considered mobile, false otherwise.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Media query list to check for the mobile breakpoint.
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Handler to update state when the viewport size changes.
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Add listener and set initial state.
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Cleanup listener on component unmount.
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
