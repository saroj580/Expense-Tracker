import React from 'react'

export default function Modal({ children, isOpen, onClose, title }) {
    if (!isOpen) return null;
    return (
        // <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50'>
        <div className='fixed inset-0 z-50 overflow-y-auto '>
            <div className='relative w-full max-w-md mx-auto'>
                {/* Background overlay */}
                <div className='fixed inset-0 transition-opacity bg-black/50' onClick={onClose}></div>
                {/* modal content */}
                {/* <div className='relative bg-white rounded-lg shadow-lg'> */}
                <div className='relative z-50 w-full max-w-md p-4 mx-auto bg-white rounded-lg shadow-xl transform transition-all'>
                    {/* modal header */}
                    <div className='flex items-center justify-between p-3 sm:p-4 border-b border-gray-200'>
                        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                        <button 
                            className="text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-lg p-1.5 inline-flex items-center justify-center"
                            type='button'
                            onClick={onClose}
                        >
                            <svg className='w-3 h-3'
                                aria-hidden="true"
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 14 14'
                            >
                                <path
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                                />
                            </svg>
                        </button>
                    </div>

                    {/* modal body */}
                    <div className='p-4'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
