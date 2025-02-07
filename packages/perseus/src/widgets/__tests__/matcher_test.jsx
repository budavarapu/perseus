// @flow

import getRenderA11yString from "katex/dist/contrib/render-a11y-string.js";
import * as React from "react";
import "@testing-library/jest-dom";

import {testDependencies} from "../../../../../testing/test-dependencies.js";
import {wait} from "../../../../../testing/wait.js";
import * as Dependencies from "../../dependencies.js";
import {question1} from "../__testdata__/matcher_testdata.js";

import {renderQuestion} from "./renderQuestion.jsx";

import type {APIOptions} from "../../types.js";
import type {Matcher} from "enzyme-matchers/lib/types/Matcher";

describe("matcher widget", () => {
    beforeEach(() => {
        /*
        Sortable misbehaves and sets state after the component has been
        unmounted. This is existing behavior and its safer to leave the existing
        implementation and swallow the warning in tests.
        */
        jest.spyOn(console, "warn").mockImplementation(() => {});
        jest.spyOn(console, "error").mockImplementation(() => {});

        jest.useRealTimers();

        jest.spyOn(Dependencies, "getDependencies").mockReturnValue({
            ...testDependencies,
            getKaTeX: () => {
                return Promise.resolve({});
            },
            TeX: ({children}: {|children: React.Node|}) => (
                <span className="tex-mock">{children}</span>
            ),
            getRenderA11yString: Promise.resolve(getRenderA11yString),
            shouldUseFutureKaTeX: (flag: boolean) => {},
        });
    });

    it("should snapshot", async () => {
        // Arrange
        const apiOptions: APIOptions = {
            isMobile: false,
        };

        // Act
        const {container} = renderQuestion(question1, apiOptions);
        await wait();

        // Assert
        expect(container).toMatchSnapshot("first render");
    });

    it("should snapshot on mobile", async () => {
        // Arrange
        jest.useRealTimers();

        const apiOptions: APIOptions = {
            isMobile: true,
        };

        // Act
        const {container} = renderQuestion(question1, apiOptions);
        await wait();

        // Assert
        expect(container).toMatchSnapshot("first mobile render");
    });

    it("can reorder options", async () => {
        // Arrange
        const apiOptions: APIOptions = {
            isMobile: false,
        };
        const {container, renderer} = renderQuestion(question1, apiOptions);
        await wait();

        // Act
        const matcher: Matcher = renderer.findWidgets("matcher 1")[0];

        // $FlowFixMe[prop-missing]
        matcher.moveRightOptionToIndex(
            "Rapid escalation of greenhouse gas emissions",
            0,
        );

        // $FlowFixMe[prop-missing]
        matcher.moveLeftOptionToIndex(
            "Average global temperatures will rise ",
            0,
        );

        // Assert
        expect(container).toMatchSnapshot("moved items");
    });

    it("can be answered correctly", async () => {
        // Arrange
        const apiOptions: APIOptions = {
            isMobile: false,
        };
        const {renderer} = renderQuestion(question1, apiOptions);
        await wait();

        const matcher: Matcher = renderer.findWidgets("matcher 1")[0];

        // Put the right options in the correct order by repeatedly moving
        // answers to the end of the list
        [
            "Medium-sized stars typically exist for roughly 10 billion years",
            "The current trajectory of the Earth\u2019s tectonic plate movement",
            "The life cycle of medium-sized stars includes a red giant stage and ends in a whimper as a white dwarf",
            "Rapid escalation of greenhouse gas emissions",
            "The current trajectory of the Milky Way galaxy and those in its immediate proximity",
        ].forEach((option, index) => {
            // $FlowFixMe[prop-missing]
            matcher.moveRightOptionToIndex(option, 4);
        });

        // Act
        renderer.guessAndScore();

        // assert
        expect(renderer).toHaveBeenAnsweredCorrectly();
    });

    it("can be answered incorrectly", async () => {
        // Arrange
        const apiOptions: APIOptions = {
            isMobile: false,
        };
        const {renderer} = renderQuestion(question1, apiOptions);
        await wait();

        const matcher: Matcher = renderer.findWidgets("matcher 1")[0];

        // Put the left options in reverse order
        [
            "Our Sun will run out of fuel and die in around 5 billion years ",
            "Plate tectonics will rearrange the continents: the Pacific will narrow, bringing Australia closer to the Americas, and the Atlantic will expand to form the largest of the oceans ",
            "Our Sun will run out of hydrogen, swell into a red giant, gobble up the inner rocky planets, and then collapse and die ",
            "Average global temperatures will rise ",
            "In 3 to 4 billion years, our galaxy will begin a slow collision with its closest large neighbor, Andromeda ",
        ].forEach((option, index) => {
            // $FlowFixMe[prop-missing]
            matcher.moveLeftOptionToIndex(option, 0);
        });

        // Act
        renderer.guessAndScore();

        // Assert
        expect(renderer).toHaveBeenAnsweredIncorrectly();
    });
});
