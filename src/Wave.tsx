import * as React from "react"

// eslint-disable-next-line react-refresh/only-export-components
function Wave () {
  console.count('Rendering Wave')
  return (
    <span role="img" aria-label="hand waving">
      👋
    </span>
  )
}

export default React.memo(Wave)