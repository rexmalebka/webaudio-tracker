import { useContext, useEffect, useMemo, useState } from "react";
import TrackComponent from "./tracks/TrackComponent";
import TrackerPlayerContext from "../contexts/TrackerPlayerContext";

const EditorComponent = () => {
  const { bpm, tracks, playing, dispatch } = useContext(TrackerPlayerContext);
  const [trackNumber, set_trackNumber] = useState(2);

  useEffect(() => {
    if (tracks.length == trackNumber) return;

    console.debug(tracks.length, trackNumber, " == ?");

    if (tracks.length < trackNumber) {
      console.debug("adding");
      dispatch({
        type: "addTrack",
        payload: { number: trackNumber - tracks.length },
      });
    } else {
      dispatch({
        type: "removeTrack",
        payload: {
          number: tracks.length - trackNumber,
        },
      });
    }
  }, [tracks, trackNumber]);

  const trackBlocks = useMemo(() => {
    return tracks.map((track, i) => (
      <TrackComponent index={i} key={`track-${i}`} />
    ));
  }, [tracks]);

  return (
    <div className="flex h-full flex-col border border-white p-2">
      <span className="mx-auto table text-center text-lg font-bold">
        Editor
      </span>
      <div className="flex items-center justify-center gap-2">
        <label htmlFor="">tracks</label>
        <input
          type="number"
          min={1}
          step={1}
          className="w-11 border bg-black text-center text-sm text-white"
          onBlur={(e) => set_trackNumber(Number(e.target.value))}
          onKeyDown={(e) =>
            e.key == "Enter" &&
            set_trackNumber(Number((e.target as HTMLInputElement).value))
          }
          defaultValue={trackNumber}
        />

        <label htmlFor="">bpm</label>
        <input
          type="number"
          className="w-11 border bg-black text-center text-sm text-white"
          defaultValue={bpm}
          onBlur={(e) =>
            dispatch({
              type: "changeBpm",
              payload: {
                bpm: Number(e.target.value),
              },
            })
          }
          onKeyDown={(e) =>
            e.key == "Enter" &&
            dispatch({
              type: "changeBpm",
              payload: {
                bpm: Number((e.target as HTMLInputElement).value),
              },
            })
          }
        />
        <button
          onClick={() => {
            dispatch({
              type: "togglePlaying",
            });
          }}
        >
          {playing ? "stop" : "play"}
        </button>
      </div>

      <div className="m-0 flex h-full min-h-11 w-full flex-row items-start overflow-x-auto border p-2">
        {trackBlocks}
      </div>
    </div>
  );
};

export default EditorComponent;
