import React, { Component } from 'react';
import RaidPie from '../components/RaidPie';
import '../styles/raidplot.css'

class RaidPieContainer extends Component {
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
		let pie = null;
		if (this.state.isLoading) {
			pie = <h4 className = 'text-center top-spacer'>... raids are loading, please wait ... </h4>
		}
		else {
			pie = <RaidPie data={this.state.raids} />
		}

		return (
			<div>
				{pie}	
			</div>
		)
	}
}

export default RaidPieContainer;