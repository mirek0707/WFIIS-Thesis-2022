import { useState, useEffect, useReducer } from 'react'
import axios from 'axios'
import UserService from "../services/user_service";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Table from 'react-bootstrap/Table';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Pagination from 'react-bootstrap/Pagination';
import Col from 'react-bootstrap/Col';
import Moment from 'moment';
import countries from "i18n-iso-countries";
import CurrencyFormat from 'react-currency-format';
import ReactCountryFlag from "react-country-flag";
import plLocale from "i18n-iso-countries/langs/pl.json";

export default function ClubsComponent() {

    Moment.locale('pl')
    const [content, setContent] = useState()
    const [selectedSeason, setSelectedSeason] = useState("")
    const [transferArr, setTransferArr] = useState([])
    const [playersNamesArr, setPlayersNamesArr] = useState([])

    const selectSeasonHandler = (value) => setSelectedSeason(value)

    countries.registerLocale(plLocale);

    const countryObj = countries.getNames("pl", { select: "official" });

    const countryArr = Object.entries(countryObj).map(([key, value]) => {
        return {
            label: value,
            value: key
        };
    });

    const reducer = (state, action) => {
        switch (action.type) {
            case "setPageCount":
                return { ...state, pageCount: action.payload };
            case "setCurrentData":
                return { ...state, currentData: action.payload };
            case "setOffset":
                return { ...state, offset: action.payload };
            case "setActivePage":
                return { ...state, activePage: action.payload };
            case "updateData":
                return { ...state, data: action.payload };
            default:
                throw new Error();
        }
    };

   const initialState = {
        data: transferArr,
        offset: 0,
        numberPerPage: 20,
        pageCount: 0,
        currentData: [],
        activePage: 1
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        dispatch({
            type: "setCurrentData",
            payload: state.data.slice(
                state.offset,
                state.offset + state.numberPerPage
            )
        });
    }, [state.numberPerPage, state.offset, state.data]);

    function playerName(playerId) {
        const player = playersNamesArr.find(obj => {
            return obj._id === playerId;
        });
        return player.known_as === "" ? player.name + " " + player.surname : player.known_as;
    }

    const handleClick = (e) => {
        const clickValue = parseInt(e.target.getAttribute("data-page"), 10);
        dispatch({
            type: "setOffset",
            payload: (clickValue - 1) * state.numberPerPage
        });
        dispatch({
            type: "setActivePage",
            payload: clickValue
        });
        dispatch({
            type: "setPageCount",
            payload: Math.ceil(state.data.length / state.numberPerPage)
        });
    };

    const paginationItems = [];
    const amountPages = Math.ceil(state.data.length / state.numberPerPage);
    for (let number = 1; number <= amountPages; number++) {
        if (amountPages > 1) {
            paginationItems.push(
            <Pagination.Item
                key={number}
                active={number === state.activePage}
                data-page={number}
            >
                {number}
            </Pagination.Item>
        );
        }
    }

    function countryCode(id) {
        const player = playersNamesArr.find(obj => {
            return obj._id === id;
        });
        const codeByNation = countryArr.find(obj => {
            return obj.label === player.nationality;
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

    const getTransfersData = async () => {
        const dataJson = JSON.stringify({
            season: selectedSeason === "all" ? "" : selectedSeason
        })
        try {
            const res = await axios.post((process.env.baseURL || "http://localhost:3001") + '/api/test/getTransfers', dataJson, {
                headers: { 'Content-Type': 'application/json' }
            })
            if (res.data.status === 'ok') {
                setTransferArr(res.data.transfers)
                dispatch({
                    type: "updateData",
                    payload: res.data.transfers
                });
                dispatch({
                    type: "setOffset",
                    payload: 0
                });
                dispatch({
                    type: "setActivePage",
                    payload: 1
                });
                dispatch({
                    type: "setPageCount",
                    payload: 0
                });
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
        getPlayersNames()
        getTransfersData()
        console.log(state.data)
    }, [selectedSeason]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            {content === "Zawartość użytkownika." ? (
                <div className="container" style={{ padding: "3rem 0rem" }}>
                    <header className="jumbotron">
                        <h3>Transfery</h3>
                    </header>
                    <Col lg={3}>
                        <FloatingLabel controlId="floatingSelect" label="Sezon">
                            <Form.Select size="lg"
                                id="floatingSelect"
                                value={selectedSeason}
                                onChange={(e) => {
                                    selectSeasonHandler(e.target.value);
                                }}
                            >
                                <option key={"all"} value={"all"}>Wszystkie</option>
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
                                <th>Z klubu</th>
                                <th>Do klubu</th>
                                <th>Typ</th>
                                <th>Kwota</th>
                                <th>Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.currentData &&
                                state.currentData.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <ReactCountryFlag
                                                style={{
                                                    width: '1em',
                                                    height: '1em',
                                                }}
                                                countryCode={countryCode(item.player_id)}
                                                svg
                                                cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                                                cdnSuffix="svg"
                                                title={countryCode(item.player_id)}
                                            />
                                            {" "}{playerName(item.player_id)}
                                        </td>
                                        <td>{item.club_left}</td>
                                        <td>{item.club_joined}</td>
                                        <td>{item.type}</td>
                                        <CurrencyFormat value={item.fee} displayType={'text'} thousandSeparator={true} suffix={' €'} renderText={value => <td>{value}</td>} />
                                        <td>{Moment(item.date).format('DD.MM.YYYY')}</td>
                                    </tr>
                                ))}

                            
                            {/* {transferArr.map((transfer, i) =>  (
                                    <tr key={i}>
                                        <td>{playerName(transfer.player_id)}</td>
                                        <td>{transfer.club_left}</td>
                                        <td>{transfer.club_joined}</td>
                                        <td>{transfer.type}</td>
                                        <CurrencyFormat value={transfer.fee} displayType={'text'} thousandSeparator={true} suffix={' €'} renderText={value => <td>{value}</td>} />
                                        <td>{Moment(transfer.date).format('DD.MM.YYYY')}</td>
                                    </tr>
                                ))} */}
                        </tbody>
                    </Table>
                    <Pagination onClick={handleClick}>{paginationItems}</Pagination>
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
