// @flow
import basicWidgets from "./basic-widgets.js";
import extraWidgets from "./extra-widgets.js";
import * as Widgets from "./widgets.js";

declare var MathJax: any;

export type PerseusOptions = {|
    skipMathJax: boolean,
|};

/**
 * This should be called by all clients, specifying whether extra widgets are
 * needed via `loadExtraWidgets`. It is idempotent, so it's not a problem to
 * call it multiple times.
 *
 * skipMathJax:
 *   If false/undefined, MathJax will be configured, and the
 *   promise will wait for MathJax to load (if it hasn't already).
 */
const init = function (options: PerseusOptions): Promise<void> {
    Widgets.registerWidgets(basicWidgets);
    Widgets.registerWidgets(extraWidgets);

    // Pass skipMathJax: true if MathJax is already loaded and configured.
    const skipMathJax = options.skipMathJax;

    if (skipMathJax) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        MathJax.Hub.Config({
            messageStyle: "none",
            skipStartupTypeset: "none",
            "HTML-CSS": {
                availableFonts: ["TeX"],
                imageFont: null,
                scale: 100,
                showMathMenu: false,
            },
        });

        MathJax.Hub.Configured();
        MathJax.Hub.Queue(resolve);
    });
};

export default init;
