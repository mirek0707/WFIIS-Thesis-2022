import React, { useState, useEffect } from "react";

import UserService from "../services/user_service";
import axios from 'axios'

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import CheckButton from "react-validation/build/button";

import CurrencyFormat from 'react-currency-format';
import countries from "i18n-iso-countries";
import plLocale from "i18n-iso-countries/langs/pl.json";

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

export default function BoardAdmin() {

    const [content, setContent] = useState()
    //forms
    const [transferForm, setTransferForm] = useState("")
    const [playerForm, setPlayerForm] = useState("")
    const [clubForm, setClubForm] = useState("")
    //buttons
    const [transferButton, setTransferButton] = useState("")
    const [playerButton, setPlayerButton] = useState("")
    const [clubButton, setClubButton] = useState("")
    //for adding transfers
    const [playerId, setPlayerId] = useState("")
    const [clubLeft, setClubLeft] = useState("")
    const [clubJoined, setClubJoined] = useState("")
    const [type, setType] = useState("0 €")
    const [fee, setFee] = useState(0)
    const [formattedFee, setFormattedFee] = useState("")
    const [date, setDate] = useState("")
    //for adding players
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [knownAs, setKnownAs] = useState("")
    const [nationality, setNationality] = useState("")
    const [cityOfBirth, setCityOfBirth] = useState("")
    const [dateOfBirth, setDateOfBirth] = useState("")
    const [position, setPosition] = useState("")
    const [club, setClub] = useState("")
    const [number, setNumber] = useState("")
    const [height, setHeight] = useState("")
    const [weight, setWeight] = useState("")
    //for adding clubs
    const [clubName, setClubName] = useState("")
    const [nation, setNation] = useState("")
    const [city, setCity] = useState("")
    const [yearFounded, setYearFounded] = useState("")

    const [successfulTr, setSuccessfulTr] = useState(false)
    const [messageTr, setMessageTr] = useState("")
    const [successfulPl, setSuccessfulPl] = useState(false)
    const [messagePl, setMessagePl] = useState("")
    const [successfulCl, setSuccessfulCl] = useState(false)
    const [messageCl, setMessageCl] = useState("")

    const [playersNamesArr, setPlayersNamesArr] = useState([])
    const [clubsNamesArr, setClubsNamesArr] = useState([])

    const currYear = new Date().getFullYear()

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

    //validation
    const required = value => {
        if (!value) {
            return (
                <div className="alert alert-danger" role="alert">
                    Pole wymagane!
                </div>
            );
        }
    };
    const vclub = (value, props, components) => {
        if (value === components["club_left"][0].value) {
            return (
                <div className="alert alert-danger" role="alert">
                    Kluby muszą być różne!
                </div>
            );
        }
    };

    function vfee() {
        if (formattedFee.search("-") >= 0) {
            return (
                <div className="alert alert-danger" role="alert">
                    Kwota transferu nie może być mniejsza niż 0!
                </div>
            );
        }
    };
    
    
    function componentDidMount() {
        UserService.getAdminBoard().then(
            response => {
                setContent(response.data)
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

    const getPlayersNames = async () => {
        const dataJson = JSON.stringify({
        })
        try {
            const res = await axios.post((process.env.baseURL || "http://localhost:3001") + '/api/test/getPlayersNames', dataJson, {
                headers: { 'Content-Type': 'application/json' }
            })
            if (res.data.status === 'ok') {
                setPlayersNamesArr(res.data.players)
            }
        }
        catch (err) {
        }
    }

    const getClubsNames = async () => {
        const dataJson = JSON.stringify({
        })
        try {
            const res = await axios.post((process.env.baseURL || "http://localhost:3001") + '/api/test/getClubsNames', dataJson, {
                headers: { 'Content-Type': 'application/json' }
            })
            if (res.data.status === 'ok') {
                setClubsNamesArr(res.data.clubs)
            }
        }
        catch (err) {
        }
    }

    const addTransfer = async () => {
        let season
        const jsDate = new Date(date)
        switch (true) {
            case jsDate > new Date("2022-06-30"):
                season = "22/23"
                break;
            case jsDate > new Date("2021-06-30"):
                season = "21/22"
                break;
            case jsDate > new Date("2020-06-30"):
                season = "20/21"
                break;
            case jsDate > new Date("2019-06-30"):
                season = "19/20"
                break;
            case jsDate > new Date("2018-06-30"):
                season = "18/19"
                break;
            case jsDate > new Date("2017-06-30"):
                season = "17/18"
                break;
            case jsDate > new Date("2016-06-30"):
                season = "16/17"
                break;
            case jsDate > new Date("2015-06-30"):
                season = "15/16"
                break;
            case jsDate > new Date("2014-06-30"):
                season = "14/15"
                break;
            case jsDate > new Date("2013-06-30"):
                season = "13/14"
                break;
            case jsDate > new Date("2012-06-30"):
                season = "12/13"
                break;
            case jsDate > new Date("2011-06-30"):
                season = "11/12"
                break;
            case jsDate > new Date("2010-06-30"):
                season = "10/11"
                break;
            case jsDate > new Date("2009-06-30"):
                season = "09/10"
                break;
            case jsDate > new Date("2008-06-30"):
                season = "08/09"
                break;
            case jsDate > new Date("2007-06-30"):
                season = "07/08"
                break;
            case jsDate > new Date("2006-06-30"):
                season = "06/07"
                break;
            case jsDate > new Date("2005-06-30"):
                season = "05/06"
                break;
            default:
                break;
        }
        const dataJson = JSON.stringify({
            player_id: playerId,
            club_left: clubLeft,
            club_joined: clubJoined,
            type: type,
            fee: fee,
            date: date,
            season: season
           })
        var res
        try {
            res = await axios.post((process.env.baseURL || "http://localhost:3001") + '/api/test/addTransfer', dataJson, {
                headers: { 'Content-Type': 'application/json' }
            })
            if (res.data.status === 'ok') {
                alert("Dodanie transferu powiodło się.")
                setPlayerId("")
                setClubLeft("")
                setClubJoined("")
                setType("")
                setFee(0)
                setFormattedFee("0 €")
                setDate("")
                return res;
            }
        }
        catch (err) {
            alert("Błąd dodawania.")
            return [res,err];
        }
    }

    const addPlayer = async () => {
        const dataJson = JSON.stringify({
            name: name,
            surname: surname,
            known_as: knownAs,
            nationality: nationality,
            city_of_birth: cityOfBirth,
            date_of_birth: dateOfBirth,
            position: position,
            club: club,
            number: number,
            height: height,
            weight: weight
           })
        var res
        try {
            res = await axios.post((process.env.baseURL || "http://localhost:3001") + '/api/test/addPlayer', dataJson, {
                headers: { 'Content-Type': 'application/json' }
            })
            if (res.data.status === 'ok') {
                alert("Dodanie zawodnika powiodło się.")
                setName("")
                setSurname("")
                setKnownAs("")
                setNationality("")
                setCityOfBirth("")
                setDateOfBirth("")
                setPosition("")
                setClub("")
                setNumber("")
                setHeight("")
                setWeight("")
                return res;
            }
        }
        catch (err) {
            alert("Błąd dodawania.")
            return [res,err];
        }
    }

    const addClub = async () => {
        const dataJson = JSON.stringify({
            name: clubName,
            nation: nation,
            city: city,
            year_founded: yearFounded
           })
        var res
        try {
            res = await axios.post((process.env.baseURL || "http://localhost:3001") + '/api/test/addClub', dataJson, {
                headers: { 'Content-Type': 'application/json' }
            })
            if (res.data.status === 'ok') {
                alert("Dodanie klubu powiodło się.")
                setClubName("")
                setNation("")
                setCity("")
                setYearFounded("")
                return res;
            }
        }
        catch (err) {
            alert("Błąd dodawania.")
            return [res,err];
        }
    }

    const handleTransfer = (e) => {
        e.preventDefault();

        transferForm.validateAll();

        if (transferButton.context._errors.length === 0) {
            addTransfer().then(
                res => {
                    setMessageTr(res.data.message)
                    setSuccessfulTr(true)
                },
                err => {
                    const resMessage =
                        (err.response &&
                            err.response.data &&
                            err.response.data.message) ||
                        err.message ||
                        err.toString();

                    setMessageTr(resMessage)
                    setSuccessfulTr(false)
                }
            );
        }
        setTransferForm("")
        setSuccessfulTr(false)
        setMessageTr("")
        setTransferButton("")
    }

    const handlePlayer = (e) => {
        e.preventDefault();

        playerForm.validateAll();

        if (playerButton.context._errors.length === 0) {
            addPlayer().then(
                res => {
                    setMessagePl(res.data.message)
                    setSuccessfulPl(true)
                },
                err => {
                    const resMessage =
                        (err.response &&
                            err.response.data &&
                            err.response.data.message) ||
                        err.message ||
                        err.toString();

                    setMessagePl(resMessage)
                    setSuccessfulPl(false)
                }
            );
        }
        setPlayerForm("")
        setSuccessfulPl(false)
        setMessagePl("")
        setPlayerButton("")
    }

    const handleClub = (e) => {
        e.preventDefault();

        clubForm.validateAll();

        if (clubButton.context._errors.length === 0) {
            addClub().then(
                res => {
                    setMessageCl(res.data.message)
                    setSuccessfulCl(true)
                },
                err => {
                    const resMessage =
                        (err.response &&
                            err.response.data &&
                            err.response.data.message) ||
                        err.message ||
                        err.toString();

                    setMessageCl(resMessage)
                    setSuccessfulCl(false)
                }
            );
        }
        setClubForm("")
        setSuccessfulCl(false)
        setMessageCl("")
        setClubButton("")
    }


    useEffect(() => {
        componentDidMount()
        getPlayersNames()
        getClubsNames()
    }, [])

    return (
        <>
            {content === "Zawartość administratora." ? (
                <div className="container" style={{ padding: "3rem 0rem" }}>
                    <header className="jumbotron">
                        <h3>Panel administratora</h3>
                    </header>
                    <Tabs
                        defaultActiveKey="transfers"
                        transition={true}
                        id="noanim-tab-example"
                        className="mb-3"
                    >
                        <Tab eventKey="transfers" title="Dodaj transfer">
                            <Form
                                onSubmit={handleTransfer}
                                ref={c => {
                                    setTransferForm(c);
                                }}
                            >
                                <div>
                                    <div className="form-group">
                                        <label htmlFor="playerId">Zawodnik:</label>
                                        <Select
                                            className="form-control"
                                            name="playerId"
                                            id="playerId"
                                            value={playerId}
                                            onChange={(e) => { setPlayerId(e.target.value) }}
                                            validations={[required]}
                                        >
                                            
                                            <option key={""} value={""}>Wybierz...</option>
                                            {playersNamesArr.map((player) => (
                                                    <option key={player._id} value={player._id}>
                                                    { player.known_as === "" ? player.name + " " + player.surname : player.known_as }
                                                    </option>
                                                ))}
                                        </Select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="club_left">Z klubu:</label>
                                        <Select
                                            className="form-control"
                                            name="club_left"
                                            id="club_left"
                                            value={clubLeft}
                                            onChange={(e) => { setClubLeft(e.target.value) }}
                                            validations={[required]}
                                        >

                                            <option key={""} value={""}>Wybierz...</option>
                                            {clubsNamesArr.map((club) => (
                                                <option key={club.name} value={club.name}>
                                                    {club.name}
                                                </option>
                                            ))}
                                        </Select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="club_joined">Do klubu:</label>
                                        <Select
                                            className="form-control"
                                            name="club_joined"
                                            id="club_joined"
                                            value={clubJoined}
                                            onChange={(e) => { setClubJoined(e.target.value) }}
                                            validations={[required, vclub]}
                                        >

                                            <option key={""} value={""}>Wybierz...</option>
                                            {clubsNamesArr.map((club) => (
                                                <option key={club.name} value={club.name}>
                                                    {club.name}
                                                </option>
                                            ))}
                                        </Select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="type">Typ transferu:</label>
                                        <Select
                                            className="form-control"
                                            name="type"
                                            id="type"
                                            value={type}
                                            onChange={(e) => { setType(e.target.value) }}
                                            validations={[required]}
                                        >

                                            <option key={""} value={""}>Wybierz...</option>
                                            <option key={"transfer"} value={"transfer"}>Transfer</option>
                                            <option key={"wypożyczenie"} value={"wypożyczenie"}>Wypożyczenie</option>
                                        </Select>
                                    </div>


                                    <div className="form-group">
                                        <label htmlFor="fee">{"Kwota transferu (w €):"}</label>
                                        <CurrencyFormat
                                            className="form-control"
                                            name="fee"
                                            id="fee"
                                            value={formattedFee === "" ? "0 €" : formattedFee}
                                            thousandSeparator={true} 
                                            suffix={' €'}
                                            onValueChange={(values) => {
                                                const { formattedValue, value } = values;
                                                setFee(value)
                                                setFormattedFee(formattedValue )
                                            }}
                                        />
                                        {vfee()}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="date">Data transferu</label>
                                        <Input
                                            type="date"
                                            className="form-control"
                                            name="date"
                                            id="date"
                                            value={date}
                                            onChange={(e) => { setDate(e.target.value) }}
                                            validations={[required]}
                                            min="2005-07-01" 
                                            max="2023-06-30"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <button className="btn btn-primary btn-block">Prześlij do bazy</button>
                                    </div>
                                </div>

                                {messageTr && (
                                    <div className="form-group">
                                        <div
                                            className={
                                                successfulTr
                                                    ? "alert alert-success"
                                                    : "alert alert-danger"
                                            }
                                            role="alert"
                                        >
                                            {messageTr}
                                        </div>
                                    </div>
                                )}
                                <CheckButton
                                    style={{ display: "none" }}
                                    ref={c => {
                                        setTransferButton(c);
                                    }}
                                />
                            </Form>
                        </Tab>
                        <Tab eventKey="players" title="Dodaj zawodnika">
                            <Form
                                onSubmit={handlePlayer}
                                ref={c => {
                                    setPlayerForm(c);
                                }}
                            >
                                <div>
                                    <div className="form-group">
                                        <label htmlFor="name">Imię:</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            id="name"
                                            value={name}
                                            onChange={(e) => { setName(e.target.value)}}
                                            validations={[required]}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="surname">Nazwisko:</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="surname"
                                            id="surname"
                                            value={surname}
                                            onChange={(e) => { setSurname(e.target.value)}}
                                            validations={[required]}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="known_as">{"Znany jako (jeśli zawodnik nie ma pseudonimu zostaw pole puste!): "}</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="known_as"
                                            id="known_as"
                                            value={knownAs}
                                            onChange={(e) => { setKnownAs(e.target.value)}}
                                            validations={[]}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="nationality">Narodowość:</label>
                                        <Select
                                            className="form-control"
                                            name="nationality"
                                            id="nationality"
                                            value={nationality}
                                            onChange={(e) => { setNationality(e.target.value) }}
                                            validations={[required]}
                                        >

                                            <option key={""} value={""}>Wybierz...</option>
                                            {!!strAscendingCountryArr?.length &&
                                                strAscendingCountryArr.map(({ label, value }) => (
                                                    <option key={label} value={label}>
                                                        {label}
                                                    </option>
                                                ))}
                                        </Select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="city_of_birth">Miejsce urodzenia:</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="city_of_birth"
                                            id="city_of_birth"
                                            value={cityOfBirth}
                                            onChange={(e) => { setCityOfBirth(e.target.value) }}
                                            validations={[required]}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="date_of_birth">Data urodzenia:</label>
                                        <Input
                                            type="date"
                                            className="form-control"
                                            name="date_of_birth"
                                            id="date_of_birth"
                                            value={dateOfBirth}
                                            onChange={(e) => { setDateOfBirth(e.target.value) }}
                                            validations={[required]}
                                            min="1945-01-01"
                                            max="2008-12-31"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="position">Pozycja:</label>
                                        <Select
                                            className="form-control"
                                            name="position"
                                            id="position"
                                            value={position}
                                            onChange={(e) => { setPosition(e.target.value) }}
                                            validations={[required]}
                                        >
                                            <option key={""} value={""}>Wybierz...</option>
                                            <option key={"bramkarz"} value={"bramkarz"}>Bramkarz</option>
                                            <option key={"obrońca"} value={"obrońca"}>Obrońca</option>
                                            <option key={"pomocnik"} value={"pomocnik"}>Pomocnik</option>
                                            <option key={"napastnik"} value={"napastnik"}>Napastnik</option>
                                        </Select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="club">Klub</label>
                                        <Select
                                            className="form-control"
                                            name="club"
                                            id="club"
                                            value={club}
                                            onChange={(e) => { setClub(e.target.value) }}
                                            validations={[required]}
                                        >

                                            <option key={""} value={""}>Wybierz...</option>
                                            {clubsNamesArr.map((club) => (
                                                <option key={club.name} value={club.name}>
                                                    {club.name}
                                                </option>
                                            ))}
                                        </Select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="number">Numer na koszulce:</label>
                                        <Input
                                            type="number"
                                            className="form-control"
                                            name="number"
                                            id="number"
                                            value={number}
                                            onChange={(e) => { setNumber(e.target.value) }}
                                            validations={[required]}
                                            min="1"
                                            max="99"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="height">{"Wzrost (w cm):"}</label>
                                        <Input
                                            type="number"
                                            className="form-control"
                                            name="height"
                                            id="height"
                                            value={height}
                                            onChange={(e) => { setHeight(e.target.value) }}
                                            validations={[required]}
                                            min="140"
                                            max="230"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="weight">{"Waga (w kg):"}</label>
                                        <Input
                                            type="number"
                                            className="form-control"
                                            name="weight"
                                            id="weight"
                                            value={weight}
                                            onChange={(e) => { setWeight(e.target.value) }}
                                            validations={[required]}
                                            min="40"
                                            max="120"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <button className="btn btn-primary btn-block">Prześlij do bazy</button>
                                    </div>
                                </div>

                                {messagePl && (
                                    <div className="form-group">
                                        <div
                                            className={
                                                successfulPl
                                                    ? "alert alert-success"
                                                    : "alert alert-danger"
                                            }
                                            role="alert"
                                        >
                                            {messagePl}
                                        </div>
                                    </div>
                                )}
                                <CheckButton
                                    style={{ display: "none" }}
                                    ref={c => {
                                        setPlayerButton(c);
                                    }}
                                />
                            </Form>
                        </Tab>
                        <Tab eventKey="clubs" title="Dodaj klub">
                            <Form
                                onSubmit={handleClub}
                                ref={c => {
                                    setClubForm(c);
                                }}
                            >
                                <div>
                                    <div className="form-group">
                                        <label htmlFor="clubname">Nazwa klubu:</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="clubname"
                                            id="clubname"
                                            value={clubName}
                                            onChange={(e) => { setClubName(e.target.value) }}
                                            validations={[required]}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="nation">Kraj:</label>
                                        <Select
                                            className="form-control"
                                            name="nation"
                                            id="nation"
                                            value={nation}
                                            onChange={(e) => { setNation(e.target.value) }}
                                            validations={[required]}
                                        >

                                            <option key={""} value={""}>Wybierz...</option>
                                            {!!strAscendingCountryArr?.length &&
                                                strAscendingCountryArr.map(({ label, value }) => (
                                                    <option key={label} value={label}>
                                                        {label}
                                                    </option>
                                                ))}
                                        </Select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="city">Miasto:</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="city"
                                            id="city"
                                            value={city}
                                            onChange={(e) => { setCity(e.target.value) }}
                                            validations={[required]}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="year_founded">Rok założenia:</label>
                                        <Input
                                            type="number"
                                            className="form-control"
                                            name="year_founded"
                                            id="year_founded"
                                            value={yearFounded}
                                            onChange={(e) => { setYearFounded(e.target.value) }}
                                            validations={[required]}
                                            min="1857"
                                            max={currYear}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <button className="btn btn-primary btn-block">Prześlij do bazy</button>
                                    </div>
                                </div>

                                {messageCl && (
                                    <div className="form-group">
                                        <div
                                            className={
                                                successfulCl
                                                    ? "alert alert-success"
                                                    : "alert alert-danger"
                                            }
                                            role="alert"
                                        >
                                            {messageCl}
                                        </div>
                                    </div>
                                )}
                                <CheckButton
                                    style={{ display: "none" }}
                                    ref={c => {
                                        setClubButton(c);
                                    }}
                                />
                            </Form>
                        </Tab>
                    </Tabs>
                </div>
            ) : (
                <div className="container" style={{ padding: "3rem 0rem" }}>
                    <header className="jumbotron">
                        <h3>Brak dostępu do tej strony!</h3>
                    </header>
                </div>
            )}
        </>
    )
}
