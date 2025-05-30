import {useCallback, useRef} from "react";

export const useDebounce = ({cb, delay}) => {
  const timer = useRef(null);
  return useCallback(
    (arg) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        cb(arg);
      }, delay);
    },
    [timer, cb, delay],
  );
};
