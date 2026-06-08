const Header = (props) => (
  <h1>{props.course.name}</h1>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Content = (props) => (
  <div>
    {props.parts.map(part => (
      <Part key={part.id} part={part} />
    ))}
  </div>
)

const Total = (props) => {
  const total = props.parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <p>
      <strong>Total of {total} exercises</strong>
    </p>
  )
}

const Course = (props) => (
  <div>
    <Header course={props.course} />
    <Content parts={props.course.parts} />
    <Total parts={props.course.parts} />
  </div>
)

export default Course