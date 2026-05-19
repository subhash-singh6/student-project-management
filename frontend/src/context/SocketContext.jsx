// frontend/src/context/SocketContext.jsx

import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const { user } = useAuth()
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    if (!user) return

    const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket'],
    })

    newSocket.on('connect', () => {
      console.log('🟢 Socket connected:', newSocket.id)
      newSocket.emit('join', user._id)
    })

    // Real-time notification aane par
    newSocket.on('receive-notification', (data) => {
      toast.success(data.title || 'New notification!', {
        icon: '🔔',
        duration: 4000,
      })
    })

    newSocket.on('disconnect', () => {
      console.log('🔴 Socket disconnected')
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [user])

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)