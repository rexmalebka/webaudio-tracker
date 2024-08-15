import { TrackerPlayerContext } from "../TrackerPlayerContext";

export type TrackerActionTypes =
  | {
      type: "changeBpm";
      payload: Parameters<typeof changeBpm>[1];
    }
  | {
      type: "togglePlaying";
    }
  | {
      type: "setBeat";
      payload: Parameters<typeof setBeat>[1];
    };

export function changeBpm(
  state: TrackerPlayerContext,
  { bpm }: { bpm: number },
) {
  return {
    ...state,
    bpm,
  };
}

export function togglePlaying(state: TrackerPlayerContext) {
  return {
    ...state,
    playing: !state.playing,
  };
}

export function setBeat(
  state: TrackerPlayerContext,
  { beat }: { beat: number },
) {
  return {
    ...state,
    beat: beat,
  };
}
