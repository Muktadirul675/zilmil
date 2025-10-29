export const formatBDT = (n) => {
  if (n == null) return ''
  let num = parseFloat(n)
  const [intPart, decimal] = num.toFixed(2).split('.')
  const lastThree = intPart.slice(-3)
  const otherNumbers = intPart.slice(0, -3)
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') +
    (otherNumbers ? ',' : '') +
    lastThree
  return `${formatted}`
}

export function truncate(text, count = 10, postfix = "...") {
  if (typeof text !== 'string') return ''
  return text.length > count ? text.slice(0, count) + postfix : text
}

export function validateBDPhoneNumber(number) {
  // Remove all spaces and hyphens
  const cleaned = number.replace(/[\s-]/g, '');

  // Regular expression for Bangladeshi phone numbers
  const bdPhoneRegex = /^(?:\+88)?01[3-9]\d{8}$/;

  if (bdPhoneRegex.test(cleaned)) {
    return true
  } else {
    return false
  }
}