import React from 'react';
import PropTypes from 'prop-types';

import "./SchedulerColumn.css";
import SchedulerEvent from './SchedulerEvent';


class SchedulerColumn extends React.Component {

    static defaultProps = {
        id: 0,
        name: "",
        events: [],
        onEventResize: null
    };

    static propTypes = {
        id: PropTypes.number,
        name: PropTypes.string,
        events: PropTypes.array,
        onEventResize: PropTypes.func
    };

    state = {

        error: ""
    };

    render() {
        let html = (<>
            <div className="rsc_column" style={this.functionalCSS()} data-id={this.props.id}>
                {this.props.events.map((e, i) =>
                    <SchedulerEvent key={i} {...e}
                        onResize={this.props.onEventResize}
                        onDrag={this.props.onEventDrag}
                    />
                )}
            </div>
        </>);
        return html;
    }


    functionalCSS() {
        return {
            '--colname': '"' + this.props.name + '"'
        };
    }
}

export default SchedulerColumn;