# React rendering. Modelo mental

**`v = fn(s)`**

`v = view (view)`

`fn = function (component)`

`s = state`

# ¿Qué es la renderización?

Cuando React renderiza un componente, ocurren dos cosas:

Primero, **React crea una instantánea de tu componente que captura todo lo que React necesita para actualizar la vista en ese momento en particular. props, estado, manejadores de eventos, y una descripción de la UI** (basada en esos props y estado) son todos capturados en esta instantánea.

Sin la capacidad de volver a renderizar, React sería prácticamente inútil. Lo que hace que React sea más interesante es cómo trata todos los renders posteriores.

Esto nos lleva a la siguiente pregunta…

## **¿Cuándo re-renderiza React?**

**Lo único que puede provocar un re-renderizado de un componente en React es un cambio de estado.**

**¿cómo sabe React cuándo ha cambiado el estado de un componente?** En este punto es bastante trivial y, una vez más, tiene que ver con nuestra instantánea.

Cuando un manejador de eventos es invocado, ese manejador de eventos tiene acceso a los props y al estado tal y como estaban en el momento en que la instantánea fue creada.

A partir de ahí, **si el manejador de eventos contiene una invocación a la función updater de useState y React ve que el nuevo estado es diferente del estado en la instantánea, React lanzará un re-renderizado del componente - creando una nueva instantánea y actualizando la vista.**

En este punto, tienes un modelo mental teórico de alto nivel de cómo React renderiza, y luego re-renderiza cada vez que cambia el estado.

En este código, cuando se pulsa el **`botón`**, ¿qué saldrá en el `alert`?

```jsx
import * as React from "react"

export default function VibeCheck () {
  const [status, setStatus] = React.useState("clean")

  const handleClick = () => {
    setStatus("dirty")
    alert(status)
  }

  return (
    <button onClick={handleClick}>
      {status}
    </button>
  )
}
```

No te engañes pensando que, de repente, las cosas son ahora diferentes o más complejas de lo que eran antes de ver este ejemplo. **Se aplican las mismas reglas.**

Sabemos que **cuando nuestro manejador de eventos handleClick se ejecuta, tiene acceso a los props y al estado tal y como estaban en el momento en que se creó la instantánea** - en ese momento, el estado estaba *clean*. Por lo tanto, cuando alertamos al estado, obtenemos *clean*.

Ahora vuelve a pulsar el botón. Verás que como el clic anterior activó una nueva renderización y creó una nueva instantánea con el estado *dirty*, en cualquier clic posterior al inicial obtendremos el estado *sucio*.

Probemos con otro. ¿Qué ocurre cuando hacemos clic en el botón de este ejemplo?

```jsx
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
```

Cuando se pulsa el botón, **React** ejecuta nuestro manejador de eventos y ve que invocamos una función de actualización dentro de él. A partir de ahí, **calcula que el nuevo estado es 0**. A continuación, **se da cuenta de que el nuevo estado, 0, es el mismo que el estado en la instantánea, 0. Por lo tanto, React no activa un re-renderizado y la instantánea y la vista siguen siendo las mismas**.

De nuevo, React solo volverá a renderizar si el manejador de eventos contiene una invocación a la función actualizadora de useState (✅) y React ve que el nuevo estado es diferente al estado en la instantánea (❌).

¿Qué tal éste? ¿Cuál será el recuento después de pulsar el botón?

```jsx
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
```

De nuevo, sabemos que cuando nuestro manejador de evento handleClick se ejecuta, tiene acceso a los props y al estado tal y como estaban en el momento en que se creó la instantánea - en ese momento, la cuenta era 0. Así que, una vez que React termine de calcular el nuevo estado, verá que el nuevo estado, 1, es diferente del estado en la instantánea, 0.

Así que eventualmente, una vez que React termine de calcular el nuevo estado, verá que el nuevo estado, 1, es diferente del estado en la instantánea, 0. A partir de ahí, React volverá a renderizar el componente, creando una nueva instantánea y actualizando la Vista.

Una vez que entiendes cómo funciona el renderizado, este tipo de preguntas se vuelven triviales. Pero hay una pregunta que puede haber surgido después de ver el último ejemplo.

¿Cuántas veces se volverá a renderizar el componente Counter cuando se pulse el botón?

Tu intuición podría ser que React volverá a renderizar por cada función de actualización que encuentre, así que 3 veces en nuestro ejemplo.

Afortunadamente, eso no es correcto ya que llevaría a un montón de re-renders innecesarios.

