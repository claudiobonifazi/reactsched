import React from 'react';
import PropTypes from 'prop-types';

import "./Scheduler.css";
import SchedulerColumn from "./SchedulerColumn.js";

class Scheduler extends React.Component {

    static defaultProps = {
        leftColWidth: 50,
        startMin: 0,
        endMin: 24 * 60,
        stepMin: 30,
        eventMinDuration: 15,
        resizeSnap: false,
        heightPx: window.innerHeight,
        stepHeightPx: 24,
        columns: [
            {
                id: 1,
                name: "ciao1"
            },
            {
                id: 2,
                name: "ciao2"
            }
        ],
        bgColor: "#fff",
        horLineColor: "rgba(0,0,0,0.1)",
        events: [
            {
                id: 1,
                title: "ciaociao",
                text: "bla blabl balblab lab",
                dateStart: "2020-12-13 16:15:00",
                dateEnd: "2020-12-13 17:45:00",
                idColumn: 1
            }
        ]
    };

    static propTypes = {
        leftColWidth: PropTypes.number,
        startMin: PropTypes.number,
        endMin: PropTypes.number,
        stepMin: PropTypes.number,
        eventMinDuration: PropTypes.number,
        resizeSnap: PropTypes.bool,
        heightPx: PropTypes.number,
        stepHeightPx: PropTypes.number,
        columns: PropTypes.array,
        bgColor: PropTypes.string,
        horLineColor: PropTypes.string
    };

    state = {
        selectedDay: new Date(),
        events: [],
        view: "day", // "day", "week", "month", "year"

        error: ""
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.events !== prevState.events) {
            return { events: nextProps.events };
        } else {
            return null;
        }
    }

    render() {
        let html = (
            <div className="rs_container" style={this.functionalCSS()}>
                <div className="rs_leftCol">
                    {this.leftColumn()}
                </div>
                <div className="rs_columns">
                    {this.props.columns.map((c, i) => {
                        let e = this.filterEvents(c.id);
                        return <SchedulerColumn key={i}
                            {...c}
                            events={e}
                            onEventResize={this.onEventResize.bind(this)}
                            onEventDrag={this.onEventDrag.bind(this)}
                        />
                    })}
                </div>
            </div>
        );
        return html;
    }


    functionalCSS() {
        return {
            '--height': this.props.heightPx + "px",
            '--leftcol-w': this.props.leftColWidth + 'px',
            '--step-h': this.props.stepHeightPx + 'px',
            '--step-min': this.props.stepMin,
            '--colnum': this.props.columns.length,
            '--bgcol': this.props.bgColor,
            '--linecol': this.props.horLineColor
        };
    }

    leftColumn() {
        let min = [];
        for (let i = this.props.startMin; i < this.props.endMin; i += this.props.stepMin) {
            min.push(i);
        }
        return min.map((m, i) =>
            <div className="rs_leftColCell" key={i}>
                {Scheduler.minToTime(m)}
            </div>);
    }

    static minToTime(m) {
        return (Math.floor(m / 60) + '').padStart(2, '0')
            + ':'
            + ((m % 60) + '').padStart(2, '0');
    }

    filterEvents(idColumn) {
        return this.state.events.filter(e =>
            e.idColumn === idColumn
            &&
            Scheduler.isSameDay(this.state.selectedDay, e.dateStart)
        );
    }

    static isSameDay(d1, d2) {
        let dd1 = new Date(d1);
        let dd2 = new Date(d2);
        return dd1.getDay() === dd2.getDay()
            && dd1.getMonth() === dd2.getMonth()
            && dd1.getFullYear() === dd2.getFullYear();
    }

    static minDiff(date1, date2) {
        let d1 = new Date(date1);
        let d2 = new Date(date2);
        let diffTime = Math.abs(d2 - d1);
        return diffTime / (1000 * 60);
    }

    onEventResize(event, px) {
        let el = this.state.events.find(ev => ev.id === event.props.id);
        if (el) {
            let newDateEnd = new Date(el.dateEnd);
            let min = this.props.stepMin * (px / this.props.stepHeightPx);
            newDateEnd = new Date(newDateEnd.getTime() + min * 60 * 1000);
            newDateEnd = newDateEnd.toISOString();
            let newDuration = Scheduler.minDiff(newDateEnd, el.dateStart);
            if (newDuration >= this.props.eventMinDuration) {
                if (newDuration === this.props.eventMinDuration && px < 0) {
                    return;
                }
                this.updateEvent(event.props.id, { dateEnd: newDateEnd });
            }
        }
    }

    onEventDrag(event, em, px) {
        let values = {};
        let el = this.state.events.find(ev => ev.id === event.props.id);
        if (el) {
            let path = em.path || em.composedPath();
            for (let i in path) {
                if (path.hasOwnProperty(i) && path[i].classList) {
                    if (path[i].classList.contains('rsc_column')) {
                        let idColumn = parseInt(path[i].dataset.id);
                        if (idColumn && event.idColumn !== idColumn) {
                            values.idColumn = idColumn;
                        }
                        break;
                    }
                }
            }
            let min = this.props.stepMin * (px / this.props.stepHeightPx);
            let newDateStart = new Date(el.dateStart);
            newDateStart = new Date(newDateStart.getTime() + min * 60 * 1000);
            newDateStart = newDateStart.toISOString();
            let newDateEnd = new Date(el.dateEnd);
            newDateEnd = new Date(newDateEnd.getTime() + min * 60 * 1000);
            newDateEnd = newDateEnd.toISOString();
            values.dateStart = newDateStart;
            values.dateEnd = newDateEnd;
            this.updateEvent(event.props.id, values);
        }
    }

    updateEvent(id, values) {
        this.setState({
            events: this.state.events.map(ev => {
                if (ev.id === id) {
                    for (let field in values) {
                        ev[field] = values[field];
                    }
                }
                return ev;
            })
        }, () => {
            if (typeof this.props.onEventChanged === 'function') {
                this.props.onEventChanged.apply(this, [id.values]);
            }
        });
    }

    get events() {
        return this.state.events;
    }

    set events(events) {
        if (Array.isArray(events)) {
            this.setState({
                events: events
            });
        } else {
            console.error("Scheduler.events must be an array")
        }
    }
}


export default Scheduler;