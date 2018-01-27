import React, { Component } from 'react';
import DataVisHeader from '../components/DataVisHeader';
import RaidScatterplotContainer from './RaidScatterplotContainer';

class DataVisContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active: 'scatter'
		}
		this.changeView = this.changeView.bind(this);
	}
	changeView(vis) {
		if (vis !== this.state.active) {
			this.setState({active: vis});
		}
	}
	render (){
		let graphic = {};
		if (this.state.active === 'scatter') {
			graphic = <RaidScatterplotContainer pollInterval={120000} />
		}
		else if (this.state.active === 'stacked') {
			graphic = <div className='mock'><p>stacked!</p><img alt='hi' src='http://via.placeholder.com/950x650' /></div>
		}
		else if (this.state.active === 'pie') {
			graphic = <div className='mock'><p>pie!</p><img alt='hi' src='http://via.placeholder.com/950x650' /></div>
		}
		return (
			<div>
				<DataVisHeader
						changeView = {this.changeView}
						active = {this.state.active}
				/>
				<div>
					{graphic}
				</div>
			</div>
		)
	}
}



export default DataVisContainer;