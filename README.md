### El estado de los hooks personalizados

Otro concepto muy importante que no deberíamos olvidar al tratar con el estado, re-renderizados y rendimiento son los hooks personalizados. Después de todo, fueron introducidos precisamente para que pudiéramos abstraer la lógica relacionada con el estado. Es muy común ver lógica como la que teníamos antes extraída en algo como el hook `useModalDialog`. Una versión simplificada podría verse así:

```jsx
const useModalDialog = () => {
 const [isOpen, setIsOpen] = useState(false);
 return {
 isOpen,
 open: () => setIsOpen(true),
 close: () => setIsOpen(false),
 };
};

```

Y luego usar este hook en nuestra App en lugar de establecer el estado directamente:

```jsx
const App = () => {
 // el estado está en el hook ahora
 const { isOpen, open, close } = useModalDialog();
 return (
 <div className="layout">
 {/* simplemente usa el método "open" del hook */}
 <Button onClick={open}>Abrir diálogo</Button>
 {/* simplemente usa el método "close" del hook */}
 {isOpen ? <ModalDialog onClose={close} /> : null}
 <VerySlowComponent />
 <BunchOfStuff />
 <OtherStuffAlsoComplicated />
 </div>
 );
};

```

Parece un patrón razonable, y el código es un poco más limpio. Porque el hook oculta el hecho de que tenemos estado en la aplicación. ¡Pero el estado sigue ahí! Cada vez que cambia, seguirá desencadenando un re-renderizado del componente que usa este hook. No importa si este estado se usa directamente en la App o incluso si el hook devuelve algo.

Por ejemplo, si quiero ser sofisticado con la posición de este diálogo e introducir algún estado dentro de ese hook que escuche el redimensionamiento de la ventana:

```jsx
const useModalDialog = () => {
 const [width, setWidth] = useState(0);
 useEffect(() => {
 const listener = () => {
 setWidth(window.innerWidth);
 }
 window.addEventListener('resize', listener);
 return () => window.removeEventListener('resize', listener);
 }, []);
 // el retorno es el mismo
 return ...
}

```

El componente App completo se volverá a renderizar en cada redimensionamiento, ¡aunque este valor ni siquiera se devuelve desde el hook!

Los hooks son esencialmente solo bolsillos en tus pantalones. Si, en lugar de llevar una pesa de 10 kilogramos en tus manos, la pones en tu bolsillo, no cambiaría el hecho de que sigue siendo difícil correr: tienes 10 kilogramos de peso adicional en tu persona. Pero si pones esos diez kilogramos en un carrito autónomo, puedes correr libremente y fresco e incluso detenerte a tomar café: el carrito se cuidará a sí mismo. Los componentes para el estado son ese carrito.

Exactamente la misma lógica se aplica a los hooks que usan otros hooks: cualquier cosa que pueda desencadenar un re-renderizado, por muy profundo que esté en la cadena de hooks, provocará un re-renderizado en el componente que usa ese primer hook. Si extraigo ese estado adicional en un hook que devuelve `null`, la App seguirá re-renderizándose en cada redimensionamiento:

```jsx
const useResizeDetector = () => {
 const [width, setWidth] = useState(0);
 useEffect(() => {
 const listener = () => {
 setWidth(window.innerWidth);
 };
 window.addEventListener('resize', listener);
 return () => window.removeEventListener('resize', listener);
 }, []);
 return null;
}
const useModalDialog = () => {
 // ni siquiera lo uso, solo lo llamo aquí
 useResizeDetector();
 // el retorno es el mismo
 return ...
}
const App = () => {
 // este hook usa useResizeDetector debajo que desencadena
// actualización de estado en redimensionamiento
 // ¡toda la App se volverá a renderizar en cada redimensionamiento!
 const { isOpen, open, close } = useModalDialog();
 return // mismo retorno
}

```

Así que, ten cuidado con esos.

Para solucionar nuestra aplicación, todavía tendrías que extraer ese botón, diálogo y el hook personalizado en un componente:

```jsx
const ButtonWithModalDialog = () => {
 const { isOpen, open, close } = useModalDialog();
 // renderizar solo el botón y el diálogo modal aquí
 return (
 <>
 <Button onClick={open}>Abrir diálogo</Button>
 {isOpen ? <ModalDialog onClose={close} /> : null}
 </>
 );
};

```
