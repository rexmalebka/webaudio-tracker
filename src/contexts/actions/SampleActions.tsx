import { Sample, TrackerPlayerContext } from "../TrackerPlayerContext";

export type SampleActionTypes =
  | {
      type: "addSamples";
      payload: Parameters<typeof addSamples>[1];
    }
  | {
      type: "removeSample";
      payload: Parameters<typeof removeSample>[1];
    }
  | {
      type: "setLoadedSample";
      payload: Parameters<typeof setLoadedSample>[1];
    }
  | {
      type: "setPlayingSample";
      payload: Parameters<typeof setPlayingSample>[1];
    }
  | {
      type: "setDurationSample";
      payload: Parameters<typeof setDurationSample>[1];
    }
  | {
      type: "setStartSample";
      payload: Parameters<typeof setStartSample>[1];
    };

export function addSamples(
  state: TrackerPlayerContext,
  { samples }: { samples: Sample[] },
) {
  return {
    ...state,
    samples: [...state.samples, ...samples],
  };
}

export function removeSample(
  state: TrackerPlayerContext,
  { index }: { index: number },
) {
  return {
    ...state,
    samples: [
      ...state.samples.slice(0, index),
      ...state.samples.slice(index + 1),
    ],
  };
}

export function setDurationSample(
  state: TrackerPlayerContext,
  { index, duration }: { index: number; duration: number },
) {
  return {
    ...state,
    samples: [
      ...state.samples.map((sample, i) =>
        i == index
          ? {
              ...sample,
              duration,
            }
          : sample,
      ),
    ],
  };
}

export function setStartSample(
  state: TrackerPlayerContext,
  { index, start }: { index: number; start: number },
) {
  return {
    ...state,
    samples: [
      ...state.samples.map((sample, i) =>
        i == index
          ? {
              ...sample,
              start,
            }
          : sample,
      ),
    ],
  };
}

export function setLoadedSample(
  state: TrackerPlayerContext,
  { index }: { index: number },
) {
  const samples = [...state.samples];
  samples[index].loaded = true;

  return {
    ...state,
    samples: [...samples],
  };
}

export function setPlayingSample(
  state: TrackerPlayerContext,
  { index, playing }: { index: number; playing: boolean },
) {
  const samples = [...state.samples];
  samples[index].playing = playing;

  return {
    ...state,
    samples: [...samples],
  };
}
