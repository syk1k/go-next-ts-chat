import { API_URL, WEBSOCKET_URL } from '@/constants'
import {useState, useEffect, useContext} from 'react'
import {v4 as uuidv4} from "uuid"
import { AuthContext } from '@/modules/auth_provider'
import { WebsocketContext } from '@/modules/websocket_provider'
import { useRouter } from 'next/router'

export type Room = {
    id: string
    name: string
}

const Index = () => {
    const router = useRouter()
    const [roomName, setRoomName] = useState("")
    const [rooms, setRooms] = useState<Room[]>([
    ])

    const {user} = useContext(AuthContext)
    const {setConn} = useContext(WebsocketContext)
    useEffect(()=>{
        getRooms()
    }, [])

    const getRooms = async () => {
        try {
            const res = await fetch(`${API_URL}/ws/getRooms`, {
                method: "GET",
            })

            const data = await res.json()
            if (res.ok) {
                setRooms(data)
            }

        } catch (error) {
            console.log(error);
        }
    }

    const joinRoom = async (roomId : string) => {        
        const ws = new WebSocket(`${WEBSOCKET_URL}/ws/joinRoom/${roomId}?userId=${user.id}&username=${user.username}`)
        if(ws.OPEN){
            setConn(ws)
            router.push("/app")
            return
        }
    }

    const submitHandler = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        try {
            
            const res = await fetch(`${API_URL}/ws/createRoom`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    id: uuidv4(),
                    name: roomName
                })
            })
            if (res.ok) {
                getRooms()
            }

            setRoomName("")

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
        <div className='my-8 px-4 md:mx-32 w-full h-full'>
            <div className='flex justify-center mt-3 p-5'>
                <input value={roomName} onChange={(e)=>setRoomName(e.target.value)} type="text" placeholder='room name' className='border border-grey p-2 rounded-md focus:outline-none focus:border-blue' />
                <button onClick={submitHandler} className='p-2 md:ml-4 rounded-md bg-blue text-white'>Create room</button>
            </div>
            <div className='mt-6'>
                <div className='font-bold'>Available rooms</div>
                <div className='grid grid-cols-1 md:grid-cols-5 gap-4 mt-6'>
                    {rooms.map((room, index)=>(
                        <div key={index} className='border border-blue p-4 flex items-center rounded-md w-full'>
                            <div className='w-full'>
                                <div className='text-sm'>room</div>
                                <div className='text-blue font-bold text-lg'>{room.name}</div>
                            </div>
                            <div>
                                <button className='px-4 text-white bg-blue rounded-md' onClick={() => joinRoom(room.id)}>join</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
    )
}

export default Index