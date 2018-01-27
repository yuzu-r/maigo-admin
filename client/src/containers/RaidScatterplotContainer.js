import React, { Component } from 'react';
import RaidScatterplot from '../components/RaidScatterplot';
import '../styles/raidplot.css'

class RaidScatterplotContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
									raids: [],
									isLoading: true,
								 };
		this.loadRaidsFromServer = this.loadRaidsFromServer.bind(this);
	}
	async loadRaidsFromServer(){
		console.log('fetching data');
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
		setInterval(this.loadRaidsFromServer, this.props.pollInterval);
	}
	render() {
		let scatterplot = null;
		if (this.state.isLoading) {
			scatterplot = <h4 className = 'text-center top-spacer'>... raids are loading, please wait ... </h4>
		}
		else {
			scatterplot = <RaidScatterplot data={this.state.raids} />
		}

		return (
			<div>
				{scatterplot}	
			</div>
		)
	}
}

export default RaidScatterplotContainer;