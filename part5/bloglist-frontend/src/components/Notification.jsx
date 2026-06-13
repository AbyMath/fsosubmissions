const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  const notificationStyle = {
    padding: '10px',
    marginBottom: '10px',
    border: '2px solid',
    borderRadius: '4px',
    backgroundColor: notification.type === 'success' ? '#d4edda' : '#f8d7da',
    borderColor: notification.type === 'success' ? '#28a745' : '#dc3545',
    color: notification.type === 'success' ? '#155724' : '#721c24',
  }

  return (
    <div style={notificationStyle}>
      {notification.message}
    </div>
  )
}

export default Notification