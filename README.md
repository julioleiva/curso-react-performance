# Capítulo 2. Elementos, hijos como props, y re-renderizados

En el capítulo anterior, exploramos cómo los cambios de estado desencadenan
re-renderizados descendentes en nuestras aplicaciones y cómo se puede tratar esto usando el patrón de "mover el estado hacia abajo". Sin embargo, el ejemplo allí fue relativamente simple, y el estado estaba bastante aislado. Entonces moverlo dentro de un componente fue fácil. ¿Cuáles son nuestras opciones cuando la situación es un poco más complicada?

Es hora de continuar nuestra exploración de cómo funcionan los re-renderizados, hacer otra investigación de rendimiento y profundizar en los detalles:

- **Cómo pasar componentes como props puede mejorar el rendimiento
de nuestras aplicaciones**.
- Cómo exactamente React desencadena re-renderizados.
- **Por qué los componentes como props no se ven afectados por los re-renderizados.**
- **Qué es un Elemento, cómo es diferente de un Componente y
por qué es importante conocer esa distinción**.
- Los conceptos básicos de la reconciliación de React y la comparación.

## El problema

Imagina de nuevo que has heredado una aplicación grande, complicada y muy sensible al rendimiento. Y esa aplicación tiene un área de contenido desplazable.
Probablemente algún diseño elegante con una cabecera fija, una barra lateral plegable a la izquierda y el resto de la funcionalidad en el medio.

La forma más simple de implementar estos requisitos sería adjuntar
un manejador `onScroll` al div desplazable, capturar el valor desplazado, y calcular la posición del div flotante en función de eso:


Sin embargo, desde la perspectiva del rendimiento y los re-renderizados, esto está lejos de ser óptimo. **Cada desplazamiento desencadenará una actualización del estado, y como ya sabemos, la actualización del estado desencadenará un re-renderizado del componente App y de cada componente anidado dentro**.

Y como puedes ver, **ya no podemos extraer fácilmente ese estado en un componente. El `setPosition` se usa en la función `onScroll`, que está adjunta al div que envuelve todo.**

Todavía **podemos extraer ese estado y todo lo necesario para que el estado funcione en un componente:**

```jsx
const ScrollableWithMovingBlock = () => {
 const [position, setPosition] = useState(300);
 const onScroll = (e) => {
 const calculated = getPosition(e.target.scrollTop);
 setPosition(calculated);
 };
 return (
 <div className="scrollable-block" onScroll={onScroll}>
 <MovingBlock position={position} />
 </div>
 );
};

```

Y luego simplemente pasarle todo ese montón de cosas lentas a ese componente como props.
Algo así:

```jsx
const App = () => {
 const slowComponents = (
 <>
 <VerySlowComponent />
 <BunchOfStuff />
 <OtherStuffAlsoComplicated />
 </>
 );
 return (
 <ScrollableWithMovingBlock content={slowComponents} />
 );
};

```

Simplemente crea una propiedad "content" en nuestro componente `ScrollableWithMovingBlock` que acepta Elementos de React (más detalles sobre esos un poco más tarde). Y luego, dentro
de `ScrollableWithMovingBlock`, acepta esa prop y colócala donde se suponía que iba a renderizar:

```jsx
// add "content" property to the component
const ScrollableWithMovingBlock = ({ content }) => {
 const [position, setPosition] = useState(0);
 const onScroll = () => {...} // same as before
 return (
 <div className="scrollable-block" onScroll={onScroll}>
 <MovingBlock position={position} />
 {content}
 </div>
 )
}

```

Ahora, sobre la actualización del estado y la situación de los re-renderizados. Si se dispara una actualización del estado, volveremos a desencadenar un re-renderizado de un componente, como de costumbre. Sin embargo, en este caso, será el componente  `ScrollableWithMovingBlock` - solo un div con un
bloque móvil. El resto de los componentes lentos se pasan a través de
props, están fuera de ese componente. En el árbol de componentes "jerárquico",
pertenecen al padre. ¿Y recuerdas? React nunca sube por ese árbol cuando re-renderiza un componente. Entonces nuestros componentes lentos no se volverán a renderizar cuando se actualice el estado, y la experiencia de desplazamiento será suave y sin retrasos.

Pero...espera un segundo, algunos podrían pensar aquí. Esto no tiene mucho sentido.
**Sí, esos componentes se declaran en el padre, pero aún así se renderizan dentro de ese componente con el estado. Entonces, ¿por qué no se vuelven a renderizar?** 

Para entender todo esto, necesitamos comprender algunas cosas: lo que
realmente queremos decir con "re-renderizar" en React, **cuál es la diferencia entre un Elemento y un Componente, y los conceptos básicos de los algoritmos de reconciliación y comparación.**
