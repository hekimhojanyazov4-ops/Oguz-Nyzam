import i18n from './i18n'

const API_ROOT = import.meta.env.VITE_API_URL || '/api'

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('oguz-nyzam-token')
  const response = await fetch(`${API_ROOT}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      'Accept-Language': i18n.resolvedLanguage || i18n.language,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (response.status === 204) return null

  const contentType = response.headers.get('content-type') || ''
  const result = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message = typeof result === 'string' ? result : result?.title || result?.message
    throw new Error(message || `Request failed (${response.status})`)
  }

  return result
}

export function apiPost(path, body) {
  return apiRequest(path, { method: 'POST', body: JSON.stringify(body) })
}