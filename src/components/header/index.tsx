import React, { Component } from "react";
import "./style.scss";
import { Pages } from "../../interfaces";

interface Props {
    page: "home" | "profile" | "speedTest";
    setPage(page: Pages): void;
}

interface State {}

export default class Header extends Component<Props, State> {
    componentDidMount() {
        const logo = document.querySelector(".header .logo");
        logo?.addEventListener("mouseover", () => {
            if (logo.classList.contains("animation")) return;
            logo.setAttribute("class", "logo animation");

            setTimeout(() => {
                logo.setAttribute("class", "logo");
            }, 1800)
        });
    }

    render() {
        return (
            <div className="header">
                <div
                    className="logo"
                    onClick={() => {
                        this.props.setPage("home");
                    }}
                >
                    <span>T</span>
                    <span>y</span>
                    <span>p</span>
                    <span>e</span>
                    <span> </span>
                    <span>S</span>
                    <span>p</span>
                    <span>e</span>
                    <span>e</span>
                    <span>d</span>
                </div>
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
