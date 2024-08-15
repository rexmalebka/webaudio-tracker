import React, { useCallback, useContext, useMemo } from "react";
import TrackCmdComponent from "./TrackCmdComponent";

import TrackerPlayerContext, {
  TrackLine,
  TrackLineCmd,
} from "../../contexts/TrackerPlayerContext";

// S4 S$1 S+1 S2+4
// [cmd_name operandA]
// [cmd_name operation operandB ]
// [cmd_name operandA operation operandB ]
// [SRVPADE]
// \d|\$\d+

type TrackLineComponent = {
  index: number;
  trackIndex: number;
  select: () => void;
  selected: boolean;
  previous: () => void;
  next: () => void;
  played: boolean;
};

const TrackLineComponent: React.FC<TrackLineComponent> = ({
  select,
  selected,
  index,
  trackIndex,
  previous,
  next,
  played,
}) => {
  const { tracks, dispatch } = useContext(TrackerPlayerContext);
  const track = tracks[trackIndex];
  const trackLine = track.trackLines[index];

  const trackKeydownHandler = useCallback(
    (evt: React.KeyboardEvent<HTMLDivElement>) => {
      switch (evt.key) {
        case "Enter":
          return select();
        case "ArrowDown":
          return next();
        case "ArrowUp":
          return previous();
      }
    },
    [],
  );

  const codeBlocks = useMemo(() => {
    type PatternMatch = {
      cmd: string;
      operandA: string;
      operation: string;
      operandB: string;
    };

    const addCode = (cmds: PatternMatch[]) => {
      cmds.forEach((cmd) => {
        let param: keyof TrackLine | undefined;

        switch (cmd.cmd) {
          case "S":
            param = "sample";
            break;
          case "R":
            param = "pitch";
            break;
          case "V":
            param = "volume";
            break;
          case "P":
            param = "pan";
            break;
          case "A":
            param = "atk";
            break;
          case "D":
            param = "decay";
            break;
          case "E":
            param = "duration";
            break;
        }
        if (param == undefined) return;

        dispatch({
          type: "changeTrackLine",
          payload: {
            trackIndex,
            trackLineIndex: index,
            param,
            value: {
              operatorA: cmd.operandA as TrackLineCmd["operatorA"],
              operation: cmd.operation as TrackLineCmd["operation"],
              operatorB: cmd.operandB as TrackLineCmd["operatorB"],
            },
          },
        });
      });
    };

    return (
      [
        "sample",
        "pitch",
        "volume",
        "pan",
        "atk",
        "decay",
        "duration",
      ] as (keyof TrackLine)[]
    ).map((cmd) => (
      <TrackCmdComponent
        key={`trackLine-${index}-cmd-${cmd}`}
        cmd={cmd}
        trackIndex={trackIndex}
        trackLineIndex={index}
        addCode={addCode}
      />
    ));
  }, [trackIndex, index, trackLine]);

  return (
    <div
      className={`items-start-start flex w-full cursor-pointer ${selected ? "border border-gray-600" : ""} ${played ? "bg-green-600 bg-opacity-50" : ""} `}
      onClick={select}
      tabIndex={0}
    >
      <span className="w-10 font-mono text-sm font-light text-gray-500">
        {index}
      </span>

      <div className="flex flex-auto justify-around overflow-x-auto font-mono">
        {codeBlocks}
      </div>
    </div>
  );
};

export default TrackLineComponent;
