import React, { Component } from "react";
import "./style.scss";

interface Props {}

interface State {}

export default class Home extends Component<Props, State> {
    render() {
        return (
            <div className="home">
                <div className="results">Ваши результаты: </div>
            </div>
        );
    }
}
