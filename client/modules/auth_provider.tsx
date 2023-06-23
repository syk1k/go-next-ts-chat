import { useState, createContext, useEffect } from 'react'
import { useRouter } from 'next/router'

export type UserInfo = {
    id: string
    username: string
}

export type AuthType = {
    authenticated: boolean
    setAuthenticated: (auth: boolean) => void
    user: UserInfo
    setUser: (user: UserInfo) => void
}

export const AuthContext = createContext<AuthType>({
    authenticated: false,
    setAuthenticated: () => {},
    user: {id: '', username: ''},
    setUser: () => {},
})

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [authenticated, setAuthenticated] =  useState(false)
    const [user, setUser] = useState<UserInfo>({id: '', username: ''})
    const router = useRouter()

    useEffect(()=>{
        const userInfo = localStorage.getItem("user_info")
        if (!userInfo){
            if(window.location.pathname != "/signup"){
                router.push("/login")
                return
            }
        }else{
            const user: UserInfo = JSON.parse(userInfo)
            if (user){
                setUser({
                    id: user.id,
                    username: user.username
                })
            }
            setAuthenticated(true)
        }
    }, [authenticated, router])

    return (
        <AuthContext.Provider value={{
            authenticated: authenticated,
            setAuthenticated: setAuthenticated,
            user: user,
            setUser: setUser,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider