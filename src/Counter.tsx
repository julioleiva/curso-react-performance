import * as React from "react"

export default function Counter () {
  console.count("Rendering Counter")
  const [count, setCount] = React.useState(0)

  const handleClick = () => {
    console.count("click")
    setCount(count)
  }

  return (
    <button onClick={handleClick}>
      🤨
    </button>
  )
}