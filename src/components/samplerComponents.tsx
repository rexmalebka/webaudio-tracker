import React, { useCallback, useContext, useMemo, useState } from "react";
import SampleComponent from "./sampler/sampleComponent";

import AudioContextContext from "../contexts/AudioContextContext";
import TrackerPlayerContext from "../contexts/TrackerPlayerContext";
import type { Sample } from "../contexts/TrackerPlayerContext";

const SamplerComponent: React.FC = () => {
  const context = useContext(AudioContextContext);
  const { samples, dispatch } = useContext(TrackerPlayerContext);

  const [playing, set_playing] = useState(false);

  const [audioNode, set_audioNode] = useState<AudioBufferSourceNode>();

  const [selected_sample, set_selected_sample] = useState<number>(0);

  const stopSample = useCallback(() => {
    if (
      !playing ||
      !context ||
      !samples ||
      !samples[selected_sample] ||
      !audioNode
    )
      return;

    audioNode.stop();
    set_playing(false);
  }, [playing, context, samples, selected_sample]);

  const previewSample = useCallback(() => {
    if (
      !context ||
      !samples ||
      !samples[selected_sample] ||
      !samples[selected_sample].loaded
    )
      return;

    const sample = samples[selected_sample];
    (async () => {
      const audioContext = await context;
      const source = audioContext.createBufferSource();
      source.buffer = await sample.buffer;
      source.connect(audioContext.destination);
      source.start(0, sample.start, sample.duration);

      source.addEventListener('ended', ()=>{
        set_playing(false)
      })
      set_audioNode(source);
      set_playing(true);
    })();
  }, [context, samples, selected_sample]);

  const addSamples = useCallback(() => {
    if (!context) return;

    (async function () {
      await context;
      const filesHandlers = await window.showOpenFilePicker({
        id: "samplesPicker",
        startIn: "music",
        types: [
          {
            description: "audio samples",
            accept: {
              "audio/*": [".aac", ".wav", ".mp3", ".wav"],
            },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: true,
      });

      const sampleList: Sample[] = [];

      for (const filehandler of filesHandlers.values()) {
        const file = await filehandler.getFile();

        const index = sampleList.length;
        if (file.type.startsWith("audio")) {
          const name = file.name;

          const sample = {
            name,
            loaded: false,
            playing: false,
            buffer: new Promise<AudioBuffer>((res) => {
              file.arrayBuffer().then((buffer) => {
                context.then((audioContext) => {
                  audioContext.decodeAudioData(buffer).then((decodedBuffer) => {
                    dispatch({
                      type: "setDurationSample",

                      payload: {
                        index,
                        duration: decodedBuffer.duration,
                      },
                    });
                    res(decodedBuffer);
                  });
                });
              });
            }),
            start: 0,
            duration: 0,
          };

          sampleList.push(sample);
        }
      }

      dispatch({
        type: "addSamples",
        payload: {
          samples: sampleList,
        },
      });
    })();
  }, [context]);

  const sampleBlocks = useMemo(() => {
    return samples.map((sample, i) => (
      <SampleComponent
        key={`${sample.name}-${i}`}
        selected={selected_sample == i}
        select={() => set_selected_sample(i)}
        setLoaded={() => {
          dispatch({
            type: "setLoadedSample",
            payload: {
              index: i,
            },
          });
        }}
        index={i}
      />
    ));
  }, [samples, selected_sample]);

  const buttonBlocks = useMemo(() => {
    if (!samples[selected_sample] || !samples[selected_sample].loaded)
      return <></>;

    return (
      <>
        {playing ? (
          <button
            onClick={() => {
              stopSample();
            }}
            
          >
            stop
          </button>
        ) : (
          <button
            onClick={() => {
              previewSample();
            }}
           
          >
            preview
          </button>
        )}

        <button
          onClick={() => {
            let jumpToZero = false;
            if (selected_sample == samples.length - 1) jumpToZero = true;

            dispatch({
              type: "removeSample",
              payload: {
                index: selected_sample,
              },
            });
            if (jumpToZero) set_selected_sample(0);
          }}
          className="w-4/12"
        >
          remove
        </button>
      </>
    );
  }, [playing, addSamples, samples, selected_sample]);

  const SampleConfigBlock = useMemo(() => {
    if (!samples[selected_sample] || !samples[selected_sample].loaded)
      return <></>;

    return (
      <div className="flex flex-row flex-wrap border p-2 justify-evenly">
        {buttonBlocks}

        <label htmlFor="" className="w-6/12">
          start
        </label>

        <input
          type="number"
          min={0}
          step={0.01}
          className="w-24 border bg-black text-center text-sm text-white"
          onBlur={(e) => {
            dispatch({
              type: "setStartSample",
              payload: {
                index: selected_sample,
                start: Number((e.target as HTMLInputElement).value),
              },
            });
          }}
          onKeyDown={(e) => {
            e.key == "Enter" && true;
            // set_trackNumber(Number((e.target as HTMLInputElement).value))}

            dispatch({
              type: "setStartSample",
              payload: {
                index: selected_sample,
                start: Number((e.target as HTMLInputElement).value),
              },
            });
          }}
          defaultValue={samples[selected_sample].start}
        />

        <label htmlFor="" className="w-6/12">
          duration
        </label>

        <input
          type="number"
          min={0}
          step={0.01}
          className="w-24 border bg-black text-center text-sm text-white"
          onBlur={(e) => {
            dispatch({
              type: "setDurationSample",
              payload: {
                index: selected_sample,
                duration: Number((e.target as HTMLInputElement).value),
              },
            });
          }}
          onKeyDown={(e) => {
            e.key == "Enter" && true;
            dispatch({
              type: "setDurationSample",
              payload: {
                index: selected_sample,
                duration: Number((e.target as HTMLInputElement).value),
              },
            });
          }}
          defaultValue={samples[selected_sample].duration.toFixed(2)}
        />
      </div>
    );
  }, [samples, selected_sample, buttonBlocks]);

  return (
    <div className="flex h-[50%] flex-col border border-white p-4">
      <span className="mx-auto table text-center text-lg font-bold">
        samples
      </span>
      <div className="flex justify-stretch gap-2">
        <button onClick={addSamples} className="w-4/12">
          load
        </button>
      </div>

      <div className="flex min-h-11 flex-auto flex-col overflow-auto border">
        {sampleBlocks}
      </div>

      {SampleConfigBlock}
    </div>
  );
};

export default SamplerComponent;
