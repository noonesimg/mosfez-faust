declare type AudioArray = number[][];
declare type Float32AudioArray = Float32Array[];
declare type AudioData = AudioArray | Float32Array[] | AudioBuffer | ArrayBuffer;
declare type AudioCtxOrSampleRate = AudioContext | OfflineAudioContext | number;
declare function isAudioArray(value: unknown): value is AudioArray;
declare function isFloat32AudioArray(value: unknown): value is Float32AudioArray;
declare function isAudioBuffer(value: unknown): value is AudioBuffer;
declare function isArrayBuffer(value: unknown): value is ArrayBuffer;
declare function toAudioArray(input: AudioArray | Float32AudioArray | AudioBuffer): AudioArray;
declare function toFloat32AudioArray(input: AudioArray | Float32AudioArray | AudioBuffer): Float32AudioArray;
declare function toAudioBuffer(input: AudioData, audioCtxOrSampleRate: AudioCtxOrSampleRate): Promise<AudioBuffer>;
declare function toArrayBuffer(input: AudioData, audioCtxOrSampleRate: AudioCtxOrSampleRate): Promise<ArrayBuffer>;
declare function toWavBlob(input: AudioData, audioCtxOrSampleRate: AudioCtxOrSampleRate): Promise<Blob>;
declare function downloadWav(input: AudioData, audioCtxOrSampleRate: AudioCtxOrSampleRate, name: string): Promise<void>;
declare function downloadBlob(blob: Blob, name: string): void;

export { AudioArray, AudioCtxOrSampleRate, AudioData, Float32AudioArray, downloadBlob, downloadWav, isArrayBuffer, isAudioArray, isAudioBuffer, isFloat32AudioArray, toArrayBuffer, toAudioArray, toAudioBuffer, toFloat32AudioArray, toWavBlob };
