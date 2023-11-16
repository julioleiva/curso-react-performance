import { useState } from "react";

import { DummyComponent } from "./components/DummyComponent";
import { SlowComponent } from "./components/SlowComponent";
// import ScrollableWithMovingBlock from "./components/ScrollableWithMovingBlock";

import "./styles.scss";

const MovingBlock = ({ position }: { position: number }) => (
  <div className="movable-block" style={{ top: position }}>
    {position}
  </div>
);

// sólo una aproximación para demostrar el problema de las re-renders no utilizar en código real
const getPosition = (val: number) => 150 - val / 2;

export default function App() {
  const [position, setPosition] = useState(150);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const calculated = getPosition(e.currentTarget.scrollTop);
    setPosition(calculated);
  };

  return (
    <div className="scrollable-block" onScroll={onScroll}>
      {/* pasamos el valor de posición al nuevo componente móvil */}
      <MovingBlock position={position} />
      <SlowComponent />
      <DummyComponent />
    </div>
  );
}


// 👍
// export default function App() {
//   const slowComponents = (
//     <>
//       <SlowComponent />
//       <DummyComponent />
//     </>
//   );
//   return <ScrollableWithMovingBlock content={slowComponents} />;
// }
