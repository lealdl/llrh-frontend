import { useEffect } from 'react';

const useAutoRefresh = (callback, events = []) => {
  useEffect(() => {
    // Registrar listener para cada evento
    events.forEach(eventName => {
      window.addEventListener(eventName, callback);
    });
    
    // Limpar listeners ao desmontar
    return () => {
      events.forEach(eventName => {
        window.removeEventListener(eventName, callback);
      });
    };
  }, [callback, events]);
};

export default useAutoRefresh;
