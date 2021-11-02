import React from "react";
import { useHistory } from "react-router";
import RangeDaysPicker from "../components/RangeDaysPicker"

export default function ModifyReservation(props) {
    let history = useHistory();

    function submit(event) {
        event.preventDefault();
        let newStartingDate = document.querySelector("#fromDate").innerHTML;
        let newEndingDate = document.querySelector("#toDate").innerHTML;
        let obj = ``;
    }

    return (
        <main>
            <form>
                <h2>Le vecchie date sono {props.res}</h2>
                <fieldset>
                    <legend>Renting dates inputs</legend>
                    <section >
                        <RangeDaysPicker />
                    </section>
                </fieldset>
                <button id="rentFormButton" type="button" className="btn btn-success" onClick={submit}>Click to submit</button>
            </form>
        </main>
    )
}