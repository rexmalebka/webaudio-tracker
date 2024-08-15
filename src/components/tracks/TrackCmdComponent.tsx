import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import TrackerPlayerContext, {
  TrackLine,
} from "../../contexts/TrackerPlayerContext";

type PatternMatch = {
  cmd: string;
  operandA: string;
  operation: string;
  operandB: string;
};

type TrackCmdComponent = {
  cmd: keyof TrackLine;
  trackIndex: number;
  trackLineIndex: number;
  addCode: (code: PatternMatch[]) => void;
};

const TrackCmdComponent: React.FC<TrackCmdComponent> = ({
  cmd,
  trackIndex,
  trackLineIndex,
  addCode,
}) => {
  const { tracks, samples } = useContext(TrackerPlayerContext);
  const track = tracks[trackIndex];
  const trackLine = track.trackLines[trackLineIndex];
  const trackcmd = trackLine[cmd];

  const [editable, set_editable] = useState(false);

  const input_ref = useRef<HTMLInputElement>(null);

  useEffect(
    function focusOnEdit() {
      if (!input_ref.current || !editable) return;

      input_ref.current.focus();
    },
    [input_ref, editable],
  );

  const parseCode = useCallback((code: string) => {
    const input = code.toUpperCase();
    type PatternMatch = {
      cmd_name: string;
      operandA: string;
      operation: string;
      operandB: string;
    };

    const pattern =
      /(?<cmd>(?<cmd_name>[SRVPADE])(?<operandA>\d+|\$\d+)?(?<operation>[+*\/%<>-])?(?<operandB>\d+|\$\d+)?)/gm;
    let matches = [...input.matchAll(pattern)]
      .map((match) => ({
        cmd: (match.groups as PatternMatch).cmd_name,
        operandA: (match.groups as PatternMatch).operandA,
        operation: (match.groups as PatternMatch).operation,
        operandB: (match.groups as PatternMatch).operandB,
      }))
      .filter(({ operandA, operation, operandB }) => {
        const validations = new Set([
          [false, true, true].toString(),
          [true, false, false].toString(),
          [false, false, false].toString(),
        ]);

        return validations.has(
          [operandA, operation, operandB].map((x) => x == null).toString(),
        );
      });

      matches = matches.filter(({ cmd, operandA, operandB, operation }) => {
      if (cmd == "S") {
        console.debug( operandA && !operandB && !operation , samples[Number(operandA)])
        return operandA && !operandB && !operation && samples[Number(operandA)]
      }
      return true;
    });

    if (matches.length == 0) return;
    addCode(matches);
  }, [samples]);

  const inputBlock = useMemo(() => {
    return (
      <input
        type="text"
        ref={input_ref}
        className={`w-6 bg-black outline-none focus:border-0 ${editable ? "" : "hidden"}`}
        onBlur={(e) => {
          parseCode(e.target.value);
          set_editable(false);
          (e.target as HTMLInputElement).value = "";
        }}
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            parseCode((e.target as HTMLInputElement).value);
            set_editable(false);
            (e.target as HTMLInputElement).value = "";
          }
        }}
      />
    );
  }, [parseCode, editable]);

  const cmdBlocks = useMemo(() => {
    if (!trackcmd) {
      return <>{!editable && <span className="text-yellow-500">..</span>}</>;
    }

    let param: "S" | "R" | "V" | "P" | "A" | "D" | "E";

    switch (cmd) {
      case "sample":
        param = "S";
        break;
      case "pitch":
        param = "R";
        break;
      case "volume":
        param = "V";
        break;
      case "pan":
        param = "P";
        break;
      case "atk":
        param = "A";
        break;
      case "decay":
        param = "D";
        break;
      case "duration":
        param = "E";
        break;
    }

    return (
      <>
        <span className="text-yellow-500">{param}</span>
        {trackcmd.operatorA && (
          <span
            className={
              trackcmd.operatorA.startsWith("$")
                ? "text-lime-400"
                : "text-pink-500"
            }
          >
            {trackcmd.operatorA}
          </span>
        )}
        {trackcmd.operation && (
          <span className="text-fuchsia-600">{trackcmd.operation}</span>
        )}
        {trackcmd.operatorB && (
          <span
            className={
              trackcmd.operatorB.startsWith("$")
                ? "text-lime-400"
                : "text-pink-500"
            }
          >
            {trackcmd.operatorB}
          </span>
        )}
      </>
    );
  }, [cmd, trackcmd, inputBlock, editable]);

  return (
    <div className="pr-1 text-sm" onClick={() => set_editable(true)}>
      {inputBlock}
      {cmdBlocks}
    </div>
  );
};

export default TrackCmdComponent;
