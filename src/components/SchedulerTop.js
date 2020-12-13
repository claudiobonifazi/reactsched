import React from 'react';
import PropTypes from 'prop-types';

import "./SchedulerTop.css";


class SchedulerTop extends React.Component {

    static defaultProps = {
        selectedDay: null,
        onDaySelect: null,
    };

    static propTypes = {
        selectedDay: PropTypes.any,
        onDaySelect: PropTypes.func
    };

    render() {
        let v = this.props.selectedDay || null;
        if (v) {
            v = this.props.selectedDay.toISOString().split('T')[0];
        }
        let html = (
            <div className="rst_container">
                <div>

                </div>
                <div className="rst_navigation">
                    <div>

                    </div>
                    <div className="rst_nav_menu">
                        <div className="rst_nav_menu_left"
                            role="button" aria-label="previous day" tabIndex="0"
                            onClick={this.dayJump.bind(this, -1)} >
                            &lsaquo;
                        </div>
                        <label>
                            <input type="date" value={v} onChange={this.daySelect.bind(this)} />
                        </label>
                        <div className="rst_nav_menu_right"
                            role="button" aria-label="next day" tabIndex="0"
                            onClick={this.dayJump.bind(this, 1)} >
                            &rsaquo;
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
            </div>
        );
        return html;
    }

    daySelect(e) {
        let newDate = e.target.value;
        this.props.onDaySelect(new Date(newDate));
    }

    dayJump(howMuch, e) {
        let newDate = this.props.selectedDay.getTime() + howMuch * 24 * 60 * 60 * 1000;
        this.props.onDaySelect(new Date(newDate));
    }
}


export default SchedulerTop;