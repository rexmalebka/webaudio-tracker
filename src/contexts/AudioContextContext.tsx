import { createContext } from "react";

type AudioContextContext = Promise<AudioContext> | undefined;

const AudioContextContext = createContext<AudioContextContext>(undefined);

export default AudioContextContext;
