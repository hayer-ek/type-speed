import React, { Component } from "react";
import "./style.scss";
import ru from "../../languages/ru";
import en from "../../languages/en";
import { Language } from "../../interfaces";
import checkKeyboad from "../../utils/checkKeyboard";

interface Props {
    language: Language;
    timer: number;
}

interface State {
    words: string[];
    start: boolean;
    testWords: null | string[][];
}

export default class SpeedTest extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            words: (() => {
                if (props.language === "ru") {
                    return ru.split(" ");
                }
                if (props.language === "en") {
                    return en.split(" ");
                }
                return en.split(" ");
            })(),
            start: false,
            testWords: null,
        };
    }

    startTest = () => {
        let text: string[][] = [];
        let wordIndex: number = 0;
        let letterIndex: number = 0;

        const countOfAllWords = 300 * this.props.timer;

        for (let i = 0; i < countOfAllWords; i++) {
            text.push([
                ...this.state.words[
                    Math.floor(Math.random() * this.state.words.length)
                ].split(""),
                " ",
            ]);
        }
        const container = document.querySelector(
            ".speedTest .tester-container .tester"
        );
        let row = document.createElement("div");
        row.setAttribute("class", "row");
        row.setAttribute("id", "0");
        let lettersInRow: number = 0;
        let rowIndex: number = 0;

        text.forEach((textWord, index) => {
            const word = document.createElement("div");
            textWord.forEach((letter, index) => {
                let span = document.createElement("span");
                span.textContent = letter;
                span.setAttribute("class", "letter");
                span.setAttribute("id", String(index));
                word.appendChild(span);
            });
            word.setAttribute("class", "text");
            word.setAttribute("id", String(index));
            lettersInRow += textWord.length;
            if (lettersInRow < 45) {
                row.appendChild(word);
            } else {
                container?.appendChild(row);
                lettersInRow = 0;
                rowIndex++;
                row = document.createElement("div");
                row.setAttribute("class", "row");
                row.setAttribute("id", String(rowIndex));
            }
        });
        container?.appendChild(row);
        rowIndex = 0;

        this.setState((state) => ({
            ...state,
            testWords: [...(state.testWords || []), ...text],
        }));

        let controlIsActive = false;

        function backspace() {
            if (letterIndex === 0) {
                if (wordIndex === 0) {
                    if (rowIndex === 0) return;
                    let row = document.querySelector(
                        `.speedTest .tester-container .active`
                    )?.children[rowIndex];
                    let word = row?.children[wordIndex];
                    word?.setAttribute("class", "text");
                    rowIndex--;

                    row = document.querySelector(
                        `.speedTest .tester-container .active`
                    )?.children[rowIndex];
                    word = row?.children[wordIndex];
                    word?.setAttribute("class", "text");
                    wordIndex = (row?.children.length || 1) - 1;
                    word = row?.children[wordIndex];

                    word?.setAttribute("class", "text active");
                    letterIndex = (word?.children.length || 1) - 1;
                    const letter = word?.children[letterIndex];
                    letter?.setAttribute("class", "letter");

                    const container = document.querySelector(
                        `.speedTest .tester-container .active`
                    );
                    (container as any).style.top = `-${59 * (rowIndex - 1)}px`;

                    return;
                }
                let word = document.querySelector(
                    `.speedTest .tester-container .active`
                )?.children[rowIndex].children[wordIndex];
                word?.setAttribute("class", "text");

                wordIndex--;
                word = document.querySelector(
                    `.speedTest .tester-container .active`
                )?.children[rowIndex].children[wordIndex];
                word?.setAttribute("class", "text active");
                letterIndex = (word?.children.length || 1) - 1;
                const letter = word?.children[letterIndex];
                letter?.setAttribute("class", "letter");
                return;
            }
            letterIndex--;
            const row = document.querySelector(
                `.speedTest .tester-container .active`
            )?.children[rowIndex];
            const word = row?.children[wordIndex];
            word?.setAttribute("class", "text active");
            const letter = word?.children[letterIndex];
            letter?.setAttribute("class", "letter");
            return;
        }

        function checkControlDown(event: KeyboardEvent) {
            if (event.key === "Backspace" && controlIsActive) {
                if (letterIndex === 0) {
                    backspace();
                }
                while (letterIndex > 0) {
                    document
                        .querySelector(`.speedTest .tester-container .active`)
                        ?.children[rowIndex].children[wordIndex].children[
                            letterIndex
                        ].setAttribute("class", "letter");
                    letterIndex--;
                }
                document
                    .querySelector(`.speedTest .tester-container .active`)
                    ?.children[rowIndex].children[wordIndex].children[
                        letterIndex
                    ].setAttribute("class", "letter");
            }
        }

        function checkControlUp(event: KeyboardEvent) {
            if (event.key === "Control") {
                controlIsActive = false;
                document.removeEventListener("keydown", checkControlDown);
                document.removeEventListener("keyup", checkControlUp);
                return;
            }
        }

        const keyboardInput = (event: KeyboardEvent) => {
            let key = event.key;
            const row = document.querySelector(
                `.speedTest .tester-container .active`
            )?.children[rowIndex];
            if (!row) {
                document.removeEventListener("keydown", keyboardInput);
                document.removeEventListener("mousedown", checkPage);
                return;
            }
            if (
                controlIsActive ||
                (!checkKeyboad(event, this.props.language) &&
                    key !== " " &&
                    key !== "Backspace" &&
                    key !== "Control")
            )
                return;

            if (key === "Control") {
                controlIsActive = true;
                document.addEventListener("keydown", checkControlDown);
                document.addEventListener("keyup", checkControlUp);
                return;
            }

            if (key === "Backspace") {
                backspace();
                return;
            }
            const word = row?.children[wordIndex];
            word?.setAttribute("class", "text active");
            const letter = word?.children[letterIndex];

            if (key === letter?.textContent) {
                letter?.setAttribute("class", "letter correct");
            } else {
                letter?.setAttribute("class", "letter wrong");
            }
            letterIndex++;
            if (word?.children.length === letterIndex) {
                wordIndex++;
                letterIndex = 0;
                word?.setAttribute("class", "text");
                document
                    .querySelector(`.speedTest .tester-container .active`)
                    ?.children[rowIndex].children[wordIndex]?.setAttribute(
                        "class",
                        "text active"
                    );
            }
            if (wordIndex === (row?.children.length || 0)) {
                rowIndex++;
                wordIndex = 0;
                word?.setAttribute("class", "text");
                letterIndex = 0;
                const container = document.querySelector(
                    `.speedTest .tester-container .active`
                );

                container?.children[rowIndex].children[wordIndex]?.setAttribute(
                    "class",
                    "text active"
                );

                if (rowIndex >= 2) {
                    // container?.setAttribute("top", `-${1000 * rowIndex - 1}`)
                    (container as any).style.top = `-${59 * (rowIndex - 1)}px`;
                }
            }
        };

        function checkPage() {
            const row = document.querySelector(
                `.speedTest .tester-container .active`
            )?.children[rowIndex];
            if (!row) {
                document.removeEventListener("keydown", keyboardInput);
                document.removeEventListener("mousedown", checkPage);
                return;
            }
        }
        document.addEventListener("keydown", keyboardInput);
        document.addEventListener("mousedown", checkPage);
    };

    render() {
        return (
            <div className="speedTest">
                <div className="tester-container">
                    {this.state.start ? (
                        <div className="tester active"></div>
                    ) : (
                        <div
                            className="tester disabled"
                            onClick={() => {
                                this.setState((state) => ({
                                    ...state,
                                    start: true,
                                }));
                                this.startTest();
                            }}
                        >
                            <span>Старт</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
