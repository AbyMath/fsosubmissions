import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => useContext(NotificationContext)[0]

export const useNotify = () => {
  const dispatch = useContext(NotificationContext)[1]
  return (message, isError = false) => {
    dispatch({ type: 'SET', payload: { message, isError } })
    setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, 5000)
  }
}