# Guía de re-renders de React: a cascoporro

Cuando hablamos del rendimiento en React, hay dos etapas principales que debemos tener en cuenta:

- **Renderizado inicial**: ocurre cuando un componente aparece por primera vez en la pantalla.
- **Re-renderizado**: segundo y cualquier renderizado consecutivo de un componente que ya está en la pantalla.

El re-renderizado ocurre cuando React necesita actualizar la aplicación con nuevos datos. Por lo general, esto sucede como resultado de una interacción del usuario con la aplicación o de la llegada de datos externos a través de una solicitud asíncrona o algún modelo de suscripción.

Las aplicaciones no interactivas que no tienen actualizaciones de datos asíncronas nunca se volverán a renderizar, y por lo tanto, no necesitan preocuparse por la optimización del rendimiento de los re-renderizados.

### 🧐 ¿Qué es un re-renderizado necesario e innecesario?

- **Re-renderizado necesario:** re-renderizado de un componente que es la fuente de los cambios, o un componente que utiliza directamente la nueva información. Por ejemplo, si un usuario escribe en un campo de entrada, el componente que gestiona su estado necesita actualizarse en cada pulsación de tecla, es decir, re-renderizarse.
- **Re-renderizado innecesario**: re-renderizado de un componente que se propaga a través de la aplicación mediante diferentes mecanismos de re-renderizado debido a un error o a una arquitectura de aplicación ineficiente. Por ejemplo, si un usuario escribe en un campo de entrada y toda la página se vuelve a renderizar en cada pulsación de tecla, la página se ha re-renderizado innecesariamente.

Los re-renderizados innecesarios por sí mismos no son un problema: React es muy rápido y generalmente puede manejarlos sin que los usuarios noten nada.

Sin embargo, si los re-renderizados ocurren con demasiada frecuencia y/o en componentes muy pesados, esto podría llevar a que la experiencia del usuario parezca "lenta", con retrasos visibles en cada interacción, o incluso que la aplicación se vuelva completamente irresponsiva.

---

# ¿Cuándo se re-renderiza un componente de React?

Hay cuatro razones por las que un componente se volvería a renderizar: cambios de estado, re-renderizados del padre (o hijos), cambios de contexto y cambios en hooks. También hay un gran mito: que los re-renderizados ocurren cuando cambian las props del componente. De por sí, esto no es cierto (ver la explicación más abajo).

### 🧐 Razón de re-renderizado: cambios de estado

Cuando cambia el estado de un componente, este se volverá a renderizar. Por lo general, esto sucede en un callback o en el hook useEffect.

Los cambios de estado son la "raíz" de todos los re-renderizados.

