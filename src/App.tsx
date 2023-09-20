import React from 'react';
import { ModalDialog } from './components/basic-modal-dialog';
import { Button } from './components/button';
import { DummyComponent, ComponentDummy } from './components/mocks';
import { VerySlowComponent } from './components/very-slow-component';
import { useModalDialog } from './hooks/useModalDialog';
// import { ButtonWithModalDialog } from './components/button-with-modal-dialog';

import './styles.scss';


// ⚠️
export default function App() {
// este hook usa useResizeDetector por debajo que desencadena
// actualización de estado en redimensionamiento
// ¡toda la App se volverá a renderizar en cada redimensionamiento!
  const { isOpen, open, close } = useModalDialog();

  React.useEffect(() => {
    console.info('El componente que utiliza useModalDialog se vuelve a re-renderizar');
  });
  return (
    <div className="layout">
      {/* sólo usa el método "open" del gancho */}
      <Button onClick={open}>Open dialog</Button>
      {/* sólo usa el método "cerrar" del gancho */}
      {isOpen ? <ModalDialog onClose={close} /> : null}
      <VerySlowComponent />
      <DummyComponent />
      <ComponentDummy />
    </div>
  );
}


// 👌
// export default function App() {  
//     React.useEffect(() => {
//       console.info('El componente que utiliza useModalDialog se vuelve a re-renderizar');
//     });
//     return (
//       <div className="layout">
//         <ButtonWithModalDialog />
//         <VerySlowComponent />
//         <DummyComponent />
//         <ComponentDummy />
//       </div>
//     );
//   }
