import React, { useState } from 'react'
import { useEffect } from 'react';
import '../CSS/LandingPage.css'
export default function LandingPage(props) {
    const message400 = "Check inputs";
    const message500 = "Contact programmer,tell him probably backend problem"
    const [nameState, setnameState] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [results, setResults] = useState();
    const [errorFromResponse, setErrorFromResponse] = useState("");
    const [isAlreadyLoaded, setIsAlreadyLoaded] = useState(false)
    const [checkDateOfBirth, setCheckDateOfBirth] = useState(true)
    const baseURL = "http://localhost:8080";
    const fetchRelationshipURL = baseURL + "/calculate";
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "name": nameState, "dateOfBirth": dateOfBirth })
    };
    const calculate = () => {
        setResults("")
        setErrorFromResponse("")
        fetch(fetchRelationshipURL, requestOptions).then(response => {
            let ans = response;
            console.log(ans);
            console.log(response?.status)

            if (!response.ok) throw new Error(response.status)
            return response.json()

        }
        ).then(response => setResults(response)).catch(error => {
            error = error.toString()
            if (error.search(/400/) !== -1) setErrorFromResponse("400")
            if (error.search(/500/) !== -1) setErrorFromResponse("500")
        })
        console.log(results)
        console.log("error:" + errorFromResponse)
    }
    const processDOB = (dob) => {
        return dob.substring(0, 2) + "/" + dob.substring(2, 4) + "/" + dob.substring(4);
    }
    var namePattern = /^[A-Za-z]+$/;
    var dateOfBirthPattern = /^[0-9]+$/;
    const nameChange = (e) => {
        //console.log(e.target.value.match(namePattern));

        if (namePattern.test(e.target.value) || e.target.value === "") setnameState(e.target.value)
    }
    const onEnter = (e) => {
        if (e.key === 'Enter') {
            console.log("Enter is pressed in name!");
            calculate()
        }
    }
    const dateOfBirthChange = (e) => {
        if (e.target.value.toString().length > 8) return
        if (dateOfBirthPattern.test(e.target.value) || e.target.value === "") setDateOfBirth(e.target.value)
    }
    useEffect(() => {
        if (errorFromResponse !== undefined && errorFromResponse !== "") {
            console.log("Error has occured why???")
            console.log(errorFromResponse);
            var message = ""
            if (errorFromResponse === "400") message = message400;
            if (errorFromResponse === "500") message = message500;
            console.log(message);
            alert(message)
        }
    }, [errorFromResponse])

    useEffect(() => {
        console.log("results from useEffect for isLoaded: ");
        console.log(results);
        if (results?.name === nameState.toUpperCase() && results?.dateOfBirth === dateOfBirth) setIsAlreadyLoaded(true);
        else setIsAlreadyLoaded(false);
    }, [nameState, dateOfBirth, results])

    useEffect(() => {
        console.log("isAlreadyLoaded: " + isAlreadyLoaded);
    }, [isAlreadyLoaded])
    useEffect(() => {
        if (dateOfBirth.length === 8) setCheckDateOfBirth(false)
        else setCheckDateOfBirth(true)
    }, [dateOfBirth])

    return <div style={{backgroundColor:"#F8E5E5"}}>
        <div className="App">
            <div style={{fontSize:"5vh",fontWeight:'bold'}}>Numerology</div>
            <div><input className='input' value={dateOfBirth} onChange={dateOfBirthChange} id='dateOfBirth' placeholder='Date of birth in 8 digits' /></div>
            <div><input value={nameState} onKeyPress={onEnter} onChange={nameChange} id='name' placeholder='Enter your name' /></div>
            <div><button disabled={isAlreadyLoaded} onClick={calculate}>calculate</button></div>
            <span style={{ color: "red" }}>{checkDateOfBirth ? "Please enter date of birth in 8 digit format" : ""}</span>
        </div>

        {
            results !== undefined && results !== null && results !== "" ?
                <div className='results-basic'>
                    <div className='results-basic-inner-grid'>
                        <div>Name: </div>
                        <div>{results?.name}</div>
                    </div>
                    <div className='results-basic-inner-grid'>
                        <div>Life Number: </div>
                        <div><span style={{color:"red"}}>{results?.lifeNumbers?.lnNminusOne}</span> - <span>{results?.lifeNumbers?.ln}</span></div>
                    </div>
                    <div className='results-basic-inner-grid'>
                        <div>Hebrew Number: </div>
                        <div><span style={{color:"red"}}>{results?.hebrewNumbers?.hebrewNminusOne}</span> - <span>{results?.hebrewNumbers?.hebrewN}</span></div>
                    </div>
                    <div className='results-basic-inner-grid'>
                        <div>Date of birth: </div>
                        <div>{processDOB(results?.dateOfBirth)}</div>
                    </div>
                    
                    <div className='results-basic-inner-grid'>
                        <div>Destiny Number: </div>
                        <div>{results.destiny}</div>
                    </div>
                    <div className='results-basic-inner-grid'>
                        <div>Birth Number: </div>
                        <div>{results.birthNumber}</div>
                    </div>

                    
                </div>



                : null
        }



        {results !== undefined && results !== null && results !== "" ? <div class="grid-container">
            <div class="grid-item"></div>
            <div class="grid-item">
                <div className='grid-inner-item'>
                    <div className="grid-inner-item-name">
                        Destiny
                    </div>

                    <div className="grid-inner-item-value">{results.destiny}</div>
                </div>
            </div>
            <div class="grid-item">
                <div className='grid-inner-item'>
                    <div className="grid-inner-item-name">
                        Birth Number
                    </div>

                    <div className="grid-inner-item-value">{results.birthNumber}</div>
                </div>
            </div>
            <div class="grid-item">
                <div className='grid-inner-item'>
                    <div className="grid-inner-item-name">
                        Hebrew Number
                    </div>

                    <div className="grid-inner-item-value">{results?.hebrewNumbers?.hebrewN}</div>
                </div>
            </div>
            <div class="grid-item">{results.relationship.dtoH}</div>
            <div class="grid-item">{results.relationship.btoH}</div>
            <div class="grid-item">
                <div className='grid-inner-item'>
                    <div className="grid-inner-item-name">
                        Life Number
                    </div>

                    <div className="grid-inner-item-value">{results?.lifeNumbers?.ln}</div>
                </div>
            </div>
            <div class="grid-item"> {results.relationship.dtoL}</div>
            <div class="grid-item"> {results.relationship.btoL}</div>
        </div> : null}



    </div>;
};