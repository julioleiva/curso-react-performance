# Capítulo 5. Memorización con `useMemo`, `useCallback` y `React.memo`


Ahora que **conocemos los patrones de composición más importantes** y cómo
funcionan, es hora de hablar más sobre rendimiento. Más precisamente, discutamos el tema que está fuertemente asociado con mejorar el rendimiento en React: Memoización. Nuestros hooks favoritos `useMemo` y `useCallback`, y el componente de orden superior `React.memo`:


- Cuál es el problema que estamos tratando de resolver con memoización (¡y no es rendimiento per se!).
- Cómo funcionan `useMemo` y `useCallback` internamente y cuál es la diferencia entre ellos.
- Por qué memoizar las props en un componente por sí mismo es un antipatrón.
- Qué es `React.memo`, por qué lo necesitamos y cuáles son las reglas básicas para usarlo con éxito.
- Cómo usarlo correctamente con el patrón "elementos como hijos".
- Cuál es el papel de `useMemo` en cálculos costosos.

# El problema: comparar valores

Todo se trata de comparar valores en JavaScript. Los valores primitivos como cadenas o booleanos los comparamos por su valor real:

```jsx
const a = 1;
const b = 1;
a === b; // será verdadero, los valores son exactamente iguales

```

Con objetos y **cualquier cosa heredada de objetos** (como **matrices o funciones**), es otra historia.
Cuando creamos una variable con un objeto `const a = { id: 1 }`, el
valor almacenado allí no es el valor real. Es solo una referencia a una parte
de la memoria que contiene ese objeto. Cuando creamos otra
variable con los mismos datos `const b = { id: 1 }`, se almacenará
en otra parte de la memoria. Y dado que es una parte diferente, la referencia
a ella también será diferente.
Así que incluso si estos objetos se ven exactamente iguales, los valores en nuestras nuevas variables a y b son diferentes: apuntan a diferentes objetos en la memoria.
Como resultado, una simple comparación entre ellos siempre devolverá falso:

```jsx
const a = { id: 1 };
const b = { id: 1 };
a === b; // siempre será falso

```

**Para hacer que la comparación de `a === b` devuelva `true`, necesitamos asegurarnos
de que la referencia en `b` sea exactamente la misma que la referencia en `a`.**
Algo como esto:

```jsx
const a = { id: 1 };
const b = a;
a === b; // ahora será verdadero

```

Esto es con lo que React tiene que lidiar cada vez que necesita comparar valores
entre re-renderizados. Hace esta comparación cada vez que usamos hooks
con dependencias, como en `useEffect` por ejemplo:

```jsx
const Component = () => {
 const submit = () => {};
 useEffect(() => {
 // llamar a la función aquí
 submit();
 // está declarado fuera del useEffect
 // así que debería estar en las dependencias
 }, [submit]);
 return ...
}

```

En este ejemplo, la función `submit` está declarada fuera del hook
`useEffect`. Entonces, si quiero usarla dentro del hook, debería ser
declarada como una dependencia. Pero dado que `submit` está declarado localmente dentro
de `Component`, se recreará cada vez que `Component` se vuelva a renderizar.
Recuerda que discutimos en el Capítulo 2. Elementos, hijos como props, y
re-renderizados: **un re-renderizado es simplemente React llamando a las funciones del componente.**
**Cada variable local durante eso será recreada, exactamente igual que
cualquier función en JavaScript.**
Por lo tanto, **React comparará `submit` antes y después del re-renderizado para
determinar si debe ejecutar el hook `useEffect` esta vez. La
comparación siempre devolverá falso ya que es una nueva referencia cada
vez. Como resultado, el hook `useEffect` se activará en cada re-renderizado.**

---

### useMemo y useCallback: cómo funcionan

P**ara poder luchar contra el re-renderizado innecesario en React, necesitamos una forma de conservar la referencia a la función entre repeticiones.** Esto es crucial para que la comparación con hooks como `useEffect` devuelva `true` y el hook no se active innecesariamente. Aquí es donde entran en juego `useMemo` y `useCallback`.

