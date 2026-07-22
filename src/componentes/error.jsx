import { useEffect } from 'react'
import { trackEvent } from '../utils/analytics'

export default function Error({ error, imagesrc }) {
  useEffect(() => {
    trackEvent('erro_api', {
      status: error?.status || 'unknown',
      message: error?.message?.name || 'unknown',
      page: window.location.pathname,
    })
  }, [error])

  return (
    <div className="bg-red-100 w-full h-full flex flex-col items-center justify-center">
      <p className="text-lg font-semibold">{error?.status}</p>
      <p className="font-medium">{error?.message?.name}</p>
      <img src={imagesrc} />
    </div>
  )
}
