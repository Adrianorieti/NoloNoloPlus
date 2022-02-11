import React, { useState } from "react";
import html2pdf from 'html2pdf.js'
import './style/Invoice.css'

export default function Invoice(props) {

    function createPdf() {
        const invoice = document.querySelector('#invoice');
        let opt = {
            margin: 1,
            filename: 'my-invoice.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(invoice).save();
    }


    return (
        <div>
            <div id="invoice">
                <div >
                    <i className="fa fa-renren fa-3x" />
                    <br />
                    <i>
                        NoloNoloPlus
                        <br />
                        Progetto Tecnologie Web
                        <br />
                        Si pagah sempre
                    </i>
                </div>
                <div >
                    <b>Date: </b> {(() => { let end = new Date(props.res.end); return end.toDateString() })()}
                    <br />
                    <b>Invoiced to</b>: <br />
                    {props.user.name} {props.user.surname}
                    <br />
                    {props.user.email}
                    <br />
                    {props.user.city}
                    <br />
                    {props.user.address}, {props.user.cap}

                </div>
                <div className="table-cst ">
                    <table>
                        <thead>
                            <tr>
                                <th>Object</th>
                                <th>Period</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{props.res.product}</td>
                                <td>{(() => { let end = new Date(props.res.end); let start = new Date(props.res.start); return (start.toDateString() + ' - ' + end.toDateString()) })()}</td>
                                <td>{props.res.expense}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div >
            <button className="btn btn-success" onClick={(() => { createPdf(); })}>Download PDF</button>
        </div>
    )
}