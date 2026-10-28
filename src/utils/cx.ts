/**
 * 合并 className，忽略 falsy 值。
 */
export type ClassValue = string | false | null | undefined | 0

export function cx(...values: ClassValue[]): string {
  let result = ''
  for (const value of values) {
    if (!value) continue
    result = result ? `${result} ${value}` : value
  }
  return result
}
