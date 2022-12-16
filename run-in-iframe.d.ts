declare type RunInIframeConfig = {
    functionString: string;
    params: unknown;
    transferrables?: Transferable[];
};
declare type RunInIframeInnerResult = [unknown] | [unknown, Transferable[]];
declare function runInIframe(options: RunInIframeConfig): Promise<unknown>;

export { RunInIframeConfig, RunInIframeInnerResult, runInIframe };
