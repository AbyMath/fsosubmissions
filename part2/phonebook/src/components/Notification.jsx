const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  const notificationStyle = {
    background: notification.type === 'error' ? '#ffcccc' : '#ccffcc',
    color: notification.type === 'error' ? '#cc0000' : '#00cc00',
    border: `2px solid ${notification.type === 'error' ? '#cc0000' : '#00cc00'}`,
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    fontSize: '16px'
  }

  return (
    <div style={notificationStyle}>
      {notification.message}
    </div>
  )
}

export default Notification