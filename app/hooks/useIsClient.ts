// https://usehooks-ts.com/react-hook/use-is-client
// This React Hook can be useful in a SSR environment to wait until be in a browser to execution some functions.
//
// Indeed, in a SSR application, when the component with the useIsClient hook is mounted in the browser, its state changes and causes a re-render. 
// It is what we want here, but, if you want a boolean, without extra render, see useSSR().
//
import { useEffect, useState } from 'react'

function useIsClient() {
  const [isClient, setClient] = useState(false)

  useEffect(() => {
    setClient(true)
  }, [])

  return isClient
}

export default useIsClient
