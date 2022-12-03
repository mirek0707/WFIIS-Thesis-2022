import React, { Component, useState } from "react";

import UserService from "../services/user_service";
import Carousel from 'react-bootstrap/Carousel';

function ControlledCarousel() {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    return (
        <Carousel activeIndex={index} onSelect={handleSelect} className="p-0">
            <Carousel.Item>
                <svg className="bd-placeholder-img bd-placeholder-img-lg d-block w-100" width="100%" height="700" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Second slide" preserveAspectRatio="xMidYMid slice" focusable="false">
                    <title>Slide</title>
                    <rect width="100%" height="100%" fill="rgba(23, 97, 62)"></rect>
                </svg>
                <Carousel.Caption>
                    <h1>TransferSite - Serwis transferowy</h1>
                    <h4 style={{ padding: "20px" }}>Dołącz już dziś!</h4>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <svg className="bd-placeholder-img bd-placeholder-img-lg d-block w-100" width="800" height="700" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Second slide" preserveAspectRatio="xMidYMid slice" focusable="false">
                    <title>Slide</title>
                    <rect width="100%" height="100%" fill="rgba(25, 135, 84)"></rect>
                </svg>

                <Carousel.Caption>
                    <h1>TransferSite - Kluby</h1>
                    <h4 style={{ padding: "20px" }}>Poznaj kadry zespołów. Śledź bilans transferowy klubów w poszczególnych sezonach.</h4>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <svg className="bd-placeholder-img bd-placeholder-img-lg d-block w-100" width="800" height="700" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Second slide" preserveAspectRatio="xMidYMid slice" focusable="false">
                    <title>Slide</title>
                    <rect width="100%" height="100%" fill="rgba(23, 97, 62)"></rect>
                </svg>

                <Carousel.Caption>
                    <h1>TransferSite - Zawodnicy</h1>
                    <h4 style={{padding:"20px"}}>Poznaj informacje dotyczące zawodników jakich wcześniej nie znałeś! Oglądaj filmy z najlepszymi zagraniami, bramkami, czy wywiadami.</h4>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <svg className="bd-placeholder-img bd-placeholder-img-lg d-block w-100" width="800" height="700" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Second slide" preserveAspectRatio="xMidYMid slice" focusable="false">
                    <title>Slide</title>
                    <rect width="100%" height="100%" fill="rgba(25, 135, 84)"></rect>
                </svg>

                <Carousel.Caption>
                    <h1>TransferSite - Transfery</h1>
                    <h4 style={{ padding: "20px" }}>Śledź najnowsze, jak i historyczne transfery zawodników oraz klubów. </h4>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}
export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: ""
        };
    }

    componentDidMount() {
        UserService.getPublicContent().then(
            response => {
                this.setState({
                    content: response.data
                });
            },
            error => {
                this.setState({
                    content:
                        (error.response && error.response.data) ||
                        error.message ||
                        error.toString()
                });
            }
        );
    }

    render() {
        return (
            <div className="container" style={{ maxWidth:"90%", paddingTop:"20px" }}>
                <ControlledCarousel />
            </div>
        );
    }
}
