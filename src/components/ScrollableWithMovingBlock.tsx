import { ReactNode, useState } from "react";
import MovingBlock from "./MovingBlock";

type ScrollableWithMovingBlockProps = {
  content: ReactNode;
};

// sólo una aproximación para demostrar el problema de las re-renders no utilizar en código real
const getPosition = (val: number) => 150 - val / 2;

function ScrollableWithMovingBlock({
  content,
}: ScrollableWithMovingBlockProps) {
  const [position, setPosition] = useState(300);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const calculated = getPosition(e.currentTarget.scrollTop);
    setPosition(calculated);
  };

  return (
    <div className="scrollable-block" onScroll={onScroll}>
      <MovingBlock position={position} />
      {content}
    </div>
  );
}

export default ScrollableWithMovingBlock;
