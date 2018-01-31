import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import GymList from '../components/GymList';

class GymListContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
										gyms: [],
										isLoading: true,
										pollInterval: 300000
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
		setInterval(this.loadGymsFromServer, this.state.pollInterval);
	}
	render() {
		return (
			<div>
				<div className='tiny-indent'>
					<h5 className = 'tiny-indent'>Local Gym List
						<small className='text-muted'>&nbsp;&nbsp;&nbsp;<NavLink to = '/'>return to data visualizations</NavLink></small>
					</h5>
					<p className='tiny-indent'>Google maps link (if it exists) will open in a separate browser tab.</p>
				</div>
				<GymList gyms={this.state.gyms} isLoading={this.state.isLoading} />
			</div>
		)
	}
}

export default GymListContainer;