Ambos hooks tienen una API similar y sirven a un propósito similar: asegurarse de que la referencia en la variable a la que están asignados esos hooks cambie sólo cuando cambie la dependencia del hook.

### ## useCallback

Si envuelvo el submit en `useCallback`:

```jsx

const submit = useCallback(() => {
  // sin dependencias, la referencia no cambiará entre re-renders
}, []);

```

Entonces el valor en la variable `submit` será la misma referencia entre repeticiones. La comparación en el hook `useEffect` que depende de `submit` devolverá `true`, y no se activará en cada re-render.

```jsx
const Componente = () => {
  const submit = useCallback(() => {
    // envía algo aquí
  }, []);
  useEffect(() => {
    submit();
    // submit es memoized, por lo que useEffect no se activará en cada re-renderización
  }, [submit]);
  return ...
}

```

## useMemo

Exactamente la misma historia con `useMemo`, sólo que en este caso, necesito devolver la función que quiero memoizar:

```jsx
const submit = useMemo(() => {
  return () => {
    // esta es nuestra función submit - es devuelta por la función que se pasa a useMemo
  };
}, []);

```

https://codesandbox.io/s/friendly-rain-qslps4

## Diferencias entre useMemo y useCallback

Como puedes ver, hay una ligera diferencia en la API. `useCallback` acepta la función que queremos memoizar como primer argumento, mientras que `useMemo` acepta una función y memoriza su valor de retorno. También hay una ligera diferencia en su comportamiento debido a eso.

## Implementación

En el hook `useCallback`, React hace algo como esto:

```jsx
let cachedCallback;
const func = (callback) => {
  if (dependenciesEqual()) {
    return cachedCallback;
  }
  cachedCallback = callback;
  return callback;
};

```

Con `useMemo`, es más o menos lo mismo, sólo que en lugar de devolver la función, React la llama y devuelve el resultado:

```jsx
let cachedResult;
const func = (callback) => {
  if (dependenciesEqual()) {
    return cachedResult;
  }
  cachedResult = callback();
  return cachedResult;
};

```

## Conclusión

La única vez que importaría la diferencia entre `useCallback` y `useMemo` es cuando pasamos como primer argumento no la función en sí, sino un resultado de la ejecución de otra función hardcoded inline. En este caso, evita hacer cálculos costosos en esas funciones.

### Antipatrón: memoización de props

El segundo uso más popular para los hooks de memoización, después de
valores memoizados como dependencias, es pasarlos a props. Seguramente
has visto código como este:

```jsx
const Component = () => {
 const onClick = useCallback(() => {
 // hacer algo al hacer click
 }, []);
 return <button onClick={onClick}>haz click en mí</button>;
};

```

Desafortunadamente, este useCallback aquí es simplemente inútil. Hay esta
creencia generalizada que incluso ChatGPT parece sostener, que la memoización
de props previene que los componentes se vuelvan a renderizar. Pero como ya sabemos
de los capítulos anteriores, si un componente se vuelve a renderizar, cada componente
dentro de ese componente también se volverá a renderizar.

Así que si envolvemos o no nuestra función onClick en useCallback
no importa en absoluto aquí. Todo lo que hicimos fue hacer que React haga un poco más
de trabajo y hacer que nuestro código sea un poco más difícil de leer. Cuando es solo un
useCallback , no parece tan malo. Pero nunca es solo uno, ¿verdad?
Habrá otro, luego otro, empezarán a depender el uno del otro, y antes de que te des cuenta,
la lógica en la app está simplemente enterrada bajo
el lío incomprensible e indescifrable de useMemo y
useCallback .

Solo hay dos casos de uso principales donde realmente necesitamos memoizar
props en un componente. El primero es cuando esta prop se utiliza como una
dependencia en otro hook en el componente descendente.

