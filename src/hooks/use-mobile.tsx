import * as React from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkMobile = () => {
       
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Check on mount
     
    checkMobile()

    // Add event listener
     
    window.addEventListener('resize', checkMobile)

    return () => {
       
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  return isMobile
}