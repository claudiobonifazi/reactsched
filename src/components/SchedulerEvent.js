import React from 'react';
import PropTypes from 'prop-types';
import Scheduler from "./Scheduler.js";

import "./SchedulerEvent.css";


class SchedulerEvent extends React.Component {

    static defaultProps = {
        id: 0,
        title: "",
        text: "",
        dateStart: null,
        dateEnd: null,
        bgColor: "dodgerblue",
        txtColor: "white",
        idColumn: 0,
        onResize: null,
        onDrag: null
    };

    static propTypes = {
        id: PropTypes.number,
        title: PropTypes.string,
        text: PropTypes.string,
        dateStart: PropTypes.string,
        dateEnd: PropTypes.string,
        bgColor: PropTypes.string,
        txtColor: PropTypes.string,
        idColumn: PropTypes.number,
        onResize: PropTypes.func,
        onDrag: PropTypes.func
    };

    state = {

        error: ""
    };

    resizeHandler = {
        area: document.documentElement,
        startY: 0
    };

    dragHandler = {
        area: document.documentElement
    };

    render() {
        let html;
        if (!this.state.error) {
            let classes = ["rse_event"];
            if (this.props.selected) {
                classes.push("rse_selected");
            }
            html = (<>
                <div className={classes.join(' ')}
                    style={this.functionalCSS()}
                    data-id={this.props.id}
                    onDoubleClick={this.openEvent.bind(this)}
                    onContextMenu={this.openEvent.bind(this)}
                >
                    <div className="rse_title rse_dragHandle" onMouseDown={this.dragStart.bind(this)}>
                        {this.props.title || ''}
                    </div>
                    <div className="rse_text">{this.props.text || ''}</div>
                    <div className="rse_resizeHandle" onMouseDown={this.resizeStart.bind(this)} />
                </div>
            </>);
        } else {
            html = (<>
                <div className="rse_event rse_error" style={this.functionalCSS()}>
                    <div className="rse_title">{this.state.error}</div>
                    <div className="rse_text">{JSON.stringify(this.props, null, 4)}</div>
                </div>
            </>);
        }
        return html;
    }


    functionalCSS() {
        let left = 0;
        let width = 100;
        let top = Scheduler.minDiff(
            Scheduler.getStartOfDay(this.props.dateStart),
            this.props.dateStart
        );
        let height = Scheduler.minDiff(
            this.props.dateStart,
            this.props.dateEnd
        );
        return {
            '--e-minheight': height,
            '--e-w': width + "%",
            '--e-start-min': top,
            '--e-l': left,
            '--e-bgc': this.props.bgColor,
            '--e-txtc': this.props.txtColor
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (new Date(this.props.dateEnd) <= new Date(this.props.dateStart)) {
            this.state.error = "dateEnd lower than dateStart";
        }
    }

    resizeStart(e) {
        this.resizeHandler.startY = e.clientY;
        let container = e.target.closest('.rse_event');
        let move = em => {
            let rect = container.getBoundingClientRect();
            let px = em.clientY - rect.bottom;
            if (em.clientY <= rect.y) {
                px = 0;
            }
            if (typeof this.props.onResize === 'function') {
                this.props.onResize(this, px);
            }
        };
        let up = eu => {
            this.resizeHandler.area.removeEventListener('mousemove', move);
            this.resizeHandler.area.removeEventListener('mouseup', up);
        };
        this.resizeHandler.area.addEventListener('mousemove', move);
        this.resizeHandler.area.addEventListener('mouseup', up);
    }

    dragStart(e) {
        this.resizeHandler.startY = e.clientY;
        let container = e.target.closest('.rse_event');
        let evId = container.dataset.id;
        let move = em => {
            let rect = container.getBoundingClientRect();
            if (rect.y === 0) {
                container = em.target.closest('.rs_container').querySelector('.rse_event[data-id="' + evId + '"]');
                rect = container.getBoundingClientRect();
            }
            let px = em.clientY - rect.y;
            if (typeof this.props.onDrag === 'function') {
                this.props.onDrag(this, em, px);
            }
        };
        let up = eu => {
            this.dragHandler.area.removeEventListener('mousemove', move);
            this.dragHandler.area.removeEventListener('mouseup', up);
        };
        this.dragHandler.area.addEventListener('mousemove', move);
        this.dragHandler.area.addEventListener('mouseup', up);
    }

    openEvent(e) {
        e.preventDefault();
        console.log(e)
    }
}




export default SchedulerEvent;