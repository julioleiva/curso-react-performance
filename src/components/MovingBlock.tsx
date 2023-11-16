function MovingBlock({ position }: { position: number }) {
    return (
      <div className="movable-block" style={{ top: position }}>
        {position}
      </div>
    );
  }

  export default MovingBlock;