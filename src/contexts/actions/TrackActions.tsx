import {
  Track,
  TrackLine,
  TrackLineCmd,
  TrackerPlayerContext,
} from "../TrackerPlayerContext";

export type TrackActionTypes =
  | {
      type: "addTrack";
      payload: Parameters<typeof addTrack>[1];
    }
  | {
      type: "removeTrack";
      payload: Parameters<typeof removeTrack>[1];
    }
  | {
      type: "setTrackName";
      payload: Parameters<typeof setTrackName>[1];
    }
  | {
      type: "setTrackToggleMuted";
      payload: Parameters<typeof setTrackToggleMuted>[1];
    }
  | {
      type: "setTrackStep";
      payload: Parameters<typeof setTrackStep>[1];
    }
  | {
      type: "addTrackLine";
      payload: Parameters<typeof addTrackLine>[1];
    }
  | {
      type: "removeTrackLine";
      payload: Parameters<typeof removeTrackLine>[1];
    }
  | {
      type: "changeTrackLine";
      payload: Parameters<typeof changeTrackLine>[1];
    };

export function addTrack(
  state: TrackerPlayerContext,
  { number }: { number: number },
) {
  const tracks: Track[] = new Array(number).fill({
    name: `track-${state.tracks.length}`,
    step: 1,
    trackLines: [],
    muted: false,
  });

  console.debug("adding", number);
  return {
    ...state,
    tracks: [...state.tracks, ...tracks],
  };
}

export function removeTrack(
  state: TrackerPlayerContext,
  { number }: { number: number },
) {
  return {
    ...state,
    tracks: [...state.tracks.slice(0, -number)],
  };
}

export function setTrackToggleMuted(
  state: TrackerPlayerContext,
  { index }: { index: number },
) {
  console.debug("muting");
  return {
    ...state,
    tracks: [
      ...state.tracks.slice(0, index),
      {
        ...state.tracks[index],
        ...{ muted: !state.tracks[index].muted },
      },
      ...state.tracks.slice(index + 1),
    ],
  };
}

export function setTrackName(
  state: TrackerPlayerContext,
  { index, name }: { index: number; name: string },
) {
  return {
    ...state,
    tracks: [
      ...state.tracks.slice(0, index),
      {
        ...state.tracks[index],
        ...{ name: name },
      },
      ...state.tracks.slice(index + 1),
    ],
  };
}

export function setTrackStep(
  state: TrackerPlayerContext,
  { index, step }: { index: number; step: number },
) {
  const tracks = [...state.tracks];
  tracks[index].step = step;

  return {
    ...state,
    tracks: [...tracks],
  };
}

export function addTrackLine(
  state: TrackerPlayerContext,
  { trackIndex, number }: { trackIndex: number; number: number },
) {
  const tracks = [...state.tracks];
  const track = tracks[trackIndex];
  const trackLines: TrackLine[] = new Array(number).fill({});
  if (!track) return state;

  return {
    ...state,
    tracks: [
      ...tracks.slice(0, trackIndex),
      {
        ...track,
        trackLines: [...track.trackLines, ...trackLines],
      },
      ...tracks.slice(trackIndex + 1),
    ],
  };
}

export function removeTrackLine(
  state: TrackerPlayerContext,
  { trackIndex, number }: { trackIndex: number; number: number },
) {
  return {
    ...state,
    tracks: state.tracks.map((track, i) =>
      i == trackIndex
        ? { ...track, trackLines: [...track.trackLines.slice(0, -number)] }
        : track,
    ),
  };
}

export function changeTrackLine(
  state: TrackerPlayerContext,
  {
    trackIndex,
    trackLineIndex,
    param,
    value,
  }: {
    trackIndex: number;
    trackLineIndex: number;
    param: keyof TrackLine;
    value: TrackLineCmd;
  },
) {
  const tracks = [...state.tracks];
  const track = tracks[trackIndex];
  const trackLine = {
    ...track.trackLines[trackLineIndex],
    ...{
      [param]: value,
    },
  };

  return {
    ...state,
    ...{
      tracks: [
        ...state.tracks.slice(0, trackIndex),
        {
          ...state.tracks[trackIndex],
          ...{
            trackLines: [
              ...state.tracks[trackIndex].trackLines.slice(0, trackLineIndex),
              trackLine,
              ...state.tracks[trackIndex].trackLines.slice(trackLineIndex + 1),
            ],
          },
        },
        ...state.tracks.slice(trackIndex + 1),
      ],
    },
  };
}
