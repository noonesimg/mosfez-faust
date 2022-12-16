declare const ready: Promise<undefined>;
declare const internalFaustWrapper: any;
declare type UIItemGroup = {
    type: "hgroup" | "vgroup" | "tgroup";
    items: UIItem[];
    label: string;
};
declare type UIItemNumber = {
    type: "hslider" | "vslider" | "nentry";
    address: string;
    index: number;
    init: number;
    label: string;
    max: number;
    min: number;
    step: number;
};
declare type UIItemBoolean = {
    type: "button" | "checkbox";
    address: string;
    index: number;
    label: string;
};
declare type UIItemBarGraph = {
    type: "vbargraph" | "hbargraph";
    address: string;
    index: number;
    label: string;
    max: number;
    min: number;
};
declare type UIItem = UIItemGroup | UIItemNumber | UIItemBoolean | UIItemBarGraph;
declare function isUItemGroup(item: UIItem): item is UIItemGroup;
declare function isUItemNumber(item: UIItem): item is UIItemNumber;
declare function isUItemBoolean(item: UIItem): item is UIItemBoolean;
declare function isUItemBarGraph(item: UIItem): item is UIItemBarGraph;
declare type OutputParamHandler = (path: string, value: number) => void;
declare type FaustNode = AudioNode & {
    init: () => void;
    getJSON: () => string;
    setParamValue: (path: string, val: number) => void;
    setParamValueAtTime: (path: string, val: number, time: number) => void;
    getRawParam: (path: string) => AudioParam | undefined;
    getParamValue: (path: string) => number;
    getNumInputs: () => number;
    getNumOutputs: () => number;
    getParams: () => string[];
    getMeta: () => {
        [id: string]: string;
    };
    destroy: () => void;
    ui: UIItem[];
    getOutputValue: (path: string) => number;
};
declare function compile(audioContext: AudioContext | OfflineAudioContext, dsp: string): Promise<FaustNode>;

export { FaustNode, OutputParamHandler, UIItem, UIItemBarGraph, UIItemBoolean, UIItemGroup, UIItemNumber, compile, internalFaustWrapper, isUItemBarGraph, isUItemBoolean, isUItemGroup, isUItemNumber, ready };
