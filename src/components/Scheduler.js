import React from 'react';
import PropTypes from 'prop-types';

import "./Scheduler.css";
import SchedulerColumn from "./SchedulerColumn.js";

class Scheduler extends React.Component{

    static defaultProps = {
        leftColWidth: 50,
        startMin: 0,
        endMin: 24*60,
        stepMin: 30,
        stepHeight: 24,
        columns: [
            {
                id: 1,
                name: "ciao"
            },
        ],
        bgColor: "#fff",
        horLineColor: "rgba(0,0,0,0.1)",
        events: [
            {
                title: "ciaociao",
                text: "bla blabl balblab lab",
                dateStart: "2020-12-12T16:15:49.026Z",
                dateEnd: "2020-12-12T17:45:49.026Z",
                idColumn: 1
            }
        ]
    };

    static propTypes = {
        leftColWidth: PropTypes.number,
        startMin: PropTypes.number,
        endMin: PropTypes.number,
        stepMin: PropTypes.number,
        stepHeight: PropTypes.number,
        columns: PropTypes.array,
        bgColor: PropTypes.string,
        horLineColor: PropTypes.string
    };

    state = {
        selectedDay: new Date(),
        view: "day", // "day", "week", "month", "year"

        error: ""
    };

    render(){
        let html = (
            <div className="rs_container" style={this.functionalCSS()}>
                <div className="rs_leftCol">
                    {this.leftColumn()}
                </div>
                <div className="rs_columns">
                    {this.props.columns.map((c,i)=>{
                        let e = this.filterEvents( c.id );
                        return <SchedulerColumn key={i} {...c} events={e} />
                    })}
                </div>
            </div>
        );
        return html;
    }


    functionalCSS(){
        return {
            '--leftcol-w': this.props.leftColWidth+'px',
            '--step-h': this.props.stepHeight+'px',
            '--step-min': this.props.stepMin,
            '--colnum': this.props.columns.length,
            '--bgcol': this.props.bgColor,
            '--linecol': this.props.horLineColor
        };
    }

    leftColumn(){
        let min = [];
        for( let i = this.props.startMin; i < this.props.endMin; i += this.props.stepMin ){
            min.push(i);
        }
        return min.map((m,i)=>
            <div className="rs_leftColCell" key={i}>
                {this.minToTime(m)}
            </div>);
    }

    minToTime(m){
        return (Math.floor(m/60)+'').padStart(2,'0')
            + ':'
            + ((m%60)+'').padStart(2,'0');
    }

    filterEvents( idColumn ){
        return this.props.events.filter(e=>
            e.idColumn === idColumn 
            &&
            this.isSameDay( this.state.selectedDay, e.dateStart )
        );
    }

    isSameDay( d1, d2 ){

    }
}


export default Scheduler;