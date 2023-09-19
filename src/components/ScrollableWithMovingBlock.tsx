import React, {ReactNode} from "react";
import { MovingBlock } from "./MovingBlock";

// ⚠️ hard-coded solo para mostrar el problema de los re-renders
const getPosition = (val: number) => 150 - val / 2;

// 👌 sacamos de la App principal el estado para evitar re-renders con cada scroll
// export const ScrollableWithMovingBlock = () => {
//     const [position, setPosition] = React.useState(300);
//     const onScroll = (e) => {
//         const calculated = getPosition(e.target.scrollTop);
//         setPosition(calculated);
//     };
//     return (
//         <div className="scrollable-block" onScroll={onScroll}>
//             <MovingBlock position={position} />
//         </div>
//     );
// };

// 👌👌 añadir la propiedad "content" al componente para poder pasarle componentes como props
export const ScrollableWithMovingBlock = ({ content }: { content: ReactNode }) => {
  const [position, setPosition] = React.useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onScroll = (e: any) => {
    const calculated = getPosition(e.target.scrollTop);
    setPosition(calculated);
  };
  return (
    <div className="scrollable-block" onScroll={onScroll}>
      <MovingBlock position={position} />
      {content}
    </div>
  );
};
