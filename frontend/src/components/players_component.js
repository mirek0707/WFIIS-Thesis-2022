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
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';

import countries from "i18n-iso-countries";
import ReactCountryFlag from "react-country-flag";
import enLocale from "i18n-iso-countries/langs/en.json";
import plLocale from "i18n-iso-countries/langs/pl.json";
import Moment from 'moment';
import CurrencyFormat from 'react-currency-format';


export default function PlayersComponent() {

    Moment.locale('pl')
    const [content, setContent] = useState()
    const [playerArr, setPlayerArr] = useState([])
    const [transferArr, setTransferArr] = useState([])
    const [videoArr, setVideoArr] = useState([])
    const [selectedCountry, setSelectedCountry] = useState("")
    const [selectedPosition, setSelectedPosition] = useState("")
    const [selectedOption, setSelectedOption] = useState("")
    const [status, setStatus] = useState("")

    const selectCountryHandler = (value) => setSelectedCountry(value)
    const selectPositionHandler = (value) => setSelectedPosition(value)
    const selectOptionHandler = (value) => setSelectedOption(value)
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

    function getAge(date) {
        var today = new Date();
        var birthDate = new Date(date);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    function calculateGain() {
        let sum = 0
        transferArr.map((transfer) => {
            sum += transfer.fee
            return transfer
        })
        return sum;
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
            position: selectedPosition === "all" ? "" : selectedPosition,
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

    const getPlayerTransfers = async () => {
        const dataJson = JSON.stringify({
            player_id: status === "" ? "" : status._id.toString()
        })
        try {
            const res = await axios.post((process.env.baseURL || "http://localhost:3001") + '/api/test/getPlayerTransfers', dataJson, {
                headers: { 'Content-Type': 'application/json' }
            })
            console.log(dataJson)
            console.log(status)
            if (res.data.status === 'ok') {
                setTransferArr(res.data.transfers)
            }
        }
        catch (err) {
        }
    }

    const getVideos = async () => {
        const dataJson = JSON.stringify({
            surname: status === "" ? "" : status.surname,
            known_as: status === "" ? "" : status.known_as,
            option: selectedOption === "all" ? "" : selectedOption
        })
        try {
            const res = await axios.post((process.env.baseURL || "http://localhost:3001") + '/api/test/getVideos', dataJson, {
                headers: { 'Content-Type': 'application/json' }
            })
            if (res.data.status === 'ok') {
                setVideoArr(res.data.videos)
            }
        }
        catch (err) {
        }
    }

    useEffect(() => {
        componentDidMount()
        getPlayersData()
    }, [selectedCountry, selectedPosition]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        getPlayerTransfers()
        getVideos()
    }, [status]) // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        getVideos()
    }, [selectedOption]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            {content === "Zawartość użytkownika." ? (
                <div className="container" style={{ padding: "3rem 0rem" }}>
                    {status === "" ? (
                        <>
                            <header className="jumbotron">
                                <h3>Zawodnicy</h3>
                            </header>
                            <Row>
                                <Col lg={8}>
                                    <div
                                        id="countryFlag"
                                        className="marginBottom"
                                        style={{ display: "flex", alignItems: "center", width: "100%" }}
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
                                </Col>
                                <Col lg={4}>
                                    <FloatingLabel controlId="floatingSelect" label="Pozycja">
                                        <Form.Select size="lg"
                                            id="floatingSelect2"
                                            value={selectedPosition}
                                            onChange={(e) => {
                                                selectPositionHandler(e.target.value);
                                            }}
                                        >
                                            <option key={"all"} value={"all"}>Wszystkie</option>
                                            <option key={"BR"} value={"bramkarz"}>Bramkarz</option>
                                            <option key={"OB"} value={"obrońca"}>Obrońca</option>
                                            <option key={"PO"} value={"pomocnik"}>Pomocnik</option>
                                            <option key={"NA"} value={"napastnik"}>Napastnik</option>
                                            
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                            </Row>
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
                                <Row lg={2}>
                                    <Col className="d-flex">
                                        <h3>{status.known_as === "" ? status.name + " " + status.surname : status.known_as}</h3>
                                    </Col>
                                    <Col className="d-flex justify-content-end">
                                        <Button variant="success" onClick={() => { ButtonHandler("") }} >
                                            Wróć do wszystkich zawodników
                                        </Button>
                                    </Col>
                                </Row>
                                <img
                                    src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                                    alt="player-img"
                                    className="player-img-card"
                                    width="180"
                                    height="180"
                                />
                            </header>
                            {status.known_as !== "" ? (
                                <p>
                                    <strong>Pełne imię i nazwisko:</strong>{" "}
                                    {status.name} {status.surname}
                                </p>
                            ):(null)}
                            <p>
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
                                <strong>Wiek:</strong>{" "}
                                {getAge(status.date_of_birth)}
                            </p>
                            <p>
                                <strong>Data i miejsce urodzenia:</strong>{" "}
                                {Moment(status.date_of_birth).format('DD.MM.YYYY')}, {status.city_of_birth}
                            </p>
                            <p style={{marginBottom:"50px"}}>
                                <strong>{"Wzrost/waga [cm/kg]:"}</strong>{" "}
                                {status.height}/{status.weight}
                            </p>
                            <Tabs
                                defaultActiveKey="transfers"
                                transition={true}
                                id="noanim-tab-example"
                                className="mb-3"
                            >
                                <Tab eventKey="transfers" title="Transfery zawodnika">
                                    <Table striped bordered hover size="sm">
                                        <thead>
                                            <tr>
                                                <th>Data</th>
                                                <th>Z klubu</th>
                                                <th>Do klubu</th>
                                                <th>Typ</th>
                                                <th>Kwota</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transferArr.map((transfer, i) => (
                                                <tr key={i}>
                                                    <td>{Moment(transfer.date).format('DD.MM.YYYY')}</td>
                                                    <td>{transfer.club_left}</td>
                                                    <td>{transfer.club_joined}</td>
                                                    <td>{transfer.type}</td>
                                                    <CurrencyFormat value={transfer.fee} displayType={'text'} thousandSeparator={true} suffix={' €'} renderText={value => <td>{value}</td>} />
                                                </tr>
                                            ))}
                                            <tr>
                                                <CurrencyFormat value={calculateGain()} displayType={'text'} thousandSeparator={true} suffix={' €'} renderText={value => <td align="right" colSpan={6}><b>Łączny dochód z transferów: {value}</b></td>} />
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Tab>
                                <Tab eventKey="videos" title="Filmiki">
                                    <Col lg={3}>
                                        <FloatingLabel controlId="floatingSelect" label="Rodzaj:">
                                            <Form.Select size="lg"
                                                id="floatingSelect"
                                                value={selectedOption}
                                                onChange={(e) => {
                                                    selectOptionHandler(e.target.value);
                                                }}
                                            >
                                                <option key={"all"} value={"all"}>Wszystkie</option>
                                                <option key={"goals"} value={"goals"}>Gole</option>
                                                <option key={"skills"} value={"21/22"}>Umiejętności</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Row lg={3}>
                                        {videoArr.map((video, i) => (
                                            <Col className="d-flex" key={i}>
                                                <Card key={video.name} className="text-center">
                                                    <Card.Body>
                                                        <iframe title={video.name} width="320" height="180" src={video.url} frameBorder="0" allowFullScreen></iframe>
                                                        <br/>
                                                        <Card.Link href={video.url}>link</Card.Link>
                                                        <Card.Title>{video.name}</Card.Title>
                                                        {/* <Card.Text>
                                                            
                                                        </Card.Text>*/}
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                </Tab>
                            </Tabs>
                        </>
                    )}
                </div>
            ) : (
                <div className="container" style={{ padding: "3rem 0rem" }}>
                    <header className="jumbotron">
                        <h3>Brak dostępu do tej strony!</h3>
                    </header >
                </div>
            )}
        </>
    )

}
