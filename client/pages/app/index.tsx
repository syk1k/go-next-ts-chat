import ChatBody from '@/components/chat_body'
import { WebsocketContext } from '@/modules/websocket_provider'
import {useContext, useEffect, useRef, useState} from 'react'
import { useRouter } from 'next/router'
import { API_URL } from '@/constants'
import autosize from 'autosize'
import { AuthContext } from '@/modules/auth_provider'

export type Message = {
    content: string
    client_id: string
    username: string
    room_id: string
    type: "recv" | "self"
}

const Index = () => {
    const [messages, setMessages] = useState<Array<Message>>([])
    const textarea = useRef<HTMLTextAreaElement>(null)
    const {conn} = useContext(WebsocketContext)
    const {user} = useContext(AuthContext)
    const [users, setUsers] = useState<Array<{username: string}>>([])

    useEffect(()=>{
        if (conn === null ){
            router.push("/")
            return
        }
        const roomId = conn.url.split("/")[5]
        async function getUsers() {
            try {
                const res = await fetch(`${API_URL}/ws/getClients/${roomId}`, {
                    method: "GET",
                    headers: {"Content-Type": "application/json"}
                })
    
                const data = await res.json()
                if (res.ok) {
                    setUsers(data)
                }
    
            } catch (error) {
                console.log(error);
            }
        }
    }, [])

    useEffect(()=>{
        if(textarea.current?.value){
            autosize(textarea.current)
        }

        if(conn === null ) {
            router.push("/")
            return
        }

        conn.onmessage = (message) => {
            const m: Message = JSON.parse(message.data)
            if(m.content == "A new user has joined the room"){
                console.log(m);
                setUsers([...users, {username: m.username}])
            }

            if(m.content == "user left the chat"){
                const deleteUser = users.filter((user)=> user.username != m.username)
                setUsers([...deleteUser])
                setMessages([...messages, m])
                return
            }
            console.log(user.username);
            
            user?.username == m.username ? (m.type = 'self'): (m.type = 'recv')
            setMessages([...messages, m])
        }

        conn.onclose = () => {}
        conn.onerror = () => {}
        conn.onopen = () => {}

    }, [textarea, messages, conn, users]) // Handle websocket connections

    const router = useRouter()

    const sendMessage = () =>{
        if(!textarea.current?.value) return
        if (conn === null ){
            router.push("/")
            return
        }

        conn.send(textarea.current.value)
        textarea.current.value = ''
    }

    return (
        <>
        <div className='flex flex-col w-full'>
            <div className='p-4 md:mx-6 mb-14'>
                <ChatBody data={messages}/>
            </div>
            <div className='fixed bottom-0 mt-4 w-full'>
                <div className='flex md:flex-row px-4 py-2 bg-grey md:mx-4 rounded-md'>
                    <div className='flex w-full mr-4 rounded-md border border-blue'>
                        <textarea 
                            ref={textarea}
                            placeholder='Type your message here' 
                            className='w-full h-10 p-2 rounded-md focus:outline-none'
                            style={{resize: 'none'}}
                        ></textarea>
                    </div>
                    <div className='flex items-center'>
                        <button className='p-2 rounded-md bg-blue text-white' onClick={sendMessage}>
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