![State Changes](https://www.developerway.com/assets/react-re-renders-guide/part2-state-changes-example.png)


### 🧐 Razón de re-renderizado: re-renderizados del padre

Un componente se volverá a renderizar si su padre se vuelve a renderizar. O, si lo vemos desde la dirección opuesta: cuando un componente se vuelve a renderizar, también se vuelven a renderizar todos sus hijos.

Siempre va "hacia abajo" en el árbol: el re-renderizado de un hijo no dispara el re-renderizado de un padre.

![Parent re-renders](https://www.developerway.com/assets/react-re-renders-guide/part2-parent-example.png)

### 🧐 Razón de re-renderizado: cambios de contexto

Cuando el valor en un Proveedor de Contexto cambia, todos los componentes que usan este Contexto se volverán a renderizar, incluso si no usan directamente la porción de datos que cambió.

![Context changes](https://www.developerway.com/assets/react-re-renders-guide/part2-context-example.png)


### 🧐 Razón de re-renderizado: cambios en hooks

Todo lo que sucede dentro de un hook "pertenece" al componente que lo utiliza. Las mismas reglas con respecto a los cambios de Contexto y Estado se aplican aquí:

- Un cambio de estado dentro del hook desencadenará un re-renderizado inevitable del componente "anfitrión".
- Si el hook utiliza Contexto y el valor del Contexto cambia, desencadenará un re-renderizado inevitable del componente "anfitrión".

![hooks changes](https://www.developerway.com/assets/react-re-renders-guide/part2-hooks-example.png)

### ⛔️ Razón de re-renderizado: cambios en props (el gran mito)

No importa si cambian o no las props del componente cuando hablamos de re-renderizados de componentes no memoizados.

Para que las props cambien, deben ser actualizadas por el componente padre. Esto significa que el padre tendría que volver a renderizarse, lo que desencadenará el re-renderizado del componente hijo independientemente de sus props.

![myth props changes](https://www.developerway.com/assets/react-re-renders-guide/part2-props-myth.png)

---

## Previniendo re-renderizados con composición

### ⛔️ Antipatrón: Crear componentes en la función de renderizado

Crear componentes dentro de la función de renderizado de otro componente es un antipatrón que puede ser el mayor asesino del rendimiento. En cada re-renderizado, React volverá a montar este componente (es decir, lo destruirá y lo recreará desde cero), lo cual será mucho más lento que un re-renderizado normal. Además, esto llevará a errores como:

- Posibles "parpadeos" de contenido durante los re-renderizados.
- El estado del componente se reinicia en cada re-renderizado.
- useEffect sin dependencias se activa en cada re-renderizado.
- Si un componente estaba enfocado, perderá el enfoque.

![⛔️ Antipattern: Creating components in render function](https://www.developerway.com/assets/react-re-renders-guide/part3-creating-components.png)

### ✅ Previniendo re-renderizados con composición: moviendo el estado hacia abajo

Este patrón puede ser beneficioso cuando un componente pesado gestiona el estado, y este estado solo se utiliza en una pequeña porción aislada del árbol de renderizado. Un ejemplo típico sería abrir/cerrar un diálogo con un clic de botón en un componente complicado que renderiza una parte significativa de una página.

En este caso, el estado que controla la aparición del diálogo modal, el diálogo en sí y el botón que desencadena la actualización pueden encapsularse en un componente más pequeño. Como resultado, el componente más grande no se volverá a renderizar con esos cambios de estado.

![moving state down](https://www.developerway.com/assets/react-re-renders-guide/part3-moving-state-down.png)

### **✅ Previniendo re-renderizados con composición: hijos como props**

Este patrón también se puede llamar "envolver el estado alrededor de los hijos". Es similar a "mover el estado hacia abajo": encapsula los cambios de estado en un componente más pequeño. La diferencia aquí es que el estado se utiliza en un elemento que envuelve una porción lenta del árbol de renderizado, por lo que no se puede extraer tan fácilmente. Un ejemplo típico sería callbacks como onScroll o onMouseMove adjuntos al elemento raíz de un componente.

En esta situación, la gestión del estado y los componentes que utilizan ese estado pueden extraerse en un componente más pequeño, y el componente lento se puede pasar como hijos. Desde la perspectiva del componente más pequeño, los hijos son solo una prop, por lo que no se verán afectados por el cambio de estado y, por lo tanto, no se volverán a renderizar.

![children as props](https://www.developerway.com/assets/react-re-renders-guide/part3-passing-as-children.png)

---

### ✅ Previniendo re-renderizados con composición: componentes como props

Es bastante similar al patrón anterior, con el mismo comportamiento: encapsula el estado dentro de un componente más pequeño, y los componentes pesados se pasan como props. Las props no se ven afectadas por el cambio de estado, por lo que los componentes pesados no se volverán a renderizar.

Puede ser útil cuando varios componentes pesados son independientes del estado, pero no pueden extraerse como hijos en grupo.

![components as props](https://www.developerway.com/assets/react-re-renders-guide/part3-passing-as-props.png)

## Previniendo re-renderizados con React.memo

Envolver un componente en React.memo detendrá la cadena descendente de re-renderizados que se activa en algún lugar más arriba en el árbol de renderizado, a menos que las props de este componente hayan cambiado.

Esto puede ser útil cuando se renderiza un componente pesado que no depende de la fuente de los re-renderizados (es decir, estado, datos cambiados).

![React.memo](https://www.developerway.com/assets/react-re-renders-guide/part4-memo-normal-example.png)

### ✅ React.memo: componente con props

Todas las props que no son valores primitivos deben ser memoizadas para que React.memo funcione.

![React.memo: component with props](https://www.developerway.com/assets/react-re-renders-guide/part4-memo-with-props.png)

### ✅ React.memo: componentes como props o hijos

React.memo debe aplicarse a los elementos pasados como hijos/props. Memoizar el componente padre no funcionará: los hijos y las props serán objetos, por lo que cambiarán con cada re-renderizado.

![React.memo: components as props or children](https://www.developerway.com/assets/react-re-renders-guide/part4-memo-as-props.png)

## Mejorando el rendimiento de re-renderizados con useMemo/useCallback

### ⛔️ Antipatrón: useMemo/useCallback innecesarios en props

Memoizar las props por sí mismas no evitará los re-renderizados de un componente hijo. Si un componente padre se vuelve a renderizar, desencadenará el re-renderizado de un componente hijo independientemente de sus props.

![Antipattern: unnecessary useMemo/useCallback on props](https://www.developerway.com/assets/react-re-renders-guide/part5-unnecessary-usememo-on-props.png)

### ✅ useMemo/useCallback necesarios

Si un componente hijo está envuelto en React.memo, todas las props que no son valores primitivos deben ser memoizadas.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/08528b1c-483d-4a15-9da4-2536624430c2/885ffc63-8b34-458c-8abe-a9dee4cb7bd2/Untitled.png)

Si un componente utiliza un valor no primitivo como una dependencia en hooks como useEffect, useMemo, useCallback, debe ser memoizado.
 

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/08528b1c-483d-4a15-9da4-2536624430c2/5bba969d-5183-4886-8e33-b6fbda4950dd/Untitled.png)

### ✅ useMemo para cálculos costosos

Uno de los casos de uso para useMemo es evitar cálculos costosos en cada re-renderizado. useMemo tiene su costo (consume un poco de memoria y hace que el renderizado inicial sea un poco más lento), por lo que no debería usarse para cada cálculo. En React, montar y actualizar componentes será el cálculo más costoso en la mayoría de los casos (a menos que realmente estés calculando números primos, lo cual no deberías hacer en el frontend de todos modos).

Como resultado, el caso de uso típico para useMemo sería memoizar elementos de React. Por lo general, partes de un árbol de renderizado existente o resultados de un árbol de renderizado generado, como una función de mapeo que devuelve nuevos elementos.

El costo de operaciones de JavaScript "puras" como ordenar o filtrar una matriz suele ser insignificante en comparación con las actualizaciones de componentes.

## Mejorando el rendimiento de re-renderizado de listas

Además de las reglas y patrones de re-renderizados regulares, el atributo key puede afectar el rendimiento de las listas en React.

Importante: simplemente proporcionar el atributo key no mejorará el rendimiento de las listas. Para evitar re-renderizados de elementos de la lista, debes envolverlos en React.memo y seguir todas sus mejores prácticas.

El valor en key debe ser una cadena que sea consistente entre re-renderizados para cada elemento de la lista. Típicamente, se utiliza el id del elemento o el índice del array para ello.

Es aceptable usar el índice del array como key si la lista es estática, es decir, los elementos no se agregan/eliminan/insertan/reordenan.

Usar el índice del array en listas dinámicas puede llevar a:

- Errores si los elementos tienen estado o cualquier elemento no controlado (como entradas de formulario).
- Rendimiento degradado si los elementos están envueltos en React.memo.

![re-render lists performance](https://www.developerway.com/assets/react-re-renders-guide/part6-lists-example.png)

⛔️ Antipatrón: valor aleatorio como key en listas

Los valores generados aleatoriamente nunca deben usarse como valores en el atributo key en listas. Esto llevará a que React vuelva a montar los elementos en cada re-renderizado, lo que resultará en:

- Muy mal rendimiento de la lista.
- Errores si los elementos tienen estado o cualquier elemento no controlado (como entradas de formulario).

![antipattern-random-value-as-key](https://www.developerway.com/assets/react-re-renders-guide/part6-lists-antipattern.png)

## Previniendo re-renderizados causados por Contexto

✅ Previniendo re-renderizados de Contexto: memoizando el valor del Proveedor

Si el Proveedor de Contexto no está ubicado en la raíz misma de la aplicación, y hay una posibilidad de que se vuelva a renderizar debido a cambios en sus antecesores, su valor debe ser memoizado.

![memoizing Provider value](https://www.developerway.com/assets/react-re-renders-guide/part7-context-provider-memo.png)

✅ Previniendo re-renderizados de Contexto: dividiendo datos y API

Si en el Contexto hay una combinación de datos y API (obtenedores y establecedores), pueden dividirse en diferentes Proveedores bajo el mismo componente. De esa manera, los componentes que solo usan la API no se volverán a renderizar cuando cambien los datos.

![splitting data and API](https://www.developerway.com/assets/react-re-renders-guide/part7-context-split-api.png)

✅ Previniendo re-renderizados de Contexto: dividiendo datos en fragmentos

Si el Contexto gestiona varios fragmentos de datos independientes, pueden dividirse en proveedores más pequeños bajo el mismo proveedor. De esa manera, solo los consumidores del fragmento de datos cambiado se volverán a renderizar.

![splitting data into chunks](https://www.developerway.com/assets/react-re-renders-guide/part7-context-split-data.png)

✅ Previniendo re-renderizados de Contexto: selectores de Contexto

No hay forma de evitar que un componente que usa una porción del valor del Contexto se vuelva a renderizar, incluso si la porción de datos utilizada no ha cambiado, incluso con el hook useMemo.

Sin embargo, los selectores de Contexto podrían simularse con el uso de componentes de orden superior y React.memo.

![context selectors](https://www.developerway.com/assets/react-re-renders-guide/part7-context-selectors.png)

