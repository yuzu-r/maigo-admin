import React, { Component } from 'react';
import GymList from './GymList';

class GymListContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
										gyms: [],
										isLoading: true
								 };
		this.loadGymsFromServer = this.loadGymsFromServer.bind(this);
	}
	async loadGymsFromServer(){
		try {
			let response = await fetch('/api/gyms');
			let data = await response.json();
			this.setState({gyms: data.gyms, isLoading: false});
		} catch(error) {
			console.error(error);
		}
	}
	componentDidMount(){
		this.loadGymsFromServer();
		setInterval(this.loadGymsFromServer, this.props.pollInterval);
	}
	render() {
		return (
			<div>
				<h2>Gyms:</h2>
				<GymList gyms={this.state.gyms} isLoading={this.state.isLoading} />
			</div>
		)
	}
}

export default GymListContainer;