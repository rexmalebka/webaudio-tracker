import { useEffect, useReducer, useState } from "react";
import "./App.css";
import SamplerComponent from "./components/samplerComponents";
import EditorComponent from "./components/editorComponent";
import VarsComponent from "./components/varsComponent";
import MidiComponent from "./components/midiComponent";

import AudioContextContext from "./contexts/AudioContextContext";
import TrackerPlayerContext from "./contexts/TrackerPlayerContext";

import TrackerPlayerDispatcher from "./contexts/TrackerPlayerReducer";
import ClockComponent from "./components/clock/clockComponent";

function TrackerPlayer() {
  const [state, dispatch] = useReducer(TrackerPlayerDispatcher, {
    bpm: 120,
    samples: [],
    tracks: [],
    vars: [],
    playing: false,
    beat: 0,
  });

  return (
    <TrackerPlayerContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      <ClockComponent />
      <div className="flex w-2/12 flex-col">
        <SamplerComponent />
        <VarsComponent />
      </div>

      <div className="flex w-10/12 flex-col border border-white">
        <div className="h-[70%]">
          <EditorComponent />
        </div>
        <div className="h-[30%] w-full">
          <MidiComponent />
        </div>
      </div>
    </TrackerPlayerContext.Provider>
  );
}

function App() {
  const [audioContext, set_audioContext] = useState<
    Promise<AudioContext> | undefined
  >();

  useEffect(() => {
    if (audioContext) return;

    const promise = new Promise<AudioContext>((res) => {
      const audioContextEventHandler = () => {
        const audioContext = new window.AudioContext();

        document.body.removeEventListener("click", audioContextEventHandler);
        res(audioContext);
      };

      document.body.addEventListener("click", audioContextEventHandler);
    }).then((context) => {
      return new Promise<AudioContext>((res) => {
        res(context);
      });
    });

    set_audioContext(() => promise);
  }, [audioContext]);

  return (
    <AudioContextContext.Provider value={audioContext}>
      <TrackerPlayer />
    </AudioContextContext.Provider>
  );
}

export default App;
