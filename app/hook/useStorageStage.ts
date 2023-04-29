// https://github.com/beenotung/react-use-storage-state/blob/master/src/use-storage-state.ts
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useState } from "react";

type Value<T> = T extends Function ? never : T;
type NonFunctionalValue = Value<any>;

const defaultSuffix = ":default";

type SetStorageEvent = StorageEvent & {
  sourceSetState: any;
};

export function useStorageState<T extends NonFunctionalValue>(
  key: string,
  initialState: T | (() => T),
  storageArea = localStorage
): [state: T, setState: Dispatch<SetStateAction<T>>] {
  const loadState = useCallback(
    function loadState(): T {
      const initialValue: T =
        typeof initialState === "function"
          ? (initialState as () => T)()
          : initialState;
      let initialText: string | null = null;
      try {
        initialText = JSON.stringify(initialValue);
      } catch (error) {
        console.error("failed to encode initial state:", error);
      }

      const defaultKey = key + defaultSuffix;
      let defaultText: string | null = null;
      try {
        defaultText = storageArea.getItem(defaultKey);
      } catch (error) {
        console.error("failed to load default state:", error);
      }

      if (initialText !== null && defaultText !== initialText) {
        try {
          storageArea.setItem(defaultKey, initialText);
          storageArea.setItem(key, initialText);
        } catch (error) {
          console.error("failed to store initial state:", error);
        }
        return initialValue;
      }

      let prevStateText: string | null = null;
      try {
        prevStateText = storageArea.getItem(key);
      } catch (error) {
        console.error("failed to load previous state:", error);
      }

      if (prevStateText === null) {
        return initialValue;
      }

      try {
        let prevValue = JSON.parse(prevStateText);
        return prevValue;
      } catch (error) {
        console.error("failed to decode previous state:", error);
        return initialValue;
      }
    },
    [storageArea, initialState, key]
  );

  const [state, setState] = useState(loadState);

  const applyUpdate = useCallback(
    function(newState: T): void {
      let text: string;
      try {
        text = JSON.stringify(newState);
      } catch (error) {
        console.error("failed to encode state:", error);
        return;
      }

      try {
        storageArea.setItem(key, text);
      } catch (error) {
        console.error("failed to save state:", error);
      }

      try {
        let event: SetStorageEvent;
        if (storageArea instanceof Storage) {
          event = Object.assign(
            new StorageEvent("storage", {
              key,
              storageArea,
              newValue: text
            }),
            { sourceSetState: setState }
          );
        } else {
          event = Object.assign(new Event("storage") as StorageEvent, {
            key,
            storageArea,
            newValue: text,
            sourceSetState: setState
          });
        }
        window.dispatchEvent(event);
      } catch (error) {
        console.error("failed to dispatch storage event:", error);
      }
    },
    [storageArea, key]
  );

  const saveState = useCallback(
    function saveState(newState: T | ((state: T) => T)) {
      if (typeof newState === "function") {
        setState((prevState) => {
          let newStateValue = (newState as (state: T) => T)(prevState);
          applyUpdate(newStateValue);
          return newStateValue;
        });
      } else {
        applyUpdate(newState);
        setState(newState);
      }
    },
    [applyUpdate]
  );

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (
        event.key === key &&
        event.storageArea === storageArea &&
        (event as SetStorageEvent).sourceSetState !== setState
      ) {
        setState(loadState());
      }
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key, loadState, storageArea]);

  return [state, saveState];
}

export default useStorageState;