```jsx
const Parent = () => {
 // ¡esto necesita ser memoizado!
 // Child lo usa dentro de useEffect
 const fetch = () => {};
 return <Child onMount={fetch} />;
};
const Child = ({ onMount }) => {
 useEffect(() => {
 onMount();
 }, [onMount]);
};

```

Esto debería ser autoexplicativo: si un valor no primitivo entra en una
dependencia, debería tener una referencia estable entre re-renderizados, incluso si
viene de una cadena de props.

Y el segundo es cuando un componente está envuelto en React.memo .

# ¿Qué es React.memo?

React.memo o simplemente memo es una utilidad muy útil que nos ofrece React. Nos permite memorizar el propio componente. **Si un componente se vuelve a renderizar debido a su componente padre (y solo en ese caso), y si este componente está envuelto en React.memo, solo entonces React se detendrá y comprobará sus props. Si ninguna de las props cambia, el componente no se volverá a renderizar, deteniendo la cadena normal de re-renderizados.**

![Screenshot 2023-09-02 at 21.34.41.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/08528b1c-483d-4a15-9da4-2536624430c2/ee307b8b-7ad0-4abf-8ea8-11fb40b2709c/Screenshot_2023-09-02_at_21.34.41.png)

Este es nuevamente el caso cuando React realiza esa comparación de la que hablamos al principio del capítulo. **Con que solo** **una de las props ha cambiado, el componente envuelto en React.memo se volverá a renderizar como de costumbre**. En el caso del ejemplo anterior, data y onChange se declaran en línea, por lo que cambiarán con cada re-renderizado.

**Aquí es donde useMemo y useCallback brillan:**

```jsx
const Child = ({ data, onChange }) => {};
// Al memorizar data y onChange, 
// estamos conservando la referencia a esos objetos entre re-renderizados.
const ChildMemo = React.memo(Child);

const Component = () => {
  const data = useMemo(() => ({ ... }), []);
  const onChange = useCallback(() => {}, []);

//Ahora, cuando React compara las props en el componente ChildMemo, 
// la verificación pasará y el componente no se volverá a renderizar
  return <ChildMemo data={data} onChange={onChange} />;
};

```

**Pero asegurarse de que todas las props estén memorizadas no es tan fácil como parece.** ¡**Lo estamos haciendo mal en muchos casos! Y un solo error lleva a una verificación de props rota, y como resultado, cada React.memo, useCallback y useMemo se vuelven completamente inútiles.**

https://codesandbox.io/s/m6mz9y?file=/App.tsx&utm_medium=sandpack

# React.memo y props de props

**El primer y más simple caso de memorización rota son las props que se pasan desde otras props**. Especialmente cuando está involucrada la propagación de props en componentes intermedios. Imagina que tienes una cadena de componentes como esta:

```jsx
const Child = () => {};
const ChildMemo = React.memo(Child);

const Component = (props) => {
 return <ChildMemo {...props} />;
};

const ComponentInBetween = (props) => {
 return <Component {...props} />;
};

const InitialComponent = (props) => {
// Este componente tendrá estado y activará el re-renderizado de Component
 return (
 <ComponentInBetween {...props} data={{ id: '1' }} />
 );

```

¿Cuán probable crees que es que aquellos que necesitan agregar datos adicionales al InitialComponent revisarán cada uno de los componentes internos para ver si alguno de ellos está envuelto en React.memo? Nunca va a suceder.

**Pero como resultado, el InitialComponent rompe la memorización del componente ChildMemo, ya que pasa una prop de data no memorizada.**

https://codesandbox.io/s/happy-dream-vz9z22

Así que a menos que estés preparado y seas capaz de hacer cumplir la regla de que cada una de las prop en todas partes debe ser memoizada, el uso de la función **React.memo en componentes debe seguir ciertas reglas.**

**Regla 1: nunca hagas spread de las props que vengan de otros componentes.**
En lugar de esto:

```jsx
const Component = (props) => {
	return <ChildMemo {...props} />;
};
```

**tiene que ser algo explícito como esto:**

```jsx
const Componente = (props) => {
 return <ChildMemo some={prop.some} other={props.other} />;
};
```

