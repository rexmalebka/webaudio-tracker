import { useContext, useEffect, useMemo } from "react";
import { ImSpinner8 } from "react-icons/im";

import AudioContextContext from "../../contexts/AudioContextContext";
import TrackerPlayerContext from "../../contexts/TrackerPlayerContext";

type SampleComponent = {
  selected: boolean;
  select: () => void;
  setLoaded: () => void;
  index: number;
};

const SampleComponent: React.FC<SampleComponent> = ({
  select,
  selected,
  setLoaded,
  index,
}) => {
  const context = useContext(AudioContextContext);
  const { samples } = useContext(TrackerPlayerContext);

  const sample = samples[index];
  const { name, buffer, loaded } = sample;

  useEffect(
    function waitTillLoaded() {
      if (!context || !buffer) return;

      (async () => {
        await context;
        await buffer;

        setLoaded();
      })();
    },
    [context, buffer],
  );

  const containerBaseClass: React.HTMLAttributes<HTMLDivElement>["className"] = `flex items-start justify-center gap-2 p-2 cursor-pointer`;
  const labelBaseClass = `flex-auto`;

  const sampleBlock = useMemo(() => {
    return (
      <div
        className={`${containerBaseClass} m-2 text-sm font-light ${selected ? "border border-gray-600" : ""}`}
        onClick={select}
      >
        <span className="mt-0 text-sm font-light text-gray-500">{index}</span>
        {loaded ? null : <ImSpinner8 className="mt-0 min-w-5 animate-spin" />}

        <span className={labelBaseClass}>{name}</span>
      </div>
    );
  }, [containerBaseClass, name, index, select, loaded, selected]);



  return (
    <>
      {sampleBlock}
    </>
  );
};

export default SampleComponent;
