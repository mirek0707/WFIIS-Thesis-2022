import { useState, useEffect } from 'react'
import axios from 'axios'
import UserService from "../services/user_service";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from "react-bootstrap/Form";
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import countries from "i18n-iso-countries";
import ReactCountryFlag from "react-country-flag";
import enLocale from "i18n-iso-countries/langs/en.json";
import plLocale from "i18n-iso-countries/langs/pl.json";
import "./clubs_component.css";

export default function BoardUser() {

    const [content, setContent] = useState()
    const [clubArr, setClubArr] = useState([])
    const [selectedCountry, setSelectedCountry] = useState("")

    const selectCountryHandler = (value) => setSelectedCountry(value)
    countries.registerLocale(enLocale);
    countries.registerLocale(plLocale);

    const countryObj = countries.getNames("pl", { select: "official" });

    const countryArr = Object.entries(countryObj).map(([key, value]) => {
        return {
            label: value,
            value: key
        };
    });
    const strAscending = [...countryArr].sort((a, b) =>
        a.label > b.label ? 1 : -1
    );

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
        const found = strAscending.find(obj => {
            return obj.value === selectedCountry;
        });
        const dataJson = JSON.stringify({
            nation: found ? found.label : "",
        })
        try {
            const res = await axios.post((process.env.baseURL || "http://localhost:3001") + '/api/test/getClubs', dataJson, {
                headers: { 'Content-Type': 'application/json' }
            })
            console.log(dataJson)
            console.log(strAscending)
            console.log(selectedCountry)
            if (res.data.status === 'ok') {
                setClubArr(res.data.clubs)
            }
        }
        catch (err) {
        }
    }

    useEffect(() => {
        getClubsData()
    }, [selectedCountry]) // eslint-disable-line react-hooks/exhaustive-deps
    
    return (
        <>
            {componentDidMount()}
            {content === "Zawartość użytkownika." ? (
                <div className="container">
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
                                    id= "floatingSelect"
                                    value={selectedCountry}
                                    onChange={(e) => {
                                        selectCountryHandler(e.target.value);
                                    }}
                                >
                                    <option key={"all"} value={"all"}>Wszystkie</option>
                                    {!!strAscending?.length &&
                                        strAscending.map(({ label, value }) => (
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
                            <Col className="d-flex">
                                <Card key={club.name} style={{width: '18rem'}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 1144.000000 1280.000000" preserveAspectRatio="xMidYMid meet" id="svgcontent" overflow="visible" x="1144" y="1280">
                                    <g transform="translate(0, 1280) scale(0.1, -0.1)" fill="#000000" stroke="none" id="svg_1" fill-opacity="1"><path d="M5040,12754 C3757,12711 2408,12510 950,12144 C687,12079 224,11955 120,11923 C103,11918 69,11822 83,11817 C88,11816 87,11739 81,11630 C40,10943 47,10173 101,9515 C162,8757 282,8018 461,7305 C509,7111 602,6771 620,6720 C625,6706 643,6648 660,6590 C706,6437 814,6115 872,5960 C1008,5596 1196,5156 1213,5167 C1219,5171 1220,5168 1215,5160 C1206,5146 1259,5028 1272,5036 C1276,5039 1277,5035 1274,5027 C1268,5009 1468,4608 1620,4335 C1855,3913 2164,3431 2440,3055 C3157,2080 4068,1181 5085,444 C5294,293 5639,60 5677,44 C5739,17 5790,39 5998,179 C6185,306 6465,506 6590,603 C7150,1038 7478,1328 7935,1791 C8622,2488 9159,3179 9649,3999 C10699,5752 11278,7742 11390,9979 C11418,10533 11388,11875 11348,11916 C11341,11922 10729,12075 10455,12138 C9379,12389 8282,12579 7451,12660 C7395,12666 7306,12674 7253,12679 C6689,12734 6359,12750 5720,12754 C5404,12756 5098,12756 5040,12754 zM2901,2523 C2914,2507 2913,2506 2898,2519 C2881,2532 2876,2540 2884,2540 C2886,2540 2894,2532 2901,2523 zM3021,2383 C3034,2367 3033,2366 3018,2379 C3001,2392 2996,2400 3004,2400 C3006,2400 3014,2392 3021,2383 zM3091,2303 C3104,2287 3103,2286 3088,2299 C3071,2312 3066,2320 3074,2320 C3076,2320 3084,2312 3091,2303 zM3170,2215 C3183,2201 3191,2190 3188,2190 C3186,2190 3173,2201 3160,2215 C3147,2229 3139,2240 3142,2240 C3144,2240 3157,2229 3170,2215 zM3286,2088 L3315,2055 L3283,2084 C3252,2112 3245,2120 3253,2120 C3255,2120 3269,2105 3286,2088 zM3450,1915 C3485,1879 3512,1850 3509,1850 C3507,1850 3475,1879 3440,1915 C3405,1951 3378,1980 3381,1980 C3383,1980 3415,1951 3450,1915 zM3780,1585 C3815,1549 3842,1520 3839,1520 C3837,1520 3805,1549 3770,1585 C3735,1621 3708,1650 3711,1650 C3713,1650 3745,1621 3780,1585 zM3950,1425 C3969,1406 3982,1390 3979,1390 C3976,1390 3959,1406 3940,1425 C3921,1444 3908,1460 3911,1460 C3914,1460 3931,1444 3950,1425 zM4080,1305 C4093,1291 4101,1280 4098,1280 C4096,1280 4083,1291 4070,1305 C4057,1319 4049,1330 4052,1330 C4054,1330 4067,1319 4080,1305 zM4261,1143 C4274,1127 4273,1126 4258,1139 C4248,1146 4240,1154 4240,1156 C4240,1164 4248,1159 4261,1143 zM4401,1023 C4414,1007 4413,1006 4398,1019 C4388,1026 4380,1034 4380,1036 C4380,1044 4388,1039 4401,1023 z" id="svg_2" fill="#7f7f7f"></path></g>
                                    </svg>
                                    {/* <svg class="bd-placeholder-img rounded-circle" width="180" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 140x140" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#777"></rect></svg> */}
                                    <Card.Body>
                                        <Card.Title>{club.name}</Card.Title>
                                        <Card.Text>
                                            {club.nation}, {club.city}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            ):(
                <div className="container">
                    <header className = "jumbotron">
                        <h3>Brak dostępu do tej strony!</h3>
                    </header >
                </div>
            )}
        </>
    )
    
}
