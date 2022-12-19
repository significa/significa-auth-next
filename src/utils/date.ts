/**
 *
 * @param {Date} date
 * @returns {number} the number of seconds between now and the given date
 */
export const getDateDistance = (date: Date): number => {
  return Math.trunc((date.getTime() - Date.now()) / 1000)
}

/**
 * @deprecated use getDateDistance instead
 */
export const isLessThan30Seconds = (targetDate: Date | null) => {
  if (!targetDate || !(targetDate instanceof Date)) return false

  return getDateDistance(targetDate) <= 30
}
