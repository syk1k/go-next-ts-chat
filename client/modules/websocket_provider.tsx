import React, { useState, createContext } from 'react'

type Conn = WebSocket | null

type WebConnType = {
    conn: Conn
    setConn: (c: Conn) => void
}

export const WebsocketContext = createContext<WebConnType>({
    conn: null,
    setConn: () => {}
})

const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [conn, setConn] = useState<Conn>(null)
    return (
        <WebsocketContext.Provider value={{
            conn: conn,
            setConn: setConn
        }}>
            {children}
        </WebsocketContext.Provider>
    )
}

export default WebSocketProvider