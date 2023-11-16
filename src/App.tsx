import {IconBrandReact} from '@tabler/icons-react'
import { Icons } from './icons/icons';


const styles = {
  containerMain: {
    textAlign: "center",
    backgroundColor: "#F3FDE8",
    fontFamily: "Gill Sans, sans-serif",
    padding: "1rem",
    borderRadius:'1rem'
  },
  containerHeader: {
    padding: "50px",
    backgroundColor: "#A8DF8E",
    borderRadius:'1rem'
  },
  containerIndex: {
    textAlign: "left",
    padding: "50px",
  },
  header: {
    fontSize: "45px",
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: "24px",
  },

 topicList: {
  fontSize: '24px',
  marginBottom: '1rem'
 },

  button: {
    padding: "15px 30px",
    fontSize: "18px",
    backgroundColor: "purple",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  link: {
    textDecoration: "none",
    color: "white",
  },
};

const topics: string[] = [
  "Introducción a los re-renders",
  "Patrones de composición 1: 'Moviendo el estado hacia abajo'",
  "Patrones de composición 2: 'Pasar componentes como props'",
  "Patrones de composición 3: 'Usar children como props'",
  "Memorización con useMemo, useCallback y React.memo",
  "Custom hooks y re-renders",
  "Listas y re-renders"
];


const App = () => {
  return (
    <div style={styles.containerMain}>
      <div style={styles.containerHeader}>
        <h1 style={styles.header}>  <IconBrandReact color='purple' size={48}/>Taller de React Performance <IconBrandReact color='purple' size={48}/> </h1>
        <p style={styles.subHeader}>
          Aprende a optimizar tus aplicaciones evitando re-renders innecesarios
        </p>
        <p>Fechas: 9 y 16 de noviembre de 2023 </p>
        <p>
          Julio Leiva Díaz{"  "}
        </p>
        <p>
          <Icons/>
        </p>
        <button style={styles.button}>
          <a
            style={styles.link}
            href="https://github.com/julioleiva/curso-react-performance"
          >
            GitHub Repo {">>>"}
          </a>
        </button>
      </div>
      <div style={styles.containerIndex}>
        <ol>
          {topics.map((topic) => {
            return <li key={topic} style={styles.topicList}>{topic}</li>
          })}
        </ol>
      </div>
    </div>
  );
};

export default App;
