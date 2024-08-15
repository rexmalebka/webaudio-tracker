import { useCallback, useContext, useEffect, useRef, useState } from "react";
import TrackerPlayerContext from "../../contexts/TrackerPlayerContext";

const ClockComponent: React.FC = () => {
  const { playing, bpm, dispatch } = useContext(TrackerPlayerContext);
  const [startTime, setstartTime] = useState<number>(0);
  const reqRef = useRef<number>();

  120;
  const animate = useCallback(() => {
    reqRef.current = requestAnimationFrame(animate);

    dispatch({
      type: "setBeat",
      payload: {
        beat: Math.floor((performance.now() - startTime) / ((1000 * 60) / bpm)),
      },
    });
  }, [startTime, bpm]);

  useEffect(() => {
    if (playing) {
      setstartTime(performance.now());
      dispatch({
        type: "setBeat",
        payload: {
          beat: 0,
        },
      });
      reqRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (!reqRef.current) return;
      cancelAnimationFrame(reqRef.current);
    };
  }, [playing, bpm]);

  return <></>;
};

export default ClockComponent;
