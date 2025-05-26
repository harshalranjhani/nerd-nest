import { CLSMetric, FCPMetric, FIDMetric, LCPMetric, TTFBMetric } from 'web-vitals'

type Metric = {
  id: string
  name: string
  value: number
  delta: number
}

export function sendToAnalytics(metric: CLSMetric | FIDMetric | LCPMetric | FCPMetric | TTFBMetric) {
  const body = {
    dsn: process.env.NEXT_PUBLIC_ANALYTICS_ID,
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: navigator.connection?.effectiveType || ''
  }

  const blob = new Blob([new URLSearchParams(body).toString()], {
    type: 'application/x-www-form-urlencoded'
  })
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics', blob)
  } else {
    fetch('/api/analytics', {
      body: blob,
      method: 'POST',
      credentials: 'omit',
      keepalive: true
    })
  }
}

export function reportWebVitals(onPerfEntry?: (metric: Metric) => void) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry)
      getFID(onPerfEntry)
      getFCP(onPerfEntry)
      getLCP(onPerfEntry)
      getTTFB(onPerfEntry)
    })
  }
} 