export const Menu = ({children}) => {
    return (<>
        <div id="menu"
            style={{width:'100%', zIndex:1401}}
            className='absolute inset-x-0 bottom-0 min-h-72 h-2/5
                       flex flex-col items-center justify-end'>

            <div className='text-center resize-y sm:mb-8 h-full
                            bg-white borde-solid border-gray-900
                            overflow-y-hidden rounded-xl w-11/12
                            sm:w-10/12  lg:w-6/12 shadow-xl '>
                {children}
            </div>
        </div>
    </>)
}