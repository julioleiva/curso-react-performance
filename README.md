# Elementos, hijos como props, y re-renderizados


- Cómo pasar componentes como props puede mejorar el rendimiento
de nuestras aplicaciones.
- Cómo exactamente React desencadena re-renderizados.
- Por qué los componentes como props no se ven afectados por los re-renderizados
- **Qué es un Elemento, cómo es diferente de un Componente y
por qué es importante conocer esa distinción**.
- Los conceptos básicos de la reconciliación de React y la comparación.


## Lecciones clave
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
    
     lo mismo que:
    
    ```jsx
    <Parent children={<Child />} />
    
    ```