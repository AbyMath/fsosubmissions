import { createContext, useState, useContext } from 'react'
import persistentUserService from '../services/persistentUser'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(persistentUserService.getUser())

  const loginUser = (userData) => {
    persistentUserService.saveUser(userData)
    setUser(userData)
  }

  const logoutUser = () => {
    persistentUserService.removeUser()
    setUser(null)
  }

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)