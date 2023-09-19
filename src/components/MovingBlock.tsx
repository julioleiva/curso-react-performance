import '../styles.scss'

export const MovingBlock = ({ position }: { position: number }) => (
    <div className="movable-block" style={{ top: position }}>
      {position}
    </div>
  );