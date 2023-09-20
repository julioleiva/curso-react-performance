import React from "react";


export const useResizeDetector = () => {
    const [, setWidth] = React.useState(0);
  
    React.useEffect(() => {
      const listener = () => {
        setWidth(window.outerWidth);
      };
  
      window.addEventListener('resize', listener);
  
      return () => window.removeEventListener('resize', listener);
    }, []);
  
    return null;
  };