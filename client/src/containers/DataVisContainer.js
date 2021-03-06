import React, { Component } from 'react';
import DataVisHeader from '../components/DataVisHeader';
import RaidScatterplotContainer from './RaidScatterplotContainer';
import RaidStackedContainer from './RaidStackedContainer';
import RaidPieContainer from './RaidPieContainer';
import WhereisStackedContainer from './WhereisStackedContainer';

class DataVisContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active: 'whereis'
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
			graphic = <RaidScatterplotContainer  />
		}
		else if (this.state.active === 'stacked') {
			graphic = <RaidStackedContainer />
		}
		else if (this.state.active === 'pie') {
			graphic = <RaidPieContainer />
		}
		else if (this.state.active === 'whereis') {
			graphic = <WhereisStackedContainer />
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