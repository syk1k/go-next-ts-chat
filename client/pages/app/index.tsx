import React from 'react'

const Index = () => {
    return (
        <>
        <div className='flex flex-col w-fill'>
            <div className='fixed bottom-0 mt-4 w-full'>
                <div className='flex md:flex-row px-4 py-2 bg-grey md:mx-4 rounded-md'>
                    <div className='flex w-full mr-4 rounded-md border border-blue'>
                        <textarea 
                            placeholder='Type your message here' 
                            className='w-full h-10 p-2 rounded-md focus:outline-none' 
                            style={{resize: 'none'}}
                        ></textarea>
                    </div>
                    <div className='flex items-center'>
                        <button className='p-2 rounded-md bg-blue text-white'>
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Index