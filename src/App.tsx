// ⚠️ Ya no tenemos que gestionar el estado en App
// import { useState } from "react";

import { DummyComponent } from "./components/DummyComponent";
import { SlowComponent } from "./components/SlowComponent";
import ScrollableWithMovingBlock from "./components/ScrollableWithMovingBlock";

import "./styles.scss";

export default function App() {
  return (
    <ScrollableWithMovingBlock>
      <SlowComponent />
      <DummyComponent />
    </ScrollableWithMovingBlock>
  );
}
