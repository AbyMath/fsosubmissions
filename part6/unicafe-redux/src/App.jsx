import useFeedbackStore from './useFeedbackStore'

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.label}
  </button>
)

const StatisticLine = (props) => (
  <tr>
    <td>{props.text}</td>
    <td>{props.value}</td>
  </tr>
)

const Statistics = () => {
  const good = useFeedbackStore((state) => state.good)
  const neutral = useFeedbackStore((state) => state.neutral)
  const bad = useFeedbackStore((state) => state.bad)

  const total = good + neutral + bad
  const average = total === 0 ? 0 : (good * 1 + neutral * 0 + bad * -1) / total
  const positivePercentage = total === 0 ? 0 : (good / total) * 100

  if (total === 0) {
    return <div>No feedback given</div>
  }

  return (
    <div>
      <h2>Statistics</h2>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={total} />
          <StatisticLine text="average" value={average.toFixed(2)} />
          <StatisticLine text="positive" value={positivePercentage.toFixed(2) + '%'} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const incrementGood = useFeedbackStore((state) => state.incrementGood)
  const incrementNeutral = useFeedbackStore((state) => state.incrementNeutral)
  const incrementBad = useFeedbackStore((state) => state.incrementBad)

  return (
    <div>
      <h1>Unicafe Feedback</h1>
      <div>
        <Button onClick={incrementGood} label="good" />
        <Button onClick={incrementNeutral} label="neutral" />
        <Button onClick={incrementBad} label="bad" />
      </div>
      <Statistics />
    </div>
  )
}

export default App