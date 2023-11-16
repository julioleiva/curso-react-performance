import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "./components/button";

export default function App() {
  const [state, setState] = useState(1);

  const submitNormal = () => {
    console.info("submit some data here - normal");
  };

  // useCallback es un hook que devuelve una versión memorizada de la función de callback,
  // que solo cambia si una de las dependencias ha cambiado.

  // El array de dependencias vacío ([]) significa que esta función se memoriza y solo se 
  // crea una vez durante el primer renderizado. No se volverá a crear en renderizados posteriores.
  const submitCallback = useCallback(() => {
    console.info("maneja lógica datos aquí- useCallback");
  }, []);

// useMemo es un hook que devuelve un valor memorizado. Aquí se usa para devolver una función memorizada.
// La función dentro de useMemo devuelve otra función que registra un mensaje en la consola.
// Al igual que con useCallback, debido al array de dependencias vacío, esta función se crea solo una vez
// durante el renderizado inicial.
  const submitMemo = useMemo(
    () => () => {
      console.info("maneja lógica datos aquí - useMemo");
    },
    []
  );

  // Este useEffect se ejecuta cada vez que submitNormal cambia. Sin embargo, submitNormal no es una función memorizada, por lo que es diferente en cada renderizado. 
  // Por lo tanto, este efecto se ejecuta en cada renderizado.
  useEffect(() => {
    console.info("Se activará cada vez que se vuelva a renderizar");
  }, [submitNormal]);

  // Este useEffect se ejecuta solo una vez cuando el componente se monta, porque submitCallback y submitMemo 
  // son funciones memorizadas y su referencia no cambia a lo largo de los renderizados.
  useEffect(() => {
    console.info("This will be triggered only on mounting");
  }, [submitCallback, submitMemo]);

  // La diferencia entre useCallback y useMemo es sutil: useCallback memoriza la función en sí, 
  // mientras que useMemo memoriza el resultado de la función (que también puede ser una función).

  return (
    <>
      Examples of a function non-memoized and memoized via useCallback or
      useMemo
      <br />
      <br />
      <Button onClick={() => setState(state + 1)}>
        Click to trigger re-render
      </Button>
      <br />
      <br />
      <Button onClick={submitNormal}>Click to trigger normal submit</Button>
      <Button onClick={submitCallback}>
        Click to trigger submit from useCallback
      </Button>
      <Button onClick={submitMemo}>Click to trigger submit from useMemo</Button>
    </>
  );
}
