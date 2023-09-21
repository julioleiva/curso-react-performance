## Mejora del rendimiento de las listas

Además de las reglas y patrones regulares de re-renders, el atributo key puede afectar al rendimiento de las listas en React.

Importante: sólo proporcionando el atributo key no mejorará el rendimiento de las listas. Para prevenir re-renders de elementos de lista necesitas envolverlos en React.memo y seguir todas sus mejores prácticas.

El valor en key debe ser una cadena, que sea consistente entre re-renders para cada elemento de la lista. Típicamente, el id del elemento o el índice del array se usan para eso.

Está bien utilizar el índice de la matriz como clave, si la lista es estática, es decir, los elementos no son añadidos/eliminados/insertados/reordenados.

Usar el índice del array en listas dinámicas puede llevar a:

- errores si los elementos tienen estado o elementos no controlados (como entradas de formularios)
- rendimiento afectado si los elementos están envueltos en React.memo
