import React, { Component } from "react";
import "./style.scss";
import { Pages } from "../../interfaces";

interface Props {
    page: "home" | "profile" | "speedTest";
    setPage(page: Pages): void;
}

interface State {}

export default class Header extends Component<Props, State> {
    render() {
        return (
            <div className="header">
                <span
                    className="logo"
                    onClick={() => {
                        this.props.setPage("home");
                    }}
                >
                    Type Speed
                </span>
                <div className="menu-container">
                    <span
                        className={`main ${
                            this.props.page === "home" ? "active" : ""
                        }`}
                        onClick={() => {
                            this.props.setPage("home");
                        }}
                    >
                        Главная
                    </span>
                    <span
                        className={`test ${
                            this.props.page === "speedTest" ? "active" : ""
                        }`}
                        onClick={() => {
                            this.props.setPage("speedTest");
                        }}
                    >
                        Пройти тест
                    </span>
                    <span
                        className={`profile ${
                            this.props.page === "profile" ? "active" : ""
                        }`}
                        onClick={() => {
                            this.props.setPage("profile");
                        }}
                    >
                        Профиль
                    </span>
                </div>
                <span className="login">Войти</span>
            </div>
        );
    }
}
