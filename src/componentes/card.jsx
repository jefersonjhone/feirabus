export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`border border-gray-200 rounded-xl px-3 md:px-4 bg-white shadow-sm hover:shadow-md transition-shadow ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
