import React from 'react';
import PropTypes from 'prop-types';

import "./SchedulerColumn.css";

import SchedulerEvent from './SchedulerEvent';


class SchedulerColumn extends React.Component {

    static defaultProps = {
        id: 0,
        name: "",
        selectedDay: null,
        events: [],
        onEventResize: null,
        selectedCell: -9999,
        selectedEvent: null
    };

    static propTypes = {
        id: PropTypes.number,
        name: PropTypes.string,
        selectedDay: PropTypes.any,
        events: PropTypes.array,
        onEventResize: PropTypes.func,
        selectedCell: PropTypes.number,
        selectedEvent: PropTypes.number
    };

    state = {

        error: ""
    };

    render() {
        let html = (<>
            <div className="rsc_column"
                style={this.functionalCSS()}
                data-id={this.props.id}
                onClick={this.props.onClick}
            >
                {this.eventList()}
            </div>
        </>);
        return html;
    }

    eventList() {
        return this.props.events.map((e, i) =>
            <SchedulerEvent key={i} {...e}
                onResize={this.props.onEventResize}
                onDrag={this.props.onEventDrag}
                selected={this.props.selectedEvent === e.id}
            />
        );
    }


    functionalCSS() {
        return {
            '--colname': '"' + this.props.name + '"',
            '--selcell': this.props.selectedCell + 'px'
        };
    }

}

export default SchedulerColumn;