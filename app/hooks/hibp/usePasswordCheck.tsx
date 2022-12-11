import { useState } from 'react'
import sha1 from '~/utils/sha1'
import { pwnedPasswordRange } from 'hibp'

// https://haveibeenpwned.com/API/v2#SearchingPwnedPasswordsByRange
const hashPrefixLength = 5

// https://haveibeenpwned.com/API/v2#RateLimiting
export const minRateLimit = 1500

export const defaultOptions = {
  minLength: 8, // TODO: add constant
  maxLength: 128
}

export enum StatusCode {
  MIN_LENGTH = 'MIN_LENGTH',
  MAX_LENGTH = 'MAX_LENGTH',
  WAITING = 'WAITING',
  CHECKING = 'CHECKING',
  PWNED = 'PWNED',
  NOT_PWNED = 'NOT_PWNED',
  CHECK_FAILED = 'CHECK_FAILED',
}

let rateLimit = minRateLimit
let cache: { [key: string]: StatusCode} = {}
let previousCheckTimestamp: number | null = null
let isChecking: boolean = false
let checkTimer: NodeJS.Timeout | null = null

export function usePasswordCheck(options = {}): [StatusCode | null, (password: string) => void] {
  const [status, setStatus] = useState<StatusCode | null>(null)

  const opts = {
    ...defaultOptions,
    options
  }

  return [
    status,
    (password: string) => {

      if (password.length < opts.minLength) {
        setStatus(StatusCode.MIN_LENGTH)
        return
      }

      if (password.length > opts.maxLength) {
        setStatus(StatusCode.MAX_LENGTH)
        return
      }

      const hash = sha1.hash(password).toUpperCase()

      // cache lookup
      if (cache[hash]) {
        setStatus(cache[hash])
        return
      }

      // API request pending
      if (checkTimer) {
        setStatus(StatusCode.WAITING)
        return
      }

      // prevent parallel API request
      if (isChecking) {
        setStatus(StatusCode.WAITING)
        checkTimer = setTimeout(() => {
          check({ hash, setStatus })
          checkTimer = null
        }, rateLimit)
        return
      }

      // respect rate limit
      const now = new Date().getTime()
      const waitingTime = previousCheckTimestamp
        ? rateLimit - (now - previousCheckTimestamp)
        : 0

      if (waitingTime > 0) {
        setStatus(StatusCode.WAITING)
        checkTimer = setTimeout(() => {
          check({
            hash,
            setStatus: (status: StatusCode) => setStatus(checkTimer ? StatusCode.WAITING : status)
          })
          checkTimer = null
        }, waitingTime)
        return
      }

      check({ hash, setStatus })
    }
  ]
}

export const setRateLimit = (milliseconds: number) => {
  if (milliseconds < minRateLimit) {
    throw new Error(`Minimum rate limit is ${minRateLimit} ms.`)
  }
  rateLimit = milliseconds
}


const check = ({ hash, setStatus }: { hash: string, setStatus: (status: StatusCode) => void }) => {
  setStatus(StatusCode.CHECKING)
  isChecking = true
  previousCheckTimestamp = new Date().getTime()

  const prefix = hash.substring(0, hashPrefixLength)
  const suffix = hash.substring(hashPrefixLength)

  pwnedPasswordRange(prefix)
    .then(results => {
      const found = results[suffix]
      const status = found ? StatusCode.PWNED : StatusCode.NOT_PWNED
      cache[hash] = status
      isChecking = false
      setStatus(status)
    })
    .catch(e => {
      console.error(e)
      isChecking = false
      setStatus(StatusCode.CHECK_FAILED)
    })
}