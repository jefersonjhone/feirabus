import { useEffect } from 'react'
import { Fechar } from './icons'

export function Modal({ handle_exit, children }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  })
  return (
    <>
      <div
        className="h-[100dvh] w-screen z-10 fixed opacity-70 bg-slate-800 left-0 top-0 "
        onClick={handle_exit}
      ></div>
      <div
        className="h-[50dvh] max-w-[800px] bg-white overflow-hidden p-1 z-30 w-[90%] mx-auto transform sm:translate-x-[-50%] sm:translate-y-[-50%] fixed top-[20%] sm:left-[50%] sm:top-[50%] rounded-xl"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <button
          className="bg-red-200 cursor-pointer hover:bg-red-300 hover:border hover:border-slate-300 rounded-lg p-1 fixed right-2"
          onMouseDown={handle_exit}
        >
          {' '}
          <Fechar />{' '}
        </button>
        {children}
      </div>
    </>
  )
}