En su lugar, React sólo volverá a renderizar después de haber tenido en cuenta cada función de actualización dentro del manejador de eventos y de estar seguro de cuál es el estado final. Así que en nuestro ejemplo, React sólo volverá a renderizar una vez por clic.

## Batching. ¿Cómo calcula React el estado?

Que React sólo vuelva a renderizar una vez que ha tenido en cuenta cada función de actualización dentro del manejador de eventos implica que React tiene algún tipo de algoritmo interno que utiliza para calcular el nuevo estado. React se refiere a este algoritmo como "batching".

Afortunadamente, es bastante sencillo.

**Siempre que React encuentre múltiples invocaciones de la misma función actualizadora** (por ejemplo, setCount en nuestro ejemplo), hará un seguimiento de cada una de ellas, pero **sólo el resultado de la última invocación se utilizará como nuevo estado.**
Así que en este ejemplo, el nuevo estado será por supuesto 3.

Ahora es poco común, pero **hay una manera de decirle a React que use el valor de la invocación anterior de la función updater en lugar de reemplazarlo**. Para ello, **pasamos a la función updater una función que tomará como argumento el valor de la invocación más reciente**.

```jsx
const handleClick = () => {
	setCount(1)
	setCount(2)
	setCount((c) => c + 3)
}
```

En este ejemplo, c será 2 ya que eso es lo que se pasó a la invocación más reciente de setCount antes de que se ejecutara nuestra función callback. Por lo tanto, el estado final será 2 + 3, o 5.

**¿Qué pasa con esto?**

```jsx
const handleClick = () => {
	setCount(1)
	setCount((c) => c + 3)
	setCount(7)
	setCount((c) => c + 10)
}
```

Vamos a recorrerlo…

El estado será 1, luego será 1 + 3, o 4, luego será 7, luego será 7 + 10, o 17.

Observa que no usamos 4 en la tercera invocación aunque es lo que se devolvió en la segunda invocación. Eso es porque le estamos diciendo a React que olvide todo lo que sabía y use 7 como nuevo estado.

Otra forma de ver el código anterior es la siguiente.

```jsx
const handleClick = () => {
	setCount((c) => 1)
	setCount((c) => c + 3)
	setCount((c) => 7)
	setCount((c) => c + 10)
}
```

Donde React simplemente ignora el valor anterior a menos que lo uses explícitamente.

Veamos otro ejemplo.

Después de hacer clic en nuestro botón 3 veces, ¿qué mostrará la interfaz de usuario, qué se registrará en la consola y cuántas veces se habrá vuelto a renderizar App?

```jsx
import * as React from 'react'

export default function App () {
  const [linear, setLinear] = React.useState(0)
  const [exponential, setExponential] = React.useState(1)

  const handleClick = () => {
    setLinear(linear + 1)
    setExponential(exponential * 2)

    console.log({ linear, exponential })
  }

  return (
    <main>
      <p>Linear: {linear}</p>
      <p>Exponential: {exponential}</p>
      <button onClick={handleClick}>
        Do Math
      </button>
    </main>
  )
}
```

La primera vez que se pulse el botón, la interfaz de usuario mostrará 1, 2, la consola mostrará { linear: 0, exponential: 1 }, y el componente de la aplicación se habrá renderizado una vez.

La segunda vez que se haga clic en el botón, la interfaz de usuario mostrará 2, 4, la consola mostrará { linear: 1, exponential: 2 }, y el componente de la aplicación se habrá renderizado dos veces.

Y la tercera vez que se pulse el botón, la interfaz de usuario mostrará 3, 8, la consola mostrará { linear: 2, exponential: 4 }, y el componente de la aplicación se habrá renderizado tres veces.

Este ejemplo no sólo valida nuestro modelo mental sino que también nos muestra otro aspecto interesante de cómo React re-renderiza. Es decir, **React sólo volverá a renderizar una vez por manejador de evento, incluso si ese manejador de evento contiene actualizaciones para múltiples piezas de estado.**

**Este es otro ejemplo de cómo React sólo vuelve a renderizar un componente cuando es absolutamente necesario.** Con esto en mente, veamos otro ejemplo que puede sorprenderte…

Ahora digamos que queremos hacer nuestro componente Greeting un poco más acogedor. Para ello, crearemos y renderizaremos un componente Wave dentro de Greeting que añadirá un emoji 👋 en la parte superior derecha de la interfaz de usuario.

