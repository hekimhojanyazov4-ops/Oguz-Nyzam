import { useEffect } from 'react'

const revealSelector = [
  '.page-shell > .page-heading',
  '.page-shell > section',
  '.page-shell .metric',
  '.page-shell .directory-form',
  '.auth-layout > .auth-panel',
  '.auth-layout > .auth-aside',
  '.auth-layout .aside-feature',
].join(', ')

export default function RevealSections({ page }) {
  useEffect(() => {
    const targets = new Set()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let intersectionObserver

    function register(root = document) {
      const matches = [...(root.matches?.(revealSelector) ? [root] : []), ...(root.querySelectorAll?.(revealSelector) || [])]
      matches.forEach((element) => {
        if (targets.has(element)) return
        targets.add(element)

        if (reducedMotion || !('IntersectionObserver' in window)) {
          element.classList.add('is-revealed')
          return
        }

        element.classList.add('reveal-item')
        intersectionObserver.observe(element)
      })
    }

    if (!reducedMotion && 'IntersectionObserver' in window) {
      intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-revealed')
          intersectionObserver.unobserve(entry.target)
        })
      }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' })
    }

    const roots = document.querySelectorAll('.page-shell, .auth-layout')
    if (!roots.length) return undefined
    roots.forEach(register)

    const mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) register(node)
      }))
    })
    roots.forEach((root) => mutationObserver.observe(root, { childList: true, subtree: true }))

    return () => {
      mutationObserver.disconnect()
      intersectionObserver?.disconnect()
      targets.clear()
    }
  }, [page])

  return null
}
