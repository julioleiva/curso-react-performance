import React from "react";
import "./styles.css";

const Child = ({ value }: { value: string }) => {
  console.log("Child re-renders", value);
  return <div>{value}</div>;
};

const values = [...Array(1000).keys()];

const ChildMemo = React.memo(Child);

const App = () => {
  const [state, setState] = React.useState<"up" | "down">("up");

  const onClick = () => {
    setState(state === "up" ? "down" : "up");
  };

  const sortedValues = state === "up" ? values.sort() : values.sort().reverse();
  return (
    <>
      <h2>Abre la consola y aprieta el botón 🐭</h2>
      <p>Listas dinámicas con índice e id como clave</p>
      <p>👎 Índice como clave no funciona - los hijos vuelven a renderizar. </p>
      <p>👍 Id como clave está bien</p>

      <button onClick={onClick}>click here {state}</button>
      <br />
      <br />

      {/* 👌 Cuando se utiliza el índice como clave y el orden de los elementos cambia 
      (como cuando se ordenan de manera diferente), React no puede optimizar el rendimiento 
      y los componentes se vuelven a renderizar. Esto se debe a que React utiliza la clave 
      para determinar si un componente es "el mismo" entre diferentes renderizados. */}

      {/* {sortedValues.map((val, index) => (
        <ChildMemo value={`Child of index: ${val}`} key={index} />
      ))} */}
      <br />
      <br />

      {/* 👌 Cuando se utiliza el valor del elemento como clave, React puede optimizar el rendimiento y
      evitar re-renderizados innecesarios, ya que sabe que el componente con una clave específica 
      es "el mismo" incluso si su posición en la lista ha cambiado. */}

      {sortedValues.map((val) => (
        <ChildMemo value={`Child of id: ${val}`} key={val} />
      ))}
    </>
  );
};

export default App;
