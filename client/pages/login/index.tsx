import { API_URL } from '@/constants'
import { useState, useContext, useEffect } from 'react'
import {useRouter} from 'next/router'
import { UserInfo, AuthContext } from '@/modules/auth_provider'

const Index = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const {authenticated} = useContext(AuthContext)
    
    const router = useRouter()

    useEffect(()=>{
        if(authenticated){
            router.push("/")
            return
        }
    }, [authenticated])
    
    const submitHandler = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password})
            })

            const data = await res.json()
            if (res.ok) {
                const user: UserInfo = {
                    id: data.id,
                    username: data.username,
                }

                localStorage.setItem('user_info', JSON.stringify(user))
                return router.push("/")
            }

        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='flex items-center justify-center min-w-full min-h-screen'>
            <form action="" className='flex flex-col md:w-1/5' method='POST'>
                <div className='text-3xl font-bold text-center'>
                    <span className='text-blue'>welcome!</span>
                </div>
                <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder='Email' className='p-3 mt-8 rounded-md border-2 border-grey focus:outline-none focus:border-blue' />
                <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder='Password' className='p-3 mt-4 rounded-md border-2 border-grey focus:outline-none focus:border-blue' />
                <button className='p-3 mt-6 rounded-md bg-blue font-bold text-white' type='submit' onClick={submitHandler}>Login</button>
            </form>
        </div>
    )
}

export default Index