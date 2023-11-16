import { useState } from 'react';

import { ModalDialog } from './components/ModalDialog';
import { Button } from './components/Button';
import { DummyComponent } from './components/DummyComponent';
import { VerySlowComponent } from './components/SlowComponent';

import './styles.scss';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open dialog</Button>
      {isOpen ? <ModalDialog onClose={() => setIsOpen(false)} /> : null}
      <VerySlowComponent />
      <DummyComponent />
    </>
  );
}
