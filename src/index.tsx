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
    constructor(props: Props) {
        super(props);

        this.state = {
            page: "speedTest",
            language: "ru",
            timer: 1
        };
    }

    setPage = (page: Pages) => {
        this.setState((state) => ({ ...state, page }));
    };

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
                    <SpeedTest language={this.state.language} timer={this.state.timer} />
                </>
            );
        }
    }
}

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(<App />);
