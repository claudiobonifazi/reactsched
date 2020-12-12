import React from 'react';
import PropTypes from 'prop-types';

import "./SchedulerEvent.css";


class SchedulerEvent extends React.Component{

    static defaultProps = {
        title: "",
        text: "",
        dateStart: null,
        dateEnd: null,
        bgColor: "dodgerblue",
        txtColor: "white",
        idColumn: 0
    };

    static propTypes = {
        title: PropTypes.string,
        text: PropTypes.string,
        dateStart: PropTypes.string,
        dateEnd: PropTypes.string,
        bgColor: PropTypes.string,
        txtColor: PropTypes.string
    };

    state = {

        error: ""
    };

    render(){
        let html = (<>
            <div className="rse_event" style={this.functionalCSS()}>

            </div>
        </>);
        return html;
    }


    functionalCSS(){
        let top = 0;
        let left = 0;
        let width = 100;
        let height = this.calculateDuration();
        return {
            '--e-minheight': height,
            '--e-w': width+"%",
            '--e-startmin': top,
            '--e-l': left,
            '--e-bgc': this.props.bgColor,
            '--e-txtc': this.props.txtColor
        };
    }

    calculateDuration(){
        let d1 = new Date(this.props.dateStart);
        let d2 = new Date(this.props.dateEnd);
        let diffTime = Math.abs( d2 - d1 );
        return diffTime / (1000*60);
    }
}

export default SchedulerEvent;