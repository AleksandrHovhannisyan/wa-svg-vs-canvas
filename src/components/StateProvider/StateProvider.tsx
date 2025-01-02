/* eslint-disable */
import * as React from 'react';
import { useLocation } from 'react-router';

export const StateContext = React.createContext({
  density: 30,
  sensitivity: 40,
  jitter: 0,
  enableRandomColors: false,
  useRequestAnimationFrame: false,
  setDensity: (_: number) => {},
  setSensitivity: (_: number) => {},
  setJitter: (_: number) => {},
  setEnableRandomColors: (_: boolean) => {},
  setUseRequestAnimationFrame: (_: boolean) => {},
});

function StateProvider({ children }: { children: React.ReactNode }) {
  const [density, setDensity] = React.useState(30);
  const [sensitivity, setSensitivity] = React.useState(40);
  const [jitter, setJitter] = React.useState(0);
  const [enableRandomColors, setEnableRandomColors] =
    React.useState(true);
  const [useRequestAnimationFrame, setUseRequestAnimationFrame] = React.useState(false);

  const location = useLocation();

  React.useEffect(() => {
    setDensity(30);
    setSensitivity(40);
    setJitter(0);
  }, [location]);

  return (
    <StateContext.Provider
      value={{
        density,
        sensitivity,
        jitter,
        useRequestAnimationFrame,
        enableRandomColors,
        setDensity,
        setSensitivity,
        setJitter,
        setEnableRandomColors,
        setUseRequestAnimationFrame,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

export default StateProvider;
