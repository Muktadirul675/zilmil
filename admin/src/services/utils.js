import { capitalize } from "vue"
/**
 * Check if a Bangladeshi mobile number is invalid
 * @param {string} number - Phone number as string
 * @returns {boolean} true if invalid, false if valid
 */
export function isInvalidBDNumber(number) {
  if (!number || typeof number !== 'string') return true

  // Remove any spaces, dashes, or parentheses
  const clean = number.replace(/[\s\-()]/g, '')

  // Local format: 11 digits, starts with 01, second digit 1-9
  const localPattern = /^01[1-9]\d{8}$/

  // International format: +8801XXXXXXXXX
  const intlPattern = /^\+8801[1-9]\d{8}$/

  return !localPattern.test(clean) && !intlPattern.test(clean)
}
export function timeAgo(dateTime) {
  if (!dateTime) return ''

  // Parse with correct timezone handling
  const past = new Date(dateTime)
  if (isNaN(past)) return ''

  // Convert both to same timezone (browser local)
  const now = new Date()

  const diff = Math.floor((now.getTime() - past.getTime()) / 1000)
  if (diff < 0) return 'just now'

  let value, unit

  if (diff < 60) {
    value = diff
    unit = 'second'
  } else if (diff < 3600) {
    value = Math.floor(diff / 60)
    unit = 'minute'
  } else if (diff < 86400) {
    value = Math.floor(diff / 3600)
    unit = 'hour'
  } else {
    value = Math.floor(diff / 86400)
    unit = 'day'
  }

  const plural = value !== 1 ? 's' : ''
  const timePart = diff < 5 ? 'just now' : `${value} ${unit}${plural} ago`

  const formattedDate = past.toLocaleString('en-BD', {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  return `${timePart} (${formattedDate})`
}

export function getProtocol() {
  if (typeof window !== "undefined") {
    return window.location.protocol === "https:" ? "https" : "http";
  }
  // fallback for non-browser environments
  return "http";
}

export function getWsProtocol(){
  const httpProtocol = getProtocol()
  if(httpProtocol === 'https') return 'wss';
  return 'ws'
}

export function convert_to_snake_word(string){
    let s = String(string).trim()
    return s.split(' ').join('_').toLowerCase()
}

export function convert_to_normal_word(string){
    let s = String(string)
    let ls = s.split('_').map((s)=>capitalize(s)).join(' ')
    return ls
}

export function transformSection(section) {
  return {
    type: section.type || '',
    title: section.title || '',
    subtitle: section.subtitle || '',
    notice_ids: (section.notices || []),
    image_ids: (section.images || []),
    image_each_slide: section.image_each_slide ?? null,
    category_ids: (section.categories || []).map(c => c.id),
    product_ids: (section.products || []).map(p => p.id),
    category_id: section.category?.id ?? null,
    products_each_slide: section.products_each_slide ?? null,
    slides: (section.slides || []).map(slide => ({
      ...slide,
      caption: slide.caption || '',
      link: slide.link || (slide.category_id ? `/category/${slide.category_id}` : '')
    })),
    args: section.args || {},
    is_active: section.is_active ?? true,
    position: section.position ?? 0
  }
}