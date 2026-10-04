import { useState } from 'react'

export function useAsyncAction() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function run(action) {
    setPending(true)
    setError('')
    try {
      return await action()
    } catch (actionError) {
      setError(actionError.message)
      return null
    } finally {
      setPending(false)
    }
  }

  return { pending, error, setError, run }
}