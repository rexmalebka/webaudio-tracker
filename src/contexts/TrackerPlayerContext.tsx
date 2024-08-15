import { createContext } from "react";
import { actionTypes } from "./TrackerPlayerReducer";

export type Var = {
  operatorA: `${number}` | variable;
  operation: operation;
  operatorB: `${number}` | variable;  
}

export type Sample = {
  name: string;
  buffer: Promise<AudioBuffer>;
  playing: boolean;
  loaded: boolean;
  start: number,
  duration:number
};

type variable = `$${number}`;
type operation = "+" | "-" | "*" | "/" | "%";

export type TrackLineCmd = {
  operatorA: `${number}` | variable;
  operation: operation;
  operatorB: `${number}` | variable;
};

export type TrackLine = {
  sample?: TrackLineCmd;
  pitch?: TrackLineCmd;
  volume?: TrackLineCmd;
  pan?: TrackLineCmd;
  atk?: TrackLineCmd;
  decay?: TrackLineCmd;
  duration?: TrackLineCmd;
};

export type Track = {
  name: string;
  step: number;
  trackLines: TrackLine[];
  muted: boolean;
};

export type TrackerPlayerContext = {
  bpm: number;
  samples: Sample[];
  tracks: Track[];
  vars: number[];
  playing: boolean;
  beat: number;
};

export default createContext<
  TrackerPlayerContext & { dispatch: React.Dispatch<actionTypes> }
>({
  bpm: 120,
  samples: [],
  tracks: [],
  vars: [],
  playing: false,
  beat: 0,
  dispatch: () => {},
});
