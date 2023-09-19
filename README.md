## El problema

Imagínate como un desarrollador que ha heredado una aplicación grande, complicada y muy sensible al rendimiento, en la que pasan muchas cosas, muchas personas han trabajado en ella a lo largo de los años, y millones de clientes la están utilizando ahora. Como tu primera tarea en el trabajo, se te pide que añadas un simple botón que abra un cuadro de diálogo modal justo en la parte superior de esta aplicación.

Examinas el código y encuentras el lugar donde se debería activar el diálogo:

```javascript
const App = () => {
 // mucho código aquí
 return (
 <div className="layout">
 {/* el botón debería ir en algún lugar aquí */}
 <VerySlowComponent />
 <DummyComponent />
 <ComponentDummy />
 </div>
 );
};
```

Luego lo implementas.
```javascript
const App = () => {
 // añadir algún estado
 const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="layout">
        {/* añadir el botón */}
        <Button onClick={() => setIsOpen(true)}>
        Abrir diálogo
        </Button>
        {/* añadir el propio diálogo */}
        {isOpen ? (
        <ModalDialog onClose={() => setIsOpen(false)} />
        ) : null}
        <VerySlowComponent />
        <DummyComponent />
        <ComponentDummy />
    </div>
 );
};
```

Simplemente añades un estado que guarda si el diálogo está abierto o cerrado. Añades el botón que desencadena la actualización del estado al hacer clic. Y el propio diálogo que se renderiza si la variable de estado es verdadera.

Inicias la aplicación, la pruebas y, vaya. ¡Tarda casi un segundo en abrir ese simple diálogo!

Las personas con experiencia en la gestión del rendimiento de React podrían estar tentadas a decir algo como: "¡Ah, claro! Estás volviendo a renderizar toda la aplicación, simplemente tienes que envolverlo todo en React.memo y usar hooks useCallback para evitarlo". Y técnicamente, esto es cierto. Pero no te precipites. La memorización es completamente innecesaria aquí y hará más daño que bien. Hay una forma más eficaz.

Pero primero, repasemos qué es lo que está ocurriendo exactamente aquí y por qué.

Claro, aquí tienes la traducción al español del texto:

## Moviendo el estado hacia abajo  
Ahora que está claro cómo React vuelve a renderizar los componentes, es hora de aplicar este conocimiento al problema original y solucionarlo. Echemos un vistazo más de cerca al código, en particular donde usamos el estado del diálogo modal:

```javascript
const App = () => {
  // nuestro estado se declara aquí
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="layout">
      {/* el estado se usa aquí */}
      <Button onClick={() => setIsOpen(true)}>
        Abrir diálogo
      </Button>
      {/* el estado se usa aquí */}
      {isOpen ? (
        <ModalDialog onClose={() => setIsOpen(false)} />
      ) : null}
      <VerySlowComponent />
      <DummyComponent />
      <ComponentDummy />
    </div>
  );
};
```
Como puedes ver, está relativamente aislado: lo usamos solo en el componente Button y en el propio ModalDialog. El resto del código, todos esos componentes muy lentos, no depende de él y, por lo tanto, en realidad no necesita volver a renderizarse cuando este estado cambia. Es un ejemplo clásico de lo que se llama un re-renderizado innecesario.

Envolverlos en React.memo evitará que se vuelvan a renderizar en este caso, es cierto. Pero React.memo tiene muchas advertencias y complejidades alrededor. Hay una mejor manera. Todo lo que necesitamos hacer es extraer los componentes que dependen de ese estado y el estado en sí en un componente más pequeño:  

```javascript
const ButtonWithModalDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  // renderizar solo Button y ModalDialog aquí
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Abrir diálogo
      </Button>
      {isOpen ? (
        <ModalDialog onClose={() => setIsOpen(false)} />
      ) : null}
    </>
  );
};

```
Y luego simplemente renderizar este nuevo componente en la gran App original:  

```javascript
const App = () => {
  return (
    <div className="layout">
      {/* aquí va, componente con el estado dentro */}
      <ButtonWithModalDialog />
      <VerySlowComponent />
      <DummyComponent />
      <ComponentDummy />
    </div>
  );
};
```

Ahora, la actualización del estado cuando se hace clic en el botón todavía se activa, y algunos componentes se vuelven a renderizar debido a ello. ¡Pero! Solo sucede con los componentes dentro del componente ButtonWithModalDialog. Y es solo un pequeño botón y el diálogo que debería renderizarse de todos modos. El resto de la aplicación está a salvo.

Esencialmente, acabamos de crear una nueva sub-rama dentro de nuestro árbol de renderizado y movimos nuestro estado hacia ella.

Como resultado, el diálogo modal aparece instantáneamente. ¡Acabamos de solucionar un gran problema de rendimiento con una técnica de composición simple!

## Puntos clave

1) La renderización es la forma en que React actualiza los componentes con nuevos datos.
2) Sin re-renders, no habrá interactividad en nuestras aplicaciones.
3)La actualización del estado es la fuente inicial de todas las re-renderizaciones.
4) Si se activa el re-renderizado de un componente, todos los componentes anidados
dentro de ese componente serán re-renderizados.
6) Podemos usar el patrón conocido como "moving state down" para prevenir
re-renders innecesarios en aplicaciones grandes.
7) La actualización del estado en un gancho activará el re renderizado de un componente que utiliza este gancho, incluso si el propio estado no se utiliza.
