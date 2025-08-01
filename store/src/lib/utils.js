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