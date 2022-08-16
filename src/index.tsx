import React, { Component } from "react";
import ReactDOM from "react-dom/client";
import "./style.scss";
import Home from "./components/home";
import Header from "./components/header";
import Profile from "./components/profile";
import SpeedTest from "./components/speedTest";
import { Pages, Language } from "./interfaces";

interface Props {
    language?: Language;
}

interface State {
    page: Pages;
    language: Language;
    timer: number;
}

class App extends Component<Props, State> {
    activeDelay: boolean;
    constructor(props: Props) {
        super(props);

        this.state = {
            page: "speedTest",
            language: "ru",
            timer: 1,
        };
        this.activeDelay = false;
    }

    setPage = (page: Pages) => {
        this.setState((state) => ({ ...state, page }));
        this.activeDelay = true;
        setTimeout(() => {
            this.activeDelay = false;
        }, 500);
    };

    setTimer = (timer: number) => {
        this.setState((state) => ({ ...state, timer }));
    }

    render(): React.ReactNode {
        if (this.state.page === "home") {
            return (
                <>
                    <Header page={this.state.page} setPage={this.setPage} />
                    <Home />
                </>
            );
        }

        if (this.state.page === "profile") {
            return (
                <>
                    <Header page={this.state.page} setPage={this.setPage} />
                    <Profile />
                </>
            );
        }

        if (this.state.page === "speedTest") {
            return (
                <>
                    <Header page={this.state.page} setPage={this.setPage} />
                    <SpeedTest
                        language={this.state.language}
                        timer={this.state.timer}
                        page={this.state.page}
                        setPage={this.setPage}
                        setTimer={this.setTimer}
                    />
                </>
            );
        }
    }
}

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(<App />);
