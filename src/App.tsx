/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { DummyComponent, ComponentDummy } from "./components/mocks";
import { VerySlowComponent } from "./components/very-slow-component";
import { MovingBlock } from "./components/MovingBlock";
// import { ScrollableWithMovingBlock } from "./components/ScrollableWithMovingBlock";
import "./styles.scss";


// ⚠️ hard-coded solo para mostrar el problema de los re-renders
const getPosition = (val: number) => 150 - val / 2;

// ⚠️ Con cada scroll se disparará un re-render
export default function App() {
  const [position, setPosition] = React.useState(150);

  const onScroll = (e: any) => {
    // calcula la posición en función del valor desplazado
    const calculated = getPosition(e.target.scrollTop);
    // guardarlo en estado
    setPosition(calculated);
  };

  return (
    <div className="scrollable-block" onScroll={onScroll}>
      {/* pasa valor de posición al nuevo componente móvil */}
      <MovingBlock position={position} />
      <VerySlowComponent />
      <DummyComponent />
      <ComponentDummy />
    </div>
  );
}

// 👌 Ahora, sobre la actualización del estado y la situación de los re-renderizados:
// Si se dispara una actualización del estado, volveremos a desencadenar un re-renderizado 
// de un componente, como de costumbre. 
// Solo afecta el componente ScrollableWithMovingBlock - solo un div con un
// bloque móvil. El resto de los componentes lentos se pasan a través de
// props, están fuera de ese componente. 

// export const App = () => {
//   const slowComponents = (
//     <>
//       <VerySlowComponent />
//       <DummyComponent />
//       <ComponentDummy />
//     </>
//   );
//   return <ScrollableWithMovingBlock content={slowComponents} />;
// };


