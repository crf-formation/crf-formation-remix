// https://usehooks-ts.com/react-hook/use-ssr

// Persist the state with session storage so that it remains after a page refresh. 
// This can be useful to record session information. This hook is used in the same way as useState except that you must 
// pass the storage key in the 1st parameter. If the window object is not present (as in SSR), useSessionStorage() will 
// return the default value.
function useSsr() {
  const isDOM =
    typeof window !== 'undefined' &&
    window.document &&
    window.document.documentElement

  return {
    isBrowser: isDOM,
    isServer: !isDOM,
  }
}

export default useSsr