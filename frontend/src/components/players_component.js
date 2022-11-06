import { useState, useEffect } from 'react'
import axios from 'axios'
import UserService from "../services/user_service";
import "./clubs_&_players_component.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from "react-bootstrap/Form";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';

import countries from "i18n-iso-countries";
import ReactCountryFlag from "react-country-flag";
import enLocale from "i18n-iso-countries/langs/en.json";
import plLocale from "i18n-iso-countries/langs/pl.json";
import Moment from 'moment';


export default function PlayersComponent() {

    Moment.locale('pl')
    const [content, setContent] = useState()
    const [playerArr, setPlayerArr] = useState([])
    const [selectedCountry, setSelectedCountry] = useState("")
    const [status, setStatus] = useState("")

    const selectCountryHandler = (value) => setSelectedCountry(value)
    const ButtonHandler = (value) => setStatus(value)
    countries.registerLocale(enLocale);
    countries.registerLocale(plLocale);

    const countryObj = countries.getNames("pl", { select: "official" });

    const countryArr = Object.entries(countryObj).map(([key, value]) => {
        return {
            label: value,
            value: key
        };
    });
    const strAscendingCountryArr = [...countryArr].sort((a, b) =>
        a.label > b.label ? 1 : -1
    );

    function countryCode(nationality) {
        const codeByNation = strAscendingCountryArr.find(obj => {
            return obj.label === nationality;
        });
        return codeByNation.value;
    }

    function componentDidMount() {
        UserService.getUserBoard().then(
            response => {
                setContent(response.data);
            },
            error => {
                setContent(
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString()
                );
            }
        );
    }

    const getPlayersData = async () => {
        const foundByCountry = strAscendingCountryArr.find(obj => {
            return obj.value === selectedCountry;
        });
        const dataJson = JSON.stringify({
            nationality: foundByCountry ? foundByCountry.label : "",
        })
        try {
            const res = await axios.post((process.env.baseURL || "http://localhost:3001") + '/api/test/getPlayers', dataJson, {
                headers: { 'Content-Type': 'application/json' }
            })
            if (res.data.status === 'ok') {
                setPlayerArr(res.data.players)
            }
        }
        catch (err) {
        }
    }

    useEffect(() => {
        getPlayersData()
    }, [selectedCountry]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            {componentDidMount()}
            {content === "Zawartość użytkownika." ? (
                <div className="container">
                    {status === "" ? (
                        <>
                            <header className="jumbotron">
                                <h3>Zawodnicy</h3>
                            </header>
                            <div
                                id="countryFlag"
                                className="marginBottom"
                                style={{ display: "flex", alignItems: "center", width: "70%" }}
                            >
                                <ReactCountryFlag
                                    style={{
                                        width: '1.5em',
                                        height: '1.5em',
                                    }}
                                    countryCode={selectedCountry}
                                    svg
                                    cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                                    cdnSuffix="svg"
                                    title={selectedCountry}
                                />
                                <div style={{ marginLeft: "10px", color: "black", width: "100%" }}>
                                    <FloatingLabel controlId="floatingSelect" label="Narodowość">
                                        <Form.Select size="lg"
                                            id="floatingSelect"
                                            value={selectedCountry}
                                            onChange={(e) => {
                                                selectCountryHandler(e.target.value);
                                            }}
                                        >
                                            <option key={"all"} value={"all"}>Wszystkie</option>
                                            {!!strAscendingCountryArr?.length &&
                                                strAscendingCountryArr.map(({ label, value }) => (
                                                    <option key={value} value={value}>
                                                        {label}
                                                    </option>
                                                ))}
                                        </Form.Select>
                                    </FloatingLabel>
                                </div>
                            </div>
                            <Row lg={4}>
                                {playerArr.map((player, i) => (
                                    <Col className="d-flex" key={i}>
                                        <Card key={player._id} style={{ width: '18rem' }}>
                                            <img
                                                className="imgPlayers"
                                                src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                                                alt="player-img"
                                                width="180" 
                                                height="180"
                                            />
                                            <Card.Body>
                                                <Card.Title>{player.known_as === "" ? player.name + " " + player.surname : player.known_as}</Card.Title>
                                                <Card.Text>
                                                    {player.position}, {player.club}<br/>
                                                    <ReactCountryFlag
                                                        style={{
                                                            width: '1em',
                                                            height: '1em',
                                                        }}
                                                        countryCode={countryCode(player.nationality)}
                                                        svg
                                                        cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                                                        cdnSuffix="svg"
                                                        title={countryCode(player.nationality)}
                                                    />
                                                    {" "}{player.nationality}
                                                </Card.Text>
                                                <div className="d-grid gap-2">
                                                    <Button variant="success" key={player._id} onClick={() => { ButtonHandler(player) }} >
                                                        Profil zawodnika
                                                    </Button>
                                                </div>

                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </>
                    ) : (
                        <>
                            <header className="jumbotron">
                                <h3>{status.known_as === "" ? status.name + " " + status.surname : status.known_as}</h3>
                                    <img
                                        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                                        alt="player-img"
                                        className="player-img-card"
                                        width="180"
                                        height="180"
                                    />
                            </header>
                            <p>
                                {status.known_as !== "" ? (
                                    <p>
                                        <strong>Pełne imię i nazwisko:</strong>{" "}
                                        {status.name} {status.surname}
                                    </p>
                                ):(null)}
                                <strong>Narodowość:</strong>{" "}
                                <ReactCountryFlag
                                    style={{
                                        width: '1.2em',
                                        height: '1.2em',
                                    }}
                                    countryCode={countryCode(status.nationality)}
                                    svg
                                    cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                                    cdnSuffix="svg"
                                    title={countryCode(status.nationality)}
                                />
                                {" "}{status.nationality}
                            </p>
                            <p>
                                <strong>Klub:</strong>{" "}
                                {status.club}
                            </p>
                            <p>
                                <strong>Numer zawodnika:</strong>{" "}
                                {status.number}
                            </p>
                            <p>
                                <strong>Pozycja:</strong>{" "}
                                {status.position}
                            </p>
                            <p>
                                <strong>Data i miejsce urodzenia:</strong>{" "}
                                {Moment(status.date_of_birth).format('DD.MM.YYYY')}, {status.city_of_birth}
                            </p>
                            <p>
                                <strong>{"Wzrost/waga [cm/kg]:"}</strong>{" "}
                                {status.height}/{status.weight}
                            </p>
                            <Button variant="success" onClick={() => { ButtonHandler("") }} >
                                Wróć do wszystkich zawodników
                            </Button>
                        </>
                    )}
                </div>
            ) : (
                <div className="container">
                    <header className="jumbotron">
                        <h3>Brak dostępu do tej strony!</h3>
                    </header >
                </div>
            )}
        </>
    )

}
