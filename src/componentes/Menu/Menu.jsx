export const Menu = ({children}) => {
    const handleclick = (e)=>e.stopPropagation()
    return (<>
        <div id="menu" onClick={handleclick}
            style={{width:'100%', zIndex:16661}}
            className='absolute inset-x-0 bottom-0 min-h-72 h-2/5
                       flex flex-col items-center justify-end'>

            <div className='text-center resize-y sm:mb-8 h-full
                            bg-white borde-solid border-gray-900
                            overflow-y-hidden rounded-xl w-11/12
                            sm:w-10/12  lg:w-6/12 shadow-xl mb-2'>
                {children}
            </div>
        </div>
    </>)
}
