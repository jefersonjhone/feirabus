export function BarLoading() {
  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center" role="status" aria-label="Carregando">
      <div className="loader" aria-hidden="true"></div>
    </div>
  )
}

export function BarHLoading() {
  return (
    <div className="w-full h-full flex items-center justify-center" role="status" aria-label="Carregando">
      <div className="loader-bar" aria-hidden="true"></div>
    </div>
  )
}