**Regla 2: evita pasar props no primitivos que vengan de otros componentes.**
Incluso un ejemplo explícito como el anterior sigue siendo bastante frágil. Si cualquiera de de esos props son objetos o funciones no memoizados, la memoización se romperá de nuevo.

**Regla 3: evite pasar valores no primitivos que provengan de hooks personalizados.**
Esto parece casi contradictorio con la práctica generalmente aceptada de extraer lógica con estado en hooks personalizados. Pero su conveniencia es de doble filo: ocultan complejidades, pero también ocultan si los datos o las funciones tienen referencias estables.

Considera esto:

```jsx
const Componente = () => {
	const { submit } = useForm();
return <ChildMemo onChange={submit} />;
};
```

La función submit está oculta en el hook personalizado useForm. Y
cada hook personalizado se disparará en cada re-renderización. ¿Se puede saber del código anterior si es seguro pasar ese submit a nuestro ChildMemo?

No, no puedes. Y lo más probable es que se parezca a esto:

```jsx
const useForm = () => {
// montones y montones de código para controlar el estado del formulario
	const submit = () => {
// hacer algo al enviar, como validación de datos
};
return {
submit,
};
};
```

Por lo tanto, a menos que estés preparado y puedas hacer cumplir 

Al pasar esa función submit a nuestro ChildMemo , acabamos de romper su memoización - a partir de ahora, se volverá a renderizar como si no estuviera envuelto en React.memo .

https://codesandbox.io/s/ws4xq8?file=/App.tsx&utm_medium=sandpack

¿Ves lo frágil que es este patrón? Se pone peor.

# React.memo y children

Echemos un vistazo a este código:

```jsx
const ChildMemo = React.memo(Child);

const Component = () => {
  return (
    <ChildMemo>
      <div>Algún texto aquí</div>
    </ChildMemo>
  );
};

```

Parece lo suficientemente inocente: un componente memoizados sin props que renderiza algún div en su interior, ¿verdad? Bueno, l**a memoización está rota aquí otra vez, y el contenedor React.memo es completamente inútil.**

Recuerda lo que discutimos en el Capítulo 2. ¿***Elementos, hijos como props y re-renderizados***? **Esta bonita sintaxis anidada no es más que azúcar sintáctico para la prop children.** Puedo reescribir este código así:

```jsx
const Component = () => {
  return <ChildMemo children={<div>Algún texto aquí</div>} />;
};

```

**Y se comportará exactamente igual.** Y como cubrimos en el Capítulo 2. ***Elementos, hijos como props y re-renderizados***, todo lo que es J**SX es solo azúcar sintáctico para React.createElement y en realidad es simplemente un objeto**. En este caso, será un objeto con el tipo "div":

```jsx
{
  type: "div",
  ... // el resto
}

```

Así que **lo que tenemos aquí desde la perspectiva de la memoización y las props es un componente que está envuelto en React.memo y tiene una prop con un objeto no memoizado.**

Para solucionarlo, **necesitamos memoizar el div también:**

```jsx
const Component = () => {
  const content = useMemo(
    () => <div>Algún texto aquí</div>,
    [],
  );
  return <ChildMemo children={content} />;
};

```

O volver a la bonita sintaxis:

```jsx
const Component = () => {
  const content = useMemo(
    () => <div>Algún texto aquí</div>,
    [],
  );
  return <ChildMemo>{content}</ChildMemo>;
};

```

