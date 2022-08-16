import React, { Component } from "react";
import "./style.scss";
import ru from "../../languages/ru";
import en from "../../languages/en";
import { Language, Pages } from "../../interfaces";
import checkKeyboad from "../../utils/checkKeyboard";

const events = new Set();
const timers = new Set();

interface Props {
    language: Language;
    timer: number;
    page: Pages;
    setPage: (page: Pages) => void;
    setTimer: (timer: number) => void;
}

interface State {
    words: string[];
    start: boolean;
}

export default class SpeedTest extends Component<Props, State> {
    startActive: boolean;
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
        };
        this.startActive = true;
    }

    createRows = (numberOfWords: number, startFrom: number = 0) => {
        let text: string[][] = [];
        for (let i = 0; i < numberOfWords; i++) {
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
        row.setAttribute("id", String(startFrom));
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
                row.setAttribute("id", String(rowIndex + startFrom));
            }
        });
        container?.appendChild(row);
    };

    startTest = () => {
        if (!this.startActive) return;
        const button = document.querySelector(
            ".speedTest .under-container .results"
        );
        button?.setAttribute("class", "results close");
        // setTimeout(() => {
        this.setState((state) => ({
            ...state,
            start: true,
        }));
        // }, 500);

        let wordIndex: number = 0;
        let letterIndex: number = 0;
        let rowIndex = 0;
        let wordsCount = 50 * this.props.timer;
        this.createRows(wordsCount);
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
                events.delete({
                    event: "keydown",
                    function: checkControlDown,
                });
                events.delete({
                    event: "keyup",
                    function: checkControlUp,
                });
                return;
            }
        }

        let timer: any;

        const keyboardInput = (event: KeyboardEvent) => {
            let key = event.key;
            if (
                controlIsActive ||
                (!checkKeyboad(event, this.props.language) &&
                    key !== " " &&
                    key !== "Backspace" &&
                    key !== "Control")
            )
                return;

            if (timer) {
                clearTimeout(timer);
                timers.delete(timer);
            }

            timer = setTimeout(() => {
                document.removeEventListener("keydown", keyboardInput);
                document.removeEventListener("mousedown", checkPage);
                events.delete({
                    event: "keydown",
                    function: keyboardInput,
                });
                events.delete({
                    event: "mousedown",
                    function: checkPage,
                });
                this.afk();
                clearInterval(interval);
            }, 20_000);
            timers.add(timer);

            const row = document.querySelector(
                `.speedTest .tester-container .active`
            )?.children[rowIndex];
            if (!row) {
                document.removeEventListener("keydown", keyboardInput);
                document.removeEventListener("mousedown", checkPage);
                events.delete({
                    event: "keydown",
                    function: keyboardInput,
                });
                events.delete({
                    event: "mousedown",
                    function: checkPage,
                });
                clearInterval(interval);
                return;
            }

            if (key === "Control") {
                controlIsActive = true;
                document.addEventListener("keydown", checkControlDown);
                document.addEventListener("keyup", checkControlUp);
                events.add({
                    event: "keydown",
                    function: checkControlDown,
                });
                events.add({
                    event: "keydown",
                    function: checkControlUp,
                });
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
                if (letter.textContent !== " ") {
                    letter?.setAttribute("class", "letter wrong");
                }
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
                    (container as any).style.top = `-${59 * (rowIndex - 1)}px`;
                }
                if (container?.children.length === rowIndex + 4) {
                    container.removeChild(
                        container.children[container.children.length - 1]
                    );
                    this.createRows(wordsCount, container.children.length);
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
                events.delete({
                    event: "keydown",
                    function: keyboardInput,
                });
                events.delete({
                    event: "mousedown",
                    function: checkPage,
                });
                clearInterval(interval);
                return;
            }
        }
        document.addEventListener("keydown", keyboardInput);
        document.addEventListener("mousedown", checkPage);
        events.add({
            event: "keydown",
            function: keyboardInput,
        });
        events.add({
            event: "mousedown",
            function: checkPage,
        });

        let stopTimeout = setTimeout(() => {});
        let interval = setInterval(() => {});

        const once = (event: KeyboardEvent) => {
            const key = event.key;
            if (
                controlIsActive ||
                (!checkKeyboad(event, this.props.language) &&
                    key !== " " &&
                    key !== "Backspace" &&
                    key !== "Control")
            )
                return;
            stopTimeout = setTimeout(() => {
                document.removeEventListener("keydown", keyboardInput);
                document.removeEventListener("mousedown", checkPage);
                events.delete({
                    event: "keydown",
                    function: keyboardInput,
                });
                events.delete({
                    event: "mousedown",
                    function: checkPage,
                });

                clearInterval(interval);
                if (timer) {
                    clearTimeout(timer);
                }
                this.stop();
            }, this.props.timer * 60_000);
            timers.add(stopTimeout);

            interval = setInterval(() => {
                const tester = document.querySelector(
                    ".speedTest .tester-container .tester.active"
                );
                if (!tester) {
                    clearInterval(interval);
                    return;
                }
                const timer = document.querySelector(
                    ".speedTest .under-container .timer"
                );

                if (!timer) return;

                let [minutes, seconds] =
                    timer?.textContent?.split(":").map((x) => Number(x)) || [];

                if (seconds === 0) {
                    minutes--;
                    seconds = 60;
                }
                seconds--;

                this.setTimer(`${minutes}:${`0${seconds}`.slice(-2)}`);
            }, 1000);
            timers.add(interval);
            document.removeEventListener("keydown", once);
            events.delete({
                event: "keydown",
                function: once,
            });
        };
        timers.add(stopTimeout);
        timers.add(interval);

        document.addEventListener("keydown", once);
        events.add({
            event: "keydown",
            function: once,
        });
    };

    stop = () => {
        if (
            !document.querySelector(
                ".speedTest .tester-container .tester.active"
            )
        )
            return;
        const correct = document.querySelectorAll(".speedTest .correct").length;
        const wrong = document.querySelectorAll(".speedTest .wrong").length;
        let wordsCorrect = Math.round(correct / 5);
        // document.querySelectorAll(".speedTest .text").forEach((word) => {
        //     let isCorrect = true;
        //     Array.from(word.children).forEach((child) => {
        //         if (!child.classList.contains("correct")) {
        //             isCorrect = false;
        //         }
        //     });
        //     if (isCorrect) {
        //         wordsCorrect++;
        //     }
        // });

        const tester = document.querySelector(
            ".speedTest .tester-container .tester"
        );
        Array.from(tester?.children || []).forEach((block) => {
            tester?.removeChild(block);
        });

        const wordsDiv = document.createElement("span");
        wordsDiv.textContent = `Слов в минуту: ${wordsCorrect}`;
        wordsDiv.setAttribute("class", "text");

        const correctDiv = document.createElement("span");
        correctDiv.textContent = `Знаков в минуту: ${correct}`;
        correctDiv.setAttribute("class", "text");

        const rightProcent = document.createElement("span");

        rightProcent.textContent = `Аккуратность: ${
            Math.floor(((correct - wrong / 2) * 100) / correct) < 0
                ? 0
                : Math.floor(((correct - wrong / 2) * 100) / correct)
        }%`;
        rightProcent.setAttribute("class", "text");

        const statBlock = document.createElement("div");
        statBlock.setAttribute("class", "stat");
        statBlock.appendChild(wordsDiv);
        statBlock.appendChild(correctDiv);
        statBlock.appendChild(rightProcent);
        const container = document.querySelector(
            ".speedTest .tester-container"
        );
        container?.appendChild(statBlock);
        this.setTimer(`${this.props.timer}:00`);
        const click = () => {
            if (!document.querySelector(".speedTest .tester-container .stat")) {
                container?.removeEventListener("click", click);
                return;
            }

            this.setState((state) => ({ ...state, start: false }));
            this.render();
            this.setTimer(`${this.props.timer}:00`);
            container?.removeChild(statBlock);
            container?.removeEventListener("click", click);
        };
        (container as any).style.cursor = "pointer";
        container?.addEventListener("click", click);
    };

    afk = () => {
        const tester = document.querySelector(
            ".speedTest .tester-container .tester.active"
        );
        if (!tester) return;
        Array.from(tester?.children || []).forEach((block) => {
            tester?.removeChild(block);
        });

        const text = document.createElement("span");
        text.textContent = "Вы долго бездействуете";
        text.setAttribute("class", "text");

        const statBlock = document.createElement("div");
        statBlock.setAttribute("class", "stat");
        statBlock.appendChild(text);

        const container = document.querySelector(
            ".speedTest .tester-container"
        );
        container?.appendChild(statBlock);
        const click = () => {
            this.setState((state) => ({ ...state, start: false }));
            this.render();
            this.setTimer(`${this.props.timer}:00`);
            container?.removeChild(statBlock);
            container?.removeEventListener("click", click);
            events.delete({
                event: "click",
                function: click,
            });
        };
        container?.addEventListener("click", click);
        events.add({
            event: "click",
            function: click,
        });
        return;
    };

    setTimer = (time: string) => {
        const timer = document.querySelector(
            ".speedTest .under-container .timer"
        );
        if (timer) timer.textContent = time;
    };

    clearEvents = () => {
        events.forEach((event: any) => {
            document.removeEventListener(event.event, event.function);
            events.delete(event);
        });
    };

    clearTimers = () => {
        timers.forEach((timer: any) => {
            clearTimeout(timer);
            clearInterval(timer);
        });
    };

    componentWillUnmount() {
        this.clearEvents();
        this.clearTimers();
    }

    componentDidMount() {
        this.clearEvents();
        this.clearTimers();
    }

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
                                this.startTest();
                            }}
                        >
                            <span>Старт</span>
                        </div>
                    )}
                </div>
                <div className="under-container">
                    {this.state.start ? (
                        <button
                            className="restart"
                            onClick={() => {
                                this.setTimer(`${this.props.timer}:00`);
                                this.stop();
                                this.clearEvents();
                                this.clearTimers();
                                document
                                    .querySelector(
                                        ".speedTest .tester-container .tester"
                                    )
                                    ?.setAttribute("style", "");
                                const container = document.querySelector(
                                    ".speedTest .tester-container"
                                );
                                Array.from(container?.children || []).forEach(
                                    (child) => {
                                        if (child.classList.contains("stat")) {
                                            container?.removeChild(child);
                                        }
                                    }
                                );
                                this.startTest();
                            }}
                        >
                            Заново
                        </button>
                    ) : (
                        <div
                            className="results"
                            onClick={() => {
                                this.props.setPage("profile");
                            }}
                        >
                            <span>Посмотреть результаты</span>
                        </div>
                    )}
                    {this.state.start ? (
                        <span className="timer">{`${this.props.timer}:00`}</span>
                    ) : (
                        <div className="timer-selector">
                            <div
                                className={
                                    this.props.timer === 1
                                        ? "active left"
                                        : "left"
                                }
                                onClick={() => {
                                    if (this.props.timer === 1) return;
                                    this.props.setTimer(1);
                                    const selector = document.querySelector(
                                        ".speedTest .under-container .timer-selector .selector"
                                    );
                                    selector?.setAttribute("class", "left");
                                }}
                            >
                                <span>1 мин.</span>
                            </div>
                            <div
                                className={
                                    this.props.timer === 2
                                        ? "active center"
                                        : "center"
                                }
                                onClick={() => {
                                    if (this.props.timer === 2) return;
                                    this.props.setTimer(2);
                                    const selector = document.querySelector(
                                        ".speedTest .under-container .timer-selector .selector"
                                    );
                                    selector?.setAttribute("class", "center");
                                }}
                            >
                                <span>2 мин.</span>
                            </div>
                            <div
                                className={
                                    this.props.timer === 5
                                        ? "active right"
                                        : "right"
                                }
                                onClick={() => {
                                    if (this.props.timer === 5) return;
                                    this.props.setTimer(5);
                                    const selector = document.querySelector(
                                        ".speedTest .under-container .timer-selector .selector"
                                    );
                                    selector?.setAttribute("class", "right");
                                }}
                            >
                                <span>5 мин.</span>
                            </div>
                            <div
                                className={(() => {
                                    if (this.props.timer === 1)
                                        return "selector left";
                                    if (this.props.timer === 2)
                                        return "selector center";
                                    if (this.props.timer === 5)
                                        return "selector right";
                                    return "selector";
                                })()}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
