import { Link } from 'react-router-dom'

export default function EmptyState({ icon, title, description, to, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-4 text-center">
      {icon && (
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-purple-50 text-purple-600">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
        {description && <p className="text-sm text-gray-500 max-w-xs">{description}</p>}
      </div>
      {to && actionLabel && (
        <Link
          to={to}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-purple-800 rounded-lg hover:bg-purple-700 transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
