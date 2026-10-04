import { useEffect, useState } from 'react'
import { apiRequest } from '../api'

export function useApiResource(path) {
  const [resource, setResource] = useState({ path: '', data: [], error: '' })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (!path) return undefined

    const controller = new AbortController()
    apiRequest(path, { signal: controller.signal })
      .then((data) => setResource({ path, data, error: '' }))
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setResource({ path, data: [], error: requestError.message })
      })

    return () => controller.abort()
  }, [path, version])

  const matchesPath = resource.path === path

  return {
    data: path && matchesPath ? resource.data : [],
    setData: (data) => setResource({ path, data, error: '' }),
    loading: Boolean(path) && !matchesPath,
    error: path && matchesPath ? resource.error : '',
    refresh: () => setVersion((current) => current + 1),
  }
}