import { useEffect, useState, useRef } from "react";
import { DspDefinition, DspDefinitionOffline, isDspOffline } from "./types";

import { compile } from "mosfez-faust/faust";
import { playBuffer } from "mosfez-faust/play";
import {
  toFloat32AudioArray,
  toAudioBuffer,
  toAudioArray,
} from "mosfez-faust/convert";
import { fetchFile } from "./fetch";

function logChannels(
  arr: Float32Array[] | number[][],
  log: (msg: unknown) => void
) {
  arr.forEach((channel) => log(Array.from(channel)));
}

export type Output = {
  name: string;
  output: Float32Array[];
  expected?: Float32Array[];
  passed: boolean;
};

const cache = new Map<DspDefinitionOffline, Output[]>();

export async function faustOfflineRender(
  dspDefinition: DspDefinitionOffline
): Promise<Output[]> {
  const resultFromCache = cache.get(dspDefinition);
  if (resultFromCache) return resultFromCache;

  const {
    outputLength,
    sampleRate,
    channels,
    dsp,
    inputFile,
    output = ["process"],
    expect,
  } = dspDefinition;

  let { input = [] } = dspDefinition;

  const result = await Promise.all(
    output.map(async (name) => {
      let dspToCompile = dsp;
      if (name !== "process") {
        const lines = dsp.split("\n");
        const foundIndex = lines.findIndex((line) =>
          line.startsWith(`${name} `)
        );
        dspToCompile = [
          ...lines.slice(0, foundIndex + 1),
          `process = ${name};`,
        ].join("\n");
      }

      const outputLengthFromInput = input[0]?.length ?? 0;

      const offlineContext = new OfflineAudioContext(
        channels,
        outputLength ?? outputLengthFromInput,
        sampleRate
      );

      if (inputFile) {
        const response = await fetchFile(inputFile);
        if (!response.ok) {
          throw new Error(`Could not load sound file "${input}"`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await toAudioBuffer(arrayBuffer, offlineContext);

        input = toAudioArray(audioBuffer);
      }

      console.log("input:");
      logChannels(input ?? [], console.log);

      const node = await compile(offlineContext, dspToCompile);

      if (input.length === 0) {
        node.connect(offlineContext.destination);
      } else {
        playBuffer(await toAudioBuffer(input, offlineContext), offlineContext);
      }

      const renderedBuffer = await offlineContext.startRendering();
      const output = toFloat32AudioArray(renderedBuffer);

      const expected = expect ? toFloat32AudioArray(expect[name]) : undefined;

      let passed = true;
      if (expect) {
        passed = JSON.stringify(output) === JSON.stringify(expected);
      }

      node.destroy();

      return {
        name,
        output,
        expected,
        passed,
      };
    }, Promise.resolve({}))
  );

  cache.set(dspDefinition, result);
  return result;
}

export function useFaustOfflineRenderer(
  dspDefinition: DspDefinition
): Output[] | undefined {
  const [output, setOutput] = useState<Output[] | undefined>(undefined);
  const isStartedRef = useRef(false);

  useEffect(() => {
    if (isStartedRef.current || !isDspOffline(dspDefinition)) return;
    isStartedRef.current = true;

    faustOfflineRender(dspDefinition).then((output) => {
      output.forEach((item) => {
        console.log(`${item.name}:`);
        logChannels(item.output, console.log);

        if (item.expected && !item.passed) {
          console.warn("incorrect output - expected:");
          logChannels(item.expected, console.warn);
        }
      });

      setOutput(output);
    });
  }, [dspDefinition]);

  return output;
}
