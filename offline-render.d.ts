declare type AudioArray = number[][];
declare type Float32AudioArray = Float32Array[];

declare type OfflineRenderParams = {
    functionString?: string;
    channels: number;
    sampleRate: number;
    length?: number;
    input?: AudioArray | Float32AudioArray | AudioBuffer;
    props?: Record<string, unknown>;
};
declare function offlineRender(params: OfflineRenderParams): Promise<Float32AudioArray>;

export { OfflineRenderParams, offlineRender };
