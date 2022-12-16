export interface FPSOptions {
    meter?: boolean;
    side?: string;
    FPS?: number;
    tolerance?: number;
    meterWidth?: number;
    meterHeight?: number;
    meterLineHeight?: number;
    styles?: Partial<CSSStyleDeclaration>;
    stylesFPS?: Partial<CSSStyleDeclaration>;
    stylesMeter?: Partial<CSSStyleDeclaration>;
    text?: string;
    colorGreen?: Color;
    colorOrange?: Color;
    colorRed?: Color;
    zIndex?: number;
}
export declare const defaultFPSOptions: FPSOptions;
/** Use #FFFFFF format for colors to ensure proper mixing of colors */
export type Color = string;
export declare class FPS {
    options: FPSOptions;
    div: HTMLDivElement;
    private lastTime;
    private frameNumber;
    private lastFPS;
    private meterCanvas;
    private meterContext;
    private fpsSpan;
    /**
     * @param [options]
     * @param [options.meter=true] - include a meter with the FPS
     * @param [options.side=bottom-right] - include any combination of left/right and top/bottom
     * @param [options.FPS=60] - desired FPS
     * @param [options.tolerance=1] - minimum tolerance for fluctuations in FPS number
     * @param [options.meterWidth=100] - width of meter div
     * @param [options.meterHeight=25] - height of meter div
     * @param [options.meterLineHeight=4] - height of meter line
     * @param [options.styles] - CSS styles to apply to the div (in javascript format)
     * @param [options.stylesFPS] - CSS styles to apply to the FPS text (in javascript format)
     * @param [options.stylesMeter] - CSS styles to apply to the FPS meter (in javascript format)
     * @param [options.text=" FPS"] - change the text to the right of the FPS
     * @param [options.colorGreen=#ffa500] green (good) color on meter
     * @param [options.colorRed = #ff0000] red (bad) color on meter
     * @param [options.zIndex = 1000] zIndex to assign to div
     */
    constructor(options?: FPSOptions);
    /** desired FPS */
    get fps(): number;
    set fps(value: number);
    /** remove meter from DOM */
    remove(): void;
    /** meter (the FPS graph) is on or off */
    get meter(): boolean;
    set meter(value: boolean);
    private style;
    private createDivFPS;
    private createDivMeter;
    /** call this at the end of the frame to calculate FPS */
    frame(): void;
    /**
     * From https://github.com/bgrins/TinyColor#readme
     * Mix two RGP colors
     * @param color1 - first color
     * @param color2 - second color
     * @param percent - percent to mix
     */
    private mix;
    private meterUpdate;
    /**
     * find the parent div for one of the corners
     * @param side side to place the panel (combination of right/left and bottom/top)
     * @return {HTMLElement}
     */
    private findParent;
}
