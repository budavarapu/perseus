// @flow

import * as React from "react";

import type {WidgetExports, WidgetProps} from "../types.js";

type PerseusMockWidgetOptions = {||};
type RenderProps = PerseusMockWidgetOptions;
type Rubric = PerseusMockWidgetOptions;
type Props = WidgetProps<RenderProps, Rubric>;

const transform = (
    widgetOptions: PerseusMockWidgetOptions,
    problemNum: ?number,
): RenderProps => widgetOptions;

// A mock widget. To use it, set it up in a PerseusJson blob. Then once the
// widget has been rendered, you can retrieve it from the renderer and attach
// jest.fn()'s to any functions you need.
export class MockWidget extends React.Component<Props> {
    render(): React.Element<"div"> {
        return <div className="mock_widget" />;
    }
}

export default ({
    name: "mock-widget",
    displayName: "A mock widget used for testing",
    accessible: true,
    widget: MockWidget,
    transform: transform,
    staticTransform: transform,
    version: {major: 0, minor: 0},
    isLintable: true,
}: WidgetExports<typeof MockWidget>);
