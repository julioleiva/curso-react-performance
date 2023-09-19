import { useState } from 'react';

import { ModalDialog } from './components/basic-modal-dialog';
import { Button } from './components/button';
import { DummyComponent, ComponentDummy } from './components/mocks';
import { VerySlowComponent } from './components/very-slow-component';
// import { ButtonWithModalDialog } from './components/button-with-modal-dialog';

import './styles.scss';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open dialog</Button>
      {isOpen ? <ModalDialog onClose={() => setIsOpen(false)} /> : null}
      <VerySlowComponent />
      <DummyComponent />
      <ComponentDummy />
    </>
  );
}

// 👌
// export default function App(){
//   return (
//     <div className="layout">
//       {/* componente con el estado dentro y aislado de la App principal */}
//       <ButtonWithModalDialog />
//       <VerySlowComponent />
//       <DummyComponent />
//       <ComponentDummy />
//     </div>
//   );
// }
