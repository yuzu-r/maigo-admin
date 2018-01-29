import React, { Component } from 'react';
import RaidStacked from '../components/RaidStacked';
import '../styles/raidplot.css'

class RaidStackedContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
									raids: [],
									isLoading: true,
								 };
		this.loadRaidsFromServer = this.loadRaidsFromServer.bind(this);
	}
	async loadRaidsFromServer(){
		try {
			let response = await fetch('/api/raids');
			let data = await response.json();
			this.setState({raids: data.raids, isLoading: false});
		} catch(error) {
			console.error(error);
		}
	}
	componentDidMount(){
		this.loadRaidsFromServer();
	}
	render() {
		let stacked = null;
		if (this.state.isLoading) {
			stacked = <h4 className = 'text-center top-spacer'>... raids are loading, please wait ... </h4>
		}
		else {
			stacked = <RaidStacked data={this.state.raids} />
		}

		return (
			<div>
				{stacked}	
			</div>
		)
	}
}

export default RaidStackedContainer;