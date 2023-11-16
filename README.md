# Capítulo 4. Elementos, hijos como props, y re-renderizados

## Elementos, Componentes, y rerenders

Primero de todo, un Componente - ¿qué es? Aquí está el más simple:

```jsx
const Parent = () => {
  return <Child />;
};

```

Como puedes ver, es solo una función. **Lo que hace un componente diferente de cualquier otra función es que retorna Elementos, que React luego convierte en elementos DOM y envía al navegador para ser dibujados en la pantalla.** Si tiene props, esos serían solo el primer argumento de esa función:

```jsx
const Parent = (props) => {
  return <Child />;
};

```

Esta función retorna `<Child />`, que es **un Elemento de un Componente Child**. **Cada vez que usamos esos corchetes en un componente, creamos un Elemento**. El Elemento del componente Parent sería `<Parent />`.

**Un Elemento es simplemente un objeto que define un componente que necesita ser renderizado en la pantalla**. De hecho, la bonita sintaxis similar a HTML no es nada más que azúcar sintáctica para la función React.createElement[2].

```jsx
React.createElement(Child, null, null) // y todo funcionará como se espera.

```

---

La definición del objeto para nuestro elemento `<Child />` se vería algo como esto:

```jsx
{
  type: Child,
  props: {}, // si Child tuviera props
  ... // muchas otras cosas internas de React
}

```

Esto nos dice que el componente Parent, que retorna esa definición, quiere que rendericemos el componente Child sin props. El retorno del componente Child tendrá sus propias definiciones, y así sucesivamente, hasta que lleguemos al final de esa cadena de componentes.

**Los Elementos no están limitados a componentes; pueden ser solo elementos DOM normales.** Nuestro Child podría retornar una etiqueta h1, por ejemplo:

```jsx
const Child = () => {
  return <h1>Algún título</h1>;
};

```

En este caso, el objeto de definición será exactamente el mismo y se comportará de la misma manera, solo que el tipo será una cadena:

```jsx
{
  type: "h1",
  ... // props y cosas internas de React
}

```

Ahora para re-renderizar. Lo que usualmente nos referimos como "re-render" es React llamando a esas funciones y ejecutando todo lo que necesita ser ejecutado en el proceso (como hooks). Desde el retorno de esas funciones, React construye un árbol de esos objetos. Lo conocemos como el Árbol de Fibra ahora, o Virtual DOM a veces.

De hecho, son incluso dos árboles: antes y después de rerender. Comparando ("diffing") esos, React extraerá información que va al navegador: qué elementos DOM necesitan ser actualizados, eliminados o agregados. Esto es conocido como el algoritmo de "reconciliación".

La parte que importa para el problema de este capítulo es la siguiente: si el objeto (Elemento) antes y después del re-render es exactamente el mismo, entonces React omitirá el re-render del Componente que este Elemento representa y sus componentes anidados. Y por "exactamente lo mismo", quiero decir si `Object.is(ElementBeforeRerender, ElementAfterRerender)` retorna `true`. React no realiza la comparación profunda de objetos. Si el resultado de esta comparación es `true`, entonces React dejará ese componente en paz y pasará al siguiente.

Si la comparación retorna `false`, esta es la señal para React de que algo ha cambiado. Mirará el tipo entonces. Si el tipo es el mismo, entonces React re-renderizará este componente. Si el tipo cambia, entonces eliminará el "viejo" componente y montará el "nuevo". Lo veremos con más detalle en el Capítulo 6. Buceo profundo en el diffing y la reconciliación.

Echemos un vistazo al ejemplo de Parent/Child de nuevo e imaginemos que nuestro Parent tiene estado:

```jsx
const Parent = (props) => {
  const [state, setState] = useState();
  return <Child />;
};

```

Cuando se llama a `setState`, React sabrá que debe re-renderizar el componente Parent. Así que llamará a la función Parent y comparará lo que retorna antes y después de que cambie el estado. Y retorna un objeto que está definido localmente para la función Parent. Así que en cada llamada a la función (es decir, re-render), este objeto será recreado, y el resultado de `Object.is` en objetos "antes" y "después" de `<Child />` será `false`. Como resultado, cada vez que el Parent aquí se re-renderiza, el Child también se re-renderizará. Lo cual ya sabemos, pero es bueno tener una prueba de esto, ¿no es así?

Ahora, imagina qué sucederá aquí si, en lugar de renderizar ese componente Child directamente, lo pasaría como una prop?

```jsx
const Parent = ({ child }) => {
  const [state, setState] = useState();
  return child;
};
// alguien en algún lugar renderiza el componente Parent así
<Parent child={<Child />} />;

```

En algún lugar, donde se renderiza el componente Parent, el objeto de definición `<Child />` se crea y se pasa como la prop child. Cuando se dispara la actualización del estado en Parent, React comparará lo que retorna la función Parent "antes" y "después" del cambio de estado. Y en este caso, será una referencia al child: un objeto que se crea fuera del ámbito de la función Parent y, por lo tanto, no cambia cuando se le llama. Como resultado, la comparación del child "antes" y "después" retornará `true`, y React omitirá el re-render de este componente.

