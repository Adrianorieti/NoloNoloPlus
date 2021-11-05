import React from 'react';
import Helmet from 'react-helmet';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import './style/RangeDaysPicker.css';



export default class Example extends React.Component {
    static defaultProps = {
        numberOfMonths: 1,
    };

    constructor(props) {
        super(props);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.handleResetClick = this.handleResetClick.bind(this);
        this.state = this.getInitialState();
    }

    getInitialState() {
        return {
            from: undefined,
            to: undefined,
        };
    }

    handleDayClick(day) {
        const range = DateUtils.addDayToRange(day, this.state);
        this.setState(range);
    }

    handleResetClick() {
        this.setState(this.getInitialState());
    }

    render() {
        const { from, to } = this.state;
        const modifiers = { start: from, end: to };
        return (
            <div className="RangeExample container-properties">
                <p>
                    {!from && !to && 'Please select the first day.'}
                    {from && !to && 'Please select the last day.'}
                    {from &&
                        to &&
                        `Selected from ${from.toLocaleDateString()} to
                    ${to.toLocaleDateString()}`}{' '}
                    {from && to && (
                        <button className="link" onClick={this.handleResetClick}>
                            Reset
                        </button>
                    )}
                    <p id="fromDate" hidden="true">
                        {!from && `${from}`}
                        {from && `${from.toLocaleDateString()}`}
                    </p>
                    <p id="toDate" hidden="true">
                        {!to && `${to}`}
                        {to && `${to.toLocaleDateString()}`}
                    </p>
                </p>
                <DayPicker
                    className="Selectable"
                    numberOfMonths={this.props.numberOfMonths}
                    selectedDays={[from, { from, to }]}
                    modifiers={modifiers}
                    onDayClick={this.handleDayClick}
                />
            </div>
        );
    }
}
