import { useContext, useEffect, useMemo, useState } from "react";
import TrackLineComponent from "./TrackLineComponent";
import TrackerPlayerContext from "../../contexts/TrackerPlayerContext";

const TrackComponent: React.FC<{ index: number }> = ({ index }) => {
  const { tracks, dispatch, playing, beat } = useContext(TrackerPlayerContext);
  const { name, step } = tracks[index];

  const track = tracks[index];
  const [lineNumber, set_lineNumber] = useState(1);
  const [selectedLine, set_selectedLine] = useState(0);

  const [playedLine, set_playedLine] = useState<number>();

  useEffect(() => {
    if (!playing || track.muted) return;

    const index = (beat * step) % track.trackLines.length;
    set_playedLine(index);
  }, [beat, playing, track.muted, track.step, track.trackLines.length]);

  useEffect(() => {
    if (track.trackLines.length == lineNumber) return;

    if (track.trackLines.length < lineNumber) {
      dispatch({
        type: "addTrackLine",
        payload: {
          trackIndex: index,
          number: lineNumber - track.trackLines.length,
        },
      });
    } else {
      dispatch({
        type: "removeTrackLine",
        payload: {
          trackIndex: index,
          number: track.trackLines.length - lineNumber,
        },
      });
    }
  }, [track, lineNumber]);

  const trackLineBlocks = useMemo(() => {
    return track.trackLines.map((_, trackLineIndex) => {
      const select = () => {
        set_selectedLine(trackLineIndex);
      };

      const previous = () => {
        if (trackLineIndex == 0) {
          set_selectedLine(track.trackLines.length - 1);
          return;
        }
        set_selectedLine(trackLineIndex - 1);
      };

      const next = () => {
        if (trackLineIndex == track.trackLines.length - 1) {
          set_selectedLine(0);
          return;
        }
        set_selectedLine(trackLineIndex + 1);
      };

      let played = !track.muted && playing && trackLineIndex == playedLine;

      return (
        <TrackLineComponent
          trackIndex={index}
          index={trackLineIndex}
          key={`trackline-${trackLineIndex}`}
          selected={selectedLine == trackLineIndex}
          select={select}
          previous={previous}
          next={next}
          played={played}
        ></TrackLineComponent>
      );
    });
  }, [tracks, index, selectedLine, playedLine, playing, track.muted]);

  const muteBlock = useMemo(() => {
    return (
      <button
        onClick={() => {
          dispatch({
            type: "setTrackToggleMuted",
            payload: {
              index,
            },
          });
        }}
      >
        {!track.muted ? "mute" : "unmute"}
      </button>
    );
  }, [track.muted, index]);

  return (
    <div className="flex max-h-full w-72 flex-col items-center justify-center gap-1 border p-2">
      <div className="itiems-center flex justify-center gap-2">
        <input
          type="text"
          className="w-32 border bg-black text-center text-sm text-white"
          onBlur={(evt) =>
            dispatch({
              type: "setTrackName",
              payload: {
                index,
                name: evt.target.value,
              },
            })
          }
          onKeyDown={(evt) =>
            evt.key == "Enter" &&
            dispatch({
              type: "setTrackName",
              payload: {
                index,
                name: (evt.target as HTMLInputElement).value,
              },
            })
          }
          defaultValue={name}
        />
        {muteBlock}
      </div>

      <div className="flex items-center justify-center gap-2">
        <label htmlFor="" className="">
          lines
        </label>
        <input
          type="number"
          min={1}
          step={1}
          max={100}
          className="texremoveTrackLinet-center w-11 border bg-black text-sm text-white"
          onBlur={(e) => set_lineNumber(Number(e.target.value))}
          onKeyDown={(e) =>
            e.key == "Enter" &&
            set_lineNumber(Number((e.target as HTMLInputElement).value))
          }
          defaultValue={lineNumber}
        />

        <label htmlFor="" className="">
          step
        </label>
        <input
          type="number"
          min={1}
          step={1}
          className="w-11 border bg-black text-center text-sm text-white"
          onBlur={(e) => {
            dispatch({
              type: "setTrackStep",
              payload: {
                index,
                step: Number(e.target.value),
              },
            });
          }}
          onKeyDown={(e) =>
            e.key == "Enter" &&
            dispatch({
              type: "setTrackStep",
              payload: {
                index,
                step: Number((e.target as HTMLInputElement).value),
              },
            })
          }
          defaultValue={step}
        />
      </div>

      <div className="flex h-full w-full flex-col self-start overflow-auto">
        {trackLineBlocks}
      </div>
    </div>
  );
};

export default TrackComponent;