Y esto es exactamente lo que hicimos para nuestro componente con el scroll!

```jsx
const ScrollableWithMovingBlock = ({ content }) => {
  const [position, setPosition] = useState(300);
  const onScroll = () => {...} // igual que antes
  return (
    <div className="scrollable-block" onScroll={onScroll}>
    <MovingBlock position={position} />
    {content}
    </div>
  )
}

```

Cuando se dispara `setPosition` en `ScrollableWithMovingBlock`, y sucede un re-render, React comparará todas esas definiciones de objeto que la función retorna, verá que el objeto de content es exactamente el mismo antes y después, y omitirá el re-render de lo que sea que esté allí. En nuestro caso, un montón de componentes muy lentos.

`<MovingBlock ... />`, sin embargo, se volverá a renderizar: se crea dentro de `ScrollableWithMovingBlock`. El objeto se recreará en cada re-renderización, y la comparación "antes" y "después" retornará `false`.

### Children as props

Mientras que este patrón es genial y totalmente válido, hay un pequeño problema con él: se ve raro. Pasar todo el contenido de la página a algunas props aleatorias simplemente se siente... incorrecto por alguna razón. Así que, vamos a mejorarlo.

Primero que todo, hablemos sobre la naturaleza de las props. Las props s**on simplemente un objeto que pasamos como el primer argumento a nuestra función de componente**. Todo lo que extraemos de él es una prop. Todo. En nuestro código Parent/Child, si cambio el nombre de la prop `child` a `children`, nada cambiará: seguirá funcionando.

```jsx
// antes
const Parent = ({ child }) => {
  return child;
};
// después
const Parent = ({ children }) => {
  return children;
}

```

Y en el lado del consumidor, la misma situación: nada cambia.

```jsx
// antes
<Parent child={<Child />} />
// después
<Parent children={<Child />} />

```

Sin embargo, para las props `children`, tenemos una sintaxis especial en JSX. Esa agradable composición de anidamiento que usamos todo el tiempo con las etiquetas HTML, simplemente nunca pensamos en ello y prestamos atención a ello:

```jsx
<Parent>
  <Child />
</Parent>

```

Esto funcionará exactamente de la misma manera como si estuviéramos pasando la prop `children` explícitamente:

```jsx
<Parent children={<Child />} />
// exactamente igual que arriba
<Parent>
  <Child />
</Parent>

```

Y será representado como este objeto:

```jsx
{
  type: Parent,
  props: {
    // elemento para Child aquí
    children: {
      type: Child,
      ...
    },
  }
}

```

Y tendrá exactamente los mismos beneficios de rendimiento que pasar elementos como props también! Cualquier cosa que se pase a través de props no se verá afectada por el cambio de estado del componente que recibe esas props. Así que podemos reescribir nuestra App de esto:

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

A algo mucho más bonito y fácil de entender:

```jsx
const App = () => {
  return (
    <ScrollableWithMovingBlock>
      <VerySlowComponent />
      <BunchOfStuff />
      <OtherStuffAlsoComplicated />
    </ScrollableWithMovingBlock>
  );
};

```

Todo lo que necesitamos hacer en el componente `ScrollableWithMovingBlock` es cambiar el nombre de la prop `content` a `children`, ¡nada más! Antes:

```jsx
const ScrollableWithMovingBlock = ({ content }) => {
  // .. el resto del código
  return (
    <div ...>
      ...
      {content}
    </div>
  )
}

```

Después:

```jsx
const ScrollableWithMovingBlock = ({ children }) => {
  // .. el resto del código
  return (
    <div ...>
      ...
      {children}
    </div>
  )
}

```

Y aquí vamos: implementado un bloque desplazable muy eficiente en una aplicación muy lenta utilizando solo un pequeño truco de composición.

## Lecciones clave

Espero que esto tenga sentido y ahora te sientas seguro con los **patrones de "componentes como props" y "children como props"**:

- Un componente es solo una función que acepta un argumento (`props`) y devuelve elementos que deben ser renderizados cuando este componente se renderiza en la pantalla. `const A = () => <B />` es un componente.
- Un elemento es un objeto que describe lo que necesita ser renderizado en la pantalla, con el tipo ya sea una cadena para elementos DOM o una referencia a un componente para componentes. `const b = <B />` es un elemento.
- Re-renderizar es simplemente React llamando a la función del componente.
- Un componente se vuelve a renderizar cuando su objeto de elemento cambia, según lo determinado por la comparación de `Object.is` antes y después del re-renderizado.
- Cuando los elementos se pasan como props a un componente, y este componente activa un re-renderizado a través de una actualización de estado, los elementos que se pasan como props no se volverán a renderizar.
- "children" son solo props y se comportan como cualquier otro prop cuando se pasan a través de la sintaxis de anidamiento JSX:
    
    ```jsx
    <Parent>
      <Child />
    </Parent>
    
    ```
    
     es lo mismo que:

     ```jsx
     <Parent children={<Child />} />
     ```