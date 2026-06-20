import useAnecdoteStore from '../useAnecdoteStore'

const Filter = () => {
  const setFilter = useAnecdoteStore((state) => state.setFilter)

  const handleChange = (event) => {
    setFilter(event.target.value)
  }

  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter