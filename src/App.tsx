import React from "react";
import "./styles.css";

const Child = ({ value }: { value: number }) => {
  console.log("Child re-renders", value);
  return <div>{value}</div>;
};

const values = [...Array(100000).keys()];

const ChildMemo = React.memo(Child);

const App = () => {
  const [state, setState] = React.useState(1);

  const onClick = () => {
    setState(state + 1);
  };

  return (
    <>
      <h2>Abre la consola y aprieta el botón 🐭</h2>
      <p>Listas estáticas con índice e id como clave</p>
      <p>Los hijos no deben volver a renderizarse</p>
      <p>
        Si no envolvemos el componente hijo con React.memo volverán a
        renderizarse
      </p>

      <button onClick={onClick}>click here {state}</button>
      <br />
      <br />

      {values.map((val, index) => (
        <ChildMemo value={val} key={index} />
      ))}
      <br />
      <br />

      {values.map((val) => (
        <ChildMemo value={val} key={val} />
      ))}
    </>
  );
};

export default App;