[**Enlace al ejemplo**](https://advanced-react.com/examples/05/05)

La misma historia se aplica a los hijos como una prop de renderizado, por cierto. Esto estará roto:

```jsx
const Component = () => {
  return (
    <ChildMemo>{() => <div>Algún texto aquí</div>}</ChildMemo>
  );
};

```

Nuestros hijos aquí son una función que se recrea en cada re-renderizado. También necesitamos memoizarlo con useMemo:

```jsx
const Component = () => {
  const content = useMemo(
    () => () => <div>Algún texto aquí</div>,
    [],
  );
  return <ChildMemo>{content}</ChildMemo>;
};

```

O simplemente usar useCallback:

```jsx
const Component = () => {
  const content = useCallback(
    () => <div>Algún texto aquí</div>,
    [],
  );
  return <ChildMemo>{content}</ChildMemo>;
};

```

https://codesandbox.io/s/clever-gagarin-2v8dxg

Echa un vistazo a tu aplicación ahora mismo. ¿Cuántos de estos han pasado desapercibidos?

# React.memo y hijos memoizados(casi)

Si has revisado tu aplicación, corregido todos esos patrones y te sientes seguro de que la memoización está en un buen estado ahora, no te apresures. ¡La vida nunca ha sido tan fácil! ¿Qué piensas de este caso? ¿Está bien o está roto?

```jsx
const ChildMemo = React.memo(Child);
const ParentMemo = React.memo(Parent);

const Component = () => {
  return (
    <ParentMemo>
      <ChildMemo />
    </ParentMemo>
  );
};

```

Ambos están memoizados, así que tiene que estar bien, ¿verdad? Incorrecto. ParentMemo se comportará como si no estuviera envuelto en React.memo, ¡sus hijos en realidad no están memoizados!

Echemos un vistazo más detenido a lo que está pasando. Como ya sabemos, l**os elementos son solo azúcar sintáctico para `React.createElement`, que devuelve un objeto con el tipo que apunta al componente.** Si estuviera creando un elemento `<Parent />`, sería así:

```jsx
{
  type: Parent,
  ... // el resto de cosas de React
}

```

Con componentes memoizados, es exactamente lo mismo. El elemento `<ParentMemo />` se convertirá en un objeto de una forma similar. Solo la propiedad "type" contendrá información sobre nuestro ParentMemo.

Y este objeto es solo un objeto, no está memoizado por sí mismo. Así que, nuevamente, desde la perspectiva de la memoización y las props, tenemos un componente ParentMemo que tiene una prop children que contiene un objeto no memoizado. Por lo tanto, la memoización está rota en ParentMemo.

Para arreglarlo, necesitamos memoizar el objeto mismo:

```jsx
const Component = () => {
  const child = useMemo(() => <ChildMemo />, []);
  return <ParentMemo>{child}</ParentMemo>;
};

```

Y luego podríamos incluso no necesitar ChildMemo en absoluto. Depende de su contenido y nuestras intenciones, por supuesto. Al menos con el propósito de evitar que ParentMemo se vuelva a renderizar, ChildMemo es innecesario y puede volver a ser simplemente un Child normal:

```jsx
const Component = () => {
  const child = useMemo(() => <Child />, []);
  return <ParentMemo>{child}</ParentMemo>;
};

```

Ejemplo interactivo y código completo

https://codesandbox.io/s/shy-shadow-97ldfr

# useMemo y cálculos costosos

Y el último, y bastante popular caso de uso relacionado con el rendimiento para `useMemo` es memoizar "cálculos costosos". Entre comillas, porque también suele usarse incorrectamente con bastante frecuencia.

Primero que todo, ¿qué es un "cálculo costoso"? ¿Es costosa la concatenación de cadenas? ¿O el ordenar un array de 300 elementos? ¿O ejecutar una expresión regular en un texto de 5000 palabras? No lo sé. Y tú tampoco. Y nadie lo sabe hasta que se mide:

- en un dispositivo que sea representativo de tu base de usuarios
- en contexto
- en comparación con el resto de las cosas que están sucediendo al mismo tiempo
- en comparación con cómo estaba antes o el estado ideal

Ordenar un array de 300 elementos en mi laptop, incluso con una CPU ralentizada 6 veces, toma menos de 2 ms. Pero en un viejo teléfono móvil con Android 2, podría tomar un segundo.

Ejecutar una expresión regular en un texto que tarda 100 ms parece lento. Pero si se ejecuta como resultado de un clic en un botón, una vez en mucho tiempo, enterrado en alguna parte profunda de la pantalla de configuración, entonces es casi instantáneo. Una expresión regular que tarda 30 ms en ejecutarse parece lo suficientemente rápida. Pero si se ejecuta en la página principal en cada movimiento del ratón o evento de desplazamiento, es imperdonablemente lento y necesita ser mejorado.

Siempre depende. "Medir primero" debería ser el pensamiento predeterminado cuando se siente el impulso de envolver algo en `useMemo` porque es un "cálculo costoso".

La segunda cosa en la que pensar es React. En particular, el renderizado de componentes en comparación con los cálculos de JavaScript puro. Es más probable que no, cualquier cosa que se calcule dentro de `useMemo` será un orden de magnitud más rápido que volver a renderizar elementos reales de todos modos. Por ejemplo, ordenar ese array de 300 elementos en mi portátil tomó menos de 2 ms. Volver a renderizar elementos de lista a partir de ese array, incluso cuando eran solo botones simples con algo de texto, tardó más de 20 ms. Si quiero mejorar el rendimiento de ese componente, lo mejor sería eliminar los re-renderizados innecesarios de todo, no memoizar algo que tarda menos de 2 ms.

Así que una adición a la regla de "medir primero", cuando se trata de memoización, debería ser: "no olvides medir cuánto tiempo toma volver a renderizar elementos del componente también". Y si envuelves cada cálculo de JavaScript en `useMemo` y ganas 10 ms con ello, pero el re-renderizado de componentes reales aún tarda casi 200 ms, entonces, ¿cuál es el punto? Todo lo que hace es complicar el código sin ninguna ganancia visible.

Y finalmente, `useMemo` solo es útil para re-renderizados. Ese es todo su propósito y cómo funciona. Si tu componente nunca se vuelve a renderizar, entonces `useMemo` simplemente no hace nada.

**Más que nada, obliga a React a hacer trabajo adicional en el renderizado inicial. No olvides: la primera vez que se ejecuta el hook `useMemo`, cuando el componente se monta por primera vez, React necesita almacenarlo en caché. Utilizará un poco de memoria y poder computacional para eso, que de lo contrario sería gratis. Con solo un `useMemo`, el impacto no será medible, por supuesto. Pero en aplicaciones grandes, con cientos de ellos esparcidos por todas partes, en realidad puede ralentizar mediblemente el renderizado inicial. Será una muerte por mil cortes al final.**

# Conclusiones clave

Bueno, eso es deprimente. ¿Significa todo esto que no deberíamos usar memoización? En absoluto. Puede ser una herramienta muy valiosa en nuestra batalla por el rendimiento. Pero considerando tantas advertencias y complejidades que lo rodean, recomendaría usar técnicas de optimización basadas en la composición tanto como sea posible primero. `React.memo` debería ser el último recurso cuando todas las demás cosas han fallado.

Y recordemos:

- React compara objetos/arrays/funciones por su referencia, no su valor. Esa comparación ocurre en las dependencias de los hooks y en las props de los componentes envueltos en `React.memo`.
- La función en línea pasada como argumento a `useMemo` o `useCallback` será recreada en cada re-renderizado.
- `useCallback` memoiza esa función en sí, `useMemo` memoiza el resultado de su ejecución.
- Memoizar props en un componente solo tiene sentido cuando:
    - Este componente está envuelto en `React.memo`.
    - Este componente usa esas props como dependencias en cualquiera de los hooks.
    - Este componente pasa esas props a otros componentes, y ellos tienen cualquiera de las situaciones anteriores.
- Si un componente está envuelto en `React.memo` y su re-renderizado es activado por su padre, entonces React no volverá a renderizar este componente si sus props no han cambiado. En cualquier otro caso, el re-renderizado procederá como de costumbre.
- Memoizar todas las props en un componente envuelto en `React.memo` es más difícil de lo que parece. Evita pasar valores no primitivos que provienen de otras props o hooks.
- Al memoizar props, recuerda que "children" también es una prop no primitiva que necesita ser memoizada.

