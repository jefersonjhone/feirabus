import { useToastStore } from '../stores/toastStore'

export default function Toast() {
  const { message, type, visible } = useToastStore()

  if (!visible || !message) return null

  return (
    <div className="fixed top-24 right-4 z-[99999] animate-slide-down">
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${
          type === 'success'
            ? 'bg-purple-800 text-white'
            : 'bg-purple-300 text-purple-900'
        }`}
      >
        {type === 'success' ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        )}
        {message}
      </div>
    </div>
  )
}