```jsx
import * as React from "react"

function Wave () {
  return (
    <span role="img" aria-label="hand waving">
      👋
    </span>
  )
}

function Greeting ({ name }) {
  const [index, setIndex] = React.useState(0)

  const greetings = ['Hello', "Hola", "Bonjour"]

  const handleClick = () => {
    const nextIndex = index === greetings.length - 1
      ? 0
      : index + 1
    setIndex(nextIndex)
  }

  return (
    <main>
      <h1>{greetings[index]}, {name}</h1>
      <button onClick={handleClick}>
        Next Greeting
      </button>
      <Wave />
    </main>
  )
}

export default function App () {
  return <Greeting name="Julio" />
}
```

Tu intuición probablemente esté pensando que nunca. Al fin y al cabo, si React sólo vuelve a renderizar cuando es absolutamente necesario, ¿por qué iba a hacerlo Wave si no acepta props y no tiene estado?

Observa que Wave vuelve a renderizar cada vez que pulsamos el botón (cambiando el estado del índice dentro de Greeting). Esto puede no ser intuitivo, pero demuestra un aspecto importante de React. **Cada vez que el estado cambia, React vuelve a renderizar el componente que posee ese estado y todos sus componentes hijos - independientemente de si esos componentes hijos aceptan o no props.**

Entiendo que esto puede parecer extraño. ¿No debería React sólo volver a renderizar los componentes hijos si sus props cambian? Cualquier otra cosa parece un desperdicio.

Primero, React es muy bueno renderizando. Si tienes un problema de rendimiento, la realidad es que raramente se debe a demasiadas renderizaciones.

En segundo lugar, la suposición de que React sólo debería volver a renderizar los componentes hijos si sus props cambian funciona en un mundo en el que los componentes React son siempre funciones puras y los props son lo único que estos componentes necesitan renderizar. El problema, como cualquiera que haya construido una aplicación React en el mundo real sabe, es que no siempre es así.

React proporciona algunas trampillas de escape para salir de su paradigma normal v = fn(s). Las veremos más adelante en el curso, pero debes saber que no podemos asumir que un componente sólo debe volver a renderizarse cuando cambian sus props.

En tercer lugar, si tienes un componente caro y quieres que ese componente se salga de este comportamiento por defecto y sólo se vuelva a renderizar cuando cambien sus props, puedes usar el componente de orden superior React.memo de React.

React.memo es una función que toma un componente React como argumento y devuelve un nuevo componente que sólo se volverá a renderizar si cambian sus props.

```jsx
import * as React from "react"

function Wave () {
  console.count('Rendering Wave')
  return (
    <span role="img" aria-label="hand waving">
      👋
    </span>
  )
}

export default React.memo(Wave)
```

Ahora, independientemente de cuántas veces hagamos clic en nuestro botón, Wave sólo se renderizará una vez, en la renderización inicial.

Pero de nuevo, incluso cuando tratamos con componentes hijo, nuestro modelo mental se mantiene fuerte. Cada vez que un componente React se renderiza, independientemente de por qué o dónde se encuentra en el árbol de componentes, React crea una instantánea del componente que captura todo lo que React necesita para actualizar la vista en ese momento en particular. props, estado, controladores de eventos y una descripción de la interfaz de usuario (basada en esos props y estado) son capturados en esta instantánea.

A partir de ahí, React toma esa descripción de la interfaz de usuario y la utiliza para actualizar la vista.

## Strict Mode Component

Puede que hayas oído hablar del componente StrictMode de React. Siempre que tengas StrictMode activado, React volverá a renderizar tus componentes una vez más.

Todos nuestros ejemplos hasta este punto han tenido el modo estricto desactivado, por razones obvias. Pero para que puedas verlo en acción, aquí está nuestro ejemplo Wave ahora en StrictMode.

Observa que cada vez que pulsamos el botón, nuestra aplicación se renderiza dos veces.

Esto puede parecer extraño, pero StrictMode se asegura de que tu aplicación es resistente a re-renders y que tus componentes son puros. Si no es así, será obvio cuando React renderice la segunda vez.

Independientemente de si React renderiza una o 100 veces, porque tu vista debería ser una función de tu estado, no debería importar. StrictMode te ayuda a asegurarte de que así sea.

La forma de habilitar StrictMode es envolviéndolo alrededor de tu App de esta manera.

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root')
);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

De forma similar a la creación de tu raíz, a menos que estés construyendo una aplicación React desde cero, esto normalmente lo hace por ti lo que sea que genere tu aplicación.

React sólo respetará StrictMode cuando estés en modo desarrollo. En producción, será ignorado.

Ahora que ya conoces StrictMode, incluiremos un interruptor en cada vista previa de código que te permitirá activarlo y desactivarlo.