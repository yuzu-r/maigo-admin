import React, { Component } from 'react';
import WhereisStacked from '../components/WhereisStacked';
import '../styles/raidplot.css'

class WhereisStackedContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
									whereis: [],
									isLoading: true,
								 };
		this.loadWhereisFromServer = this.loadWhereisFromServer.bind(this);
	}
	async loadWhereisFromServer(){
		try {
			let response = await fetch('/api/lookups');
			let data = await response.json();
			this.setState({whereis: data.lookups, isLoading: false});
		} catch(error) {
			console.error(error);
		}
	}
	componentDidMount(){
		this.loadWhereisFromServer();
	}
	render() {
		let stacked = null;
		if (this.state.isLoading) {
			stacked = <h4 className = 'text-center top-spacer'>... fetching log data from server, please wait ... </h4>
		}
		else {
			stacked = <WhereisStacked data={this.state.whereis} />
		}

		return (
			<div>
				{stacked}	
			</div>
		)
	}
}
export default WhereisStackedContainer;