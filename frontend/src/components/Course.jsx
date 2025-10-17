const Course = ({course}) => {
  return(
    <>
      <h1>{course.name}</h1>
      <div>
        {course.parts.map(part => <p key={part.id}>{`${part.name} ${part.exercises}`}</p>)}
      </div>
      <h3>{`Total of ${course.parts.map(part => part.exercises).reduce((x, y) => x + y)} excercises`}</h3>
    </>
  )
} 

export default Course