import { useState, useEffect } from 'react'
import axios from 'axios'
import UserService from "../services/user_service";
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
import "./clubs_&_players_component.css";
import Moment from 'moment';
import CurrencyFormat from 'react-currency-format';

export default function ClubsComponent() {

    const [content, setContent] = useState()
    const [clubArr, setClubArr] = useState([])
    const [playerArr, setPlayerArr] = useState([])
    const [transferArr, setTransferArr] = useState([])
    const [selectedCountry, setSelectedCountry] = useState("")
    const [selectedSeason, setSelectedSeason] = useState("22/23")
    const [status, setStatus] = useState("")
    const [playersNamesArr, setPlayersNamesArr] = useState([])

    const selectCountryHandler = (value) => setSelectedCountry(value)
    const ButtonHandler = (value) => { setStatus(value); setSelectedSeason("22/23") }
    const selectSeasonHandler = (value) => setSelectedSeason(value)
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

    function countryCode(nation){
        const codeByNation = strAscendingCountryArr.find(obj => {
            return obj.label === nation;
        });
        return codeByNation.value;
    }

    function countryCodeForTransfer(id) {
        const player = playersNamesArr.find(obj => {
            return obj._id === id;
        });
        const codeByNation = countryArr.find(obj => {
            return obj.label === player.nationality;
        });
        return codeByNation.value;
    }

    function playerName(playerId) {
        const player = playersNamesArr.find(obj => {
            return obj._id === playerId;
        });
        return player.known_as === "" ? player.name + " " + player.surname : player.known_as;
    }

    function calculateGain(clubName) {
        let sum = 0
        transferArr.map((transfer) => {
            if (transfer.club_left === clubName) {
                sum += transfer.fee
            } else if (transfer.club_joined === clubName){
                sum -= transfer.fee
            } 
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

    const getClubsData = async () => {
        const foundByCountry = strAscendingCountryArr.find(obj => {
            return obj.value === selectedCountry;
        });
        const dataJson = JSON.stringify({
            nation: foundByCountry ? foundByCountry.label : "",
        })
        try {
            const res = await axios.post((process.env.baseURL || "http://localhost:3001") + '/api/test/getClubs', dataJson, {
                headers: { 'Content-Type': 'application/json' }
            })
            console.log(dataJson)
            console.log(strAscendingCountryArr)
            console.log(selectedCountry)
            console.log(status)
            if (res.data.status === 'ok') {
                setClubArr(res.data.clubs)
            }
        }
        catch (err) {
        }
    }

    const getPlayersFromClub = async () => {
        const dataJson = JSON.stringify({
            club: status === "" ? "" : status.name,
        })
        try {
            const res = await axios.post((process.env.baseURL || "http://localhost:3001") + '/api/test/getPlayersFromClub', dataJson, {
                headers: { 'Content-Type': 'application/json' }
            })
            console.log(dataJson)
            console.log(status)
            if (res.data.status === 'ok') {
                setPlayerArr(res.data.players)
            }
        }
        catch (err) {
        }
    }

    const getClubTransfers = async () => {
        const dataJson = JSON.stringify({
            club: status === "" ? "" : status.name,
            season: selectedSeason,
        })
        try {
            const res = await axios.post((process.env.baseURL || "http://localhost:3001") + '/api/test/getClubTransfers', dataJson, {
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

    useEffect(() => {
        componentDidMount()
        getClubsData()
    }, [selectedCountry]) // eslint-disable-line react-hooks/exhaustive-deps
    
    useEffect(() => {
        getPlayersFromClub()
        getPlayersNames()
    }, [status]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() =>{
        getClubTransfers()
    }, [selectedSeason, status]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            {content === "Zawartość użytkownika." ? (
                <div className="container">
                    {status === "" ? (
                        <>
                            <header className="jumbotron">
                                <h3>Kluby</h3>
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
                                    <FloatingLabel controlId="floatingSelect" label="Kraj">
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
                                {clubArr.map((club, i) => (
                                    <Col className="d-flex" key={i}>
                                        <Card key={club.name} style={{ width: '18rem' }}>
                                            <svg className="svgClubs" xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 1144.000000 1280.000000" preserveAspectRatio="xMidYMid meet" id="svgcontent" overflow="visible" x="1144" y="1280">
                                                <g transform="translate(0, 1280) scale(0.1, -0.1)" fill="#000000" stroke="none" id="svg_1" fillOpacity="1"><path d="M5040,12754 C3757,12711 2408,12510 950,12144 C687,12079 224,11955 120,11923 C103,11918 69,11822 83,11817 C88,11816 87,11739 81,11630 C40,10943 47,10173 101,9515 C162,8757 282,8018 461,7305 C509,7111 602,6771 620,6720 C625,6706 643,6648 660,6590 C706,6437 814,6115 872,5960 C1008,5596 1196,5156 1213,5167 C1219,5171 1220,5168 1215,5160 C1206,5146 1259,5028 1272,5036 C1276,5039 1277,5035 1274,5027 C1268,5009 1468,4608 1620,4335 C1855,3913 2164,3431 2440,3055 C3157,2080 4068,1181 5085,444 C5294,293 5639,60 5677,44 C5739,17 5790,39 5998,179 C6185,306 6465,506 6590,603 C7150,1038 7478,1328 7935,1791 C8622,2488 9159,3179 9649,3999 C10699,5752 11278,7742 11390,9979 C11418,10533 11388,11875 11348,11916 C11341,11922 10729,12075 10455,12138 C9379,12389 8282,12579 7451,12660 C7395,12666 7306,12674 7253,12679 C6689,12734 6359,12750 5720,12754 C5404,12756 5098,12756 5040,12754 zM2901,2523 C2914,2507 2913,2506 2898,2519 C2881,2532 2876,2540 2884,2540 C2886,2540 2894,2532 2901,2523 zM3021,2383 C3034,2367 3033,2366 3018,2379 C3001,2392 2996,2400 3004,2400 C3006,2400 3014,2392 3021,2383 zM3091,2303 C3104,2287 3103,2286 3088,2299 C3071,2312 3066,2320 3074,2320 C3076,2320 3084,2312 3091,2303 zM3170,2215 C3183,2201 3191,2190 3188,2190 C3186,2190 3173,2201 3160,2215 C3147,2229 3139,2240 3142,2240 C3144,2240 3157,2229 3170,2215 zM3286,2088 L3315,2055 L3283,2084 C3252,2112 3245,2120 3253,2120 C3255,2120 3269,2105 3286,2088 zM3450,1915 C3485,1879 3512,1850 3509,1850 C3507,1850 3475,1879 3440,1915 C3405,1951 3378,1980 3381,1980 C3383,1980 3415,1951 3450,1915 zM3780,1585 C3815,1549 3842,1520 3839,1520 C3837,1520 3805,1549 3770,1585 C3735,1621 3708,1650 3711,1650 C3713,1650 3745,1621 3780,1585 zM3950,1425 C3969,1406 3982,1390 3979,1390 C3976,1390 3959,1406 3940,1425 C3921,1444 3908,1460 3911,1460 C3914,1460 3931,1444 3950,1425 zM4080,1305 C4093,1291 4101,1280 4098,1280 C4096,1280 4083,1291 4070,1305 C4057,1319 4049,1330 4052,1330 C4054,1330 4067,1319 4080,1305 zM4261,1143 C4274,1127 4273,1126 4258,1139 C4248,1146 4240,1154 4240,1156 C4240,1164 4248,1159 4261,1143 zM4401,1023 C4414,1007 4413,1006 4398,1019 C4388,1026 4380,1034 4380,1036 C4380,1044 4388,1039 4401,1023 z" id="svg_2" fill="#7f7f7f"></path></g>
                                            </svg>
                                            {/* <svg class="bd-placeholder-img rounded-circle" width="180" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 140x140" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#777"></rect></svg> */}
                                            <Card.Body>
                                                <Card.Title>{club.name}</Card.Title>
                                                <Card.Text>
                                                    <ReactCountryFlag
                                                        style={{
                                                            width: '1em',
                                                            height: '1em',
                                                        }}
                                                        countryCode={countryCode(club.nation)}
                                                        svg
                                                        cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                                                        cdnSuffix="svg"
                                                        title={countryCode(club.nation)}
                                                    />
                                                    {" "}{club.nation}, {club.city}
                                                </Card.Text>
                                                <div className="d-grid gap-2">
                                                    <Button variant="success" key={club.name} onClick={() => { ButtonHandler(club) }} >
                                                        Profil klubu
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
                                        <h3>{status.name}</h3>
                                    </Col>
                                    <Col className="d-flex justify-content-end">
                                        <Button variant="success" onClick={() => { ButtonHandler("") }} >
                                            Wróć do wszystkich klubów
                                        </Button>
                                    </Col>
                                </Row>
                                <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 1144.000000 1280.000000" preserveAspectRatio="xMidYMid meet" id="svgcontent" overflow="visible" x="1144" y="1280">
                                    <g transform="translate(0, 1280) scale(0.1, -0.1)" fill="#000000" stroke="none" id="svg_1" fillOpacity="1"><path d="M5040,12754 C3757,12711 2408,12510 950,12144 C687,12079 224,11955 120,11923 C103,11918 69,11822 83,11817 C88,11816 87,11739 81,11630 C40,10943 47,10173 101,9515 C162,8757 282,8018 461,7305 C509,7111 602,6771 620,6720 C625,6706 643,6648 660,6590 C706,6437 814,6115 872,5960 C1008,5596 1196,5156 1213,5167 C1219,5171 1220,5168 1215,5160 C1206,5146 1259,5028 1272,5036 C1276,5039 1277,5035 1274,5027 C1268,5009 1468,4608 1620,4335 C1855,3913 2164,3431 2440,3055 C3157,2080 4068,1181 5085,444 C5294,293 5639,60 5677,44 C5739,17 5790,39 5998,179 C6185,306 6465,506 6590,603 C7150,1038 7478,1328 7935,1791 C8622,2488 9159,3179 9649,3999 C10699,5752 11278,7742 11390,9979 C11418,10533 11388,11875 11348,11916 C11341,11922 10729,12075 10455,12138 C9379,12389 8282,12579 7451,12660 C7395,12666 7306,12674 7253,12679 C6689,12734 6359,12750 5720,12754 C5404,12756 5098,12756 5040,12754 zM2901,2523 C2914,2507 2913,2506 2898,2519 C2881,2532 2876,2540 2884,2540 C2886,2540 2894,2532 2901,2523 zM3021,2383 C3034,2367 3033,2366 3018,2379 C3001,2392 2996,2400 3004,2400 C3006,2400 3014,2392 3021,2383 zM3091,2303 C3104,2287 3103,2286 3088,2299 C3071,2312 3066,2320 3074,2320 C3076,2320 3084,2312 3091,2303 zM3170,2215 C3183,2201 3191,2190 3188,2190 C3186,2190 3173,2201 3160,2215 C3147,2229 3139,2240 3142,2240 C3144,2240 3157,2229 3170,2215 zM3286,2088 L3315,2055 L3283,2084 C3252,2112 3245,2120 3253,2120 C3255,2120 3269,2105 3286,2088 zM3450,1915 C3485,1879 3512,1850 3509,1850 C3507,1850 3475,1879 3440,1915 C3405,1951 3378,1980 3381,1980 C3383,1980 3415,1951 3450,1915 zM3780,1585 C3815,1549 3842,1520 3839,1520 C3837,1520 3805,1549 3770,1585 C3735,1621 3708,1650 3711,1650 C3713,1650 3745,1621 3780,1585 zM3950,1425 C3969,1406 3982,1390 3979,1390 C3976,1390 3959,1406 3940,1425 C3921,1444 3908,1460 3911,1460 C3914,1460 3931,1444 3950,1425 zM4080,1305 C4093,1291 4101,1280 4098,1280 C4096,1280 4083,1291 4070,1305 C4057,1319 4049,1330 4052,1330 C4054,1330 4067,1319 4080,1305 zM4261,1143 C4274,1127 4273,1126 4258,1139 C4248,1146 4240,1154 4240,1156 C4240,1164 4248,1159 4261,1143 zM4401,1023 C4414,1007 4413,1006 4398,1019 C4388,1026 4380,1034 4380,1036 C4380,1044 4388,1039 4401,1023 z" id="svg_2" fill="#7f7f7f"></path></g>
                                </svg>
                            </header>
                            <p>
                                <strong>Kraj:</strong>{" "}
                                    <ReactCountryFlag
                                        style={{
                                            width: '1.2em',
                                            height: '1.2em',
                                        }}
                                        countryCode={countryCode(status.nation)}
                                        svg
                                        cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                                        cdnSuffix="svg"
                                        title={countryCode(status.nation)}
                                    />
                                {" "}{status.nation}
                            </p>
                            <p>
                                <strong>Miasto:</strong>{" "}
                                {status.city}
                            </p>
                            <p>
                                <strong>Rok założenia:</strong>{" "}
                                {status.year_founded}
                            </p>

                            <Tabs
                                defaultActiveKey="players"
                                transition={true}
                                id="noanim-tab-example"
                                className="mb-3"
                            >
                                <Tab eventKey="players" title="Zawodnicy klubu">
                                    <Row lg={4}>
                                        {playerArr.map((player, i) => (
                                            <Col className="d-flex" key={i}>
                                                <Card key={player._id} style={{ width: '18rem', height: '19rem' }}>
                                                    <img
                                                        className="imgPlayers"
                                                        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                                                        alt="player-img"
                                                        width="180"
                                                        height="180"
                                                    />
                                                    <Card.Body>
                                                        <Card.Title>{player.number}. {player.known_as === "" ? player.name + " " + player.surname : player.known_as}</Card.Title>
                                                        <Card.Text>
                                                            {player.position}{", "} 
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
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                </Tab>
                                <Tab eventKey="transfers" title="Transfery klubu">
                                    <Col lg={3}>
                                        <FloatingLabel controlId="floatingSelect" label="Sezon">
                                            <Form.Select size="lg"
                                                id="floatingSelect"
                                                value={selectedSeason}
                                                onChange={(e) => {
                                                    selectSeasonHandler(e.target.value);
                                                }}
                                            >
                                                <option key={"22/23"} value={"22/23"}>22/23</option>
                                                <option key={"21/22"} value={"21/22"}>21/22</option>
                                                <option key={"20/21"} value={"20/21"}>20/21</option>
                                                <option key={"19/20"} value={"19/20"}>19/20</option>
                                                <option key={"18/19"} value={"18/19"}>18/19</option>
                                                <option key={"17/18"} value={"17/18"}>17/18</option>
                                                <option key={"16/17"} value={"16/17"}>16/17</option>
                                                <option key={"15/16"} value={"15/16"}>15/16</option>
                                                <option key={"14/15"} value={"14/15"}>14/15</option>
                                                <option key={"13/14"} value={"13/14"}>13/14</option>
                                                <option key={"12/13"} value={"12/13"}>12/13</option>
                                                <option key={"11/12"} value={"11/12"}>11/12</option>
                                                <option key={"10/11"} value={"10/11"}>10/11</option>
                                                <option key={"09/10"} value={"09/10"}>09/10</option>
                                                <option key={"08/09"} value={"08/09"}>08/09</option>
                                                <option key={"07/08"} value={"07/08"}>07/08</option>
                                                <option key={"06/07"} value={"06/07"}>06/07</option>
                                                <option key={"05/06"} value={"05/06"}>05/06</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Table striped bordered hover size="sm">
                                        <thead>
                                            <tr>
                                                <th>Zawodnik</th>
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
                                                    <td>
                                                        <ReactCountryFlag
                                                            style={{
                                                                width: '1em',
                                                                height: '1em',
                                                            }}
                                                            countryCode={countryCodeForTransfer(transfer.player_id)}
                                                            svg
                                                            cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                                                            cdnSuffix="svg"
                                                            title={countryCodeForTransfer(transfer.player_id)}
                                                        />
                                                        {" "}{playerName(transfer.player_id)}
                                                    </td>
                                                    <td>{Moment(transfer.date).format('DD.MM.YYYY')}</td>
                                                    <td>{transfer.club_left}</td>
                                                    <td>{transfer.club_joined}</td>
                                                    <td>{transfer.type}</td>
                                                    <CurrencyFormat value={transfer.fee} displayType={'text'} thousandSeparator={true} suffix={' €'} renderText={value => <td style={transfer.club_left === status.name ? { color: "#198754" } : { color: "#dc3545" }}>{value}</td>} />
                                                </tr>
                                            ))}
                                            <tr>
                                                <CurrencyFormat value={calculateGain(status.name)} displayType={'text'} thousandSeparator={true} suffix={' €'} renderText={value => <td align="right" colSpan={6}><b>Łączny </b><b style={{ color: "#198754" }} >zysk</b><b>/</b><b style={{ color: "#dc3545" }}>strata</b><b> w sezonie {selectedSeason}: </b><b style={calculateGain(status.name) >= 0 ? { color: "#198754" } : { color: "#dc3545"}}>{value}</b></td>} />
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Tab>
                            </Tabs>
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
