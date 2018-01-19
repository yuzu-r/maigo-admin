import React, { Component } from 'react';
import RaidScatterplot from '../components/RaidScatterplot';

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
			scatterplot = <h3>Raids are loading, please wait ... </h3>
		}
		else {
			scatterplot = <RaidScatterplot data={this.state.raids} />
		}

		return (
			<div>
				<h1>Pokémon Go Hatch Tracker</h1>
				<p>
					I've been tracking the gyms near me to see how often they host raid bosses.
					See any patterns?
				</p>
				{scatterplot}	
			</div>
		)
	}
}

export default RaidScatterplotContainer;