import type { Ref, RefCallback } from 'react'

/**
 * 合并多个 ref（转发 ref + 内部 ref）。
 */
export function composeRefs<T>(...refs: Array<Ref<T> | undefined | null>): RefCallback<T> {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue
      if (typeof ref === 'function') {
        ref(node)
      } else {
        ;(ref as { current: T | null }).current = node
      }
    }
  }
}
