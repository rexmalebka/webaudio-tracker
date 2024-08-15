import { TrackerPlayerContext } from "./TrackerPlayerContext";
import {
  SampleActionTypes,
  addSamples,
  removeSample,
  setDurationSample,
  setLoadedSample,
  setStartSample,
} from "./actions/SampleActions";

import {
  addTrack,
  removeTrack,
  setTrackName,
  addTrackLine,
  removeTrackLine,
  setTrackStep,
  changeTrackLine,
  setTrackToggleMuted,
} from "./actions/TrackActions";

import { changeBpm, setBeat, togglePlaying } from "./actions/TrackerActions";

import { TrackActionTypes } from "./actions/TrackActions";
import { TrackerActionTypes } from "./actions/TrackerActions";

export type actionTypes =
  | SampleActionTypes
  | TrackActionTypes
  | TrackerActionTypes;

const TrackerPlayerDispatcher = (
  state: TrackerPlayerContext,
  action: actionTypes,
) => {
  switch (action.type) {
    case "changeBpm":
      return changeBpm(state, action.payload);
    case "togglePlaying":
      return togglePlaying(state);
    case "setBeat":
      return setBeat(state, action.payload);

    case "addSamples":
      return addSamples(state, action.payload);
    case "setDurationSample":
      return setDurationSample(state, action.payload);
    case 'setStartSample':
      return setStartSample(state, action.payload);
    case "removeSample":
      return removeSample(state, action.payload);
    case "setLoadedSample":
      return setLoadedSample(state, action.payload);

    case "addTrack":
      return addTrack(state, action.payload);
    case "removeTrack":
      return removeTrack(state, action.payload);
    case "setTrackName":
      return setTrackName(state, action.payload);
    case "setTrackStep":
      return setTrackStep(state, action.payload);
    case "setTrackToggleMuted":
      return setTrackToggleMuted(state, action.payload);
    case "addTrackLine":
      return addTrackLine(state, action.payload);
    case "removeTrackLine":
      return removeTrackLine(state, action.payload);
    case "changeTrackLine":
      return changeTrackLine(state, action.payload);
  }
  return state;
};

export default TrackerPlayerDispatcher;
