const styles = {
  containerMain: {
    textAlign: "center",
    backgroundColor: "#FFE5E5", 
    fontFamily:"Gill Sans, sans-serif",
    padding:'1rem'
  },
  containerHeader: {
    padding: "50px",
    backgroundColor: "#A8DF8E",
  },
  containerIndex: {
    textAlign: "left",
    padding: "50px",
    backgroundColor: "#F3FDE8",
  },
  header: {
    fontSize: "36px",
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: "24px",
  },
  button: {
    padding: "15px 30px",
    fontSize: "18px",
    backgroundColor: "#007bff",
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

const App = () => {
  return (
    <div style={styles.containerMain}>
      <div style={styles.containerHeader}>
        <h1 style={styles.header}>Taller de React Performance</h1>
        <p style={styles.subHeader}>
          Aprende a optimizar tus aplicaciones React
        </p>
        <p>Fecha: 21 de septiembre, 2023</p>
        <p>Lugar: Sala Virtual</p>
        <p>Instructor: Julio Leiva</p>
        <button style={styles.button}>
          <a
            style={styles.link}
            href="https://github.com/julioleiva/curso-react-performance"
          >
            Repo
          </a>
        </button>
      </div>
      <div style={styles.containerIndex}>
        <h2>Introducción a los re-renders</h2>
        <h2>Custom hooks y re-renders</h2>
        <h2>Custom hooks y Api Context</h2>
        <h2>Elementos, hijos como props y re-renders</h2>
        <h2>Problemas de configuración con elementos como</h2>
        <h2>Configuración avanzada con render props</h2>
        <h2>Memoización con useMemo, useCallback y React.memo</h2>
        <h2>Profundizando en diffing y reconciliation</h2>
      </div>
    </div>
  );
};

export default App;
