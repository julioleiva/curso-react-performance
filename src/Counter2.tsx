import * as React from "react"

export default function Counter () {
  const [count, setCount] = React.useState(0)

  const handleClick = () => {
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)
  }

  return (
    <main>
      <h1>{count}</h1>
      <button onClick={handleClick}>
        +
      </button>
    </main>
  )
}