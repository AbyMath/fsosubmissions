import { useState } from 'react'

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

const Statistics = (props) => {
  const total = props.good + props.neutral + props.bad
  const average = total === 0 ? 0 : (props.good * 1 + props.neutral * 0 + props.bad * (-1)) / total
  const positivePercentage = total === 0 ? 0 : (props.good / total) * 100

  if (total === 0) {
    return <div>No feedback given</div>
  }

  return (
    <div>
      <h2>Statistics</h2>
      <table>
        <tbody>
          <StatisticLine text="good" value={props.good} />
          <StatisticLine text="neutral" value={props.neutral} />
          <StatisticLine text="bad" value={props.bad} />
          <StatisticLine text="all" value={total} />
          <StatisticLine text="average" value={average.toFixed(2)} />
          <StatisticLine text="positive" value={positivePercentage.toFixed(2) + '%'} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => setGood(good + 1)
  const handleNeutral = () => setNeutral(neutral + 1)
  const handleBad = () => setBad(bad + 1)

  return (
    <div>
      <h1>Unicafe Feedback</h1>
      <div>
        <Button onClick={handleGood} label="good" />
        <Button onClick={handleNeutral} label="neutral" />
        <Button onClick={handleBad} label="bad" />
      </div>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App