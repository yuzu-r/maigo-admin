import React, { Component } from 'react';
import Gym from './Gym';

class GymList extends Component {
	render(){
		let gymNodes = 'Loading...';
		if (!this.props.isLoading) {
			gymNodes = this.props.gyms.map((gym, index) => {
				return (<Gym key={index} gym={gym}/>)
			});	
		}
		return (
			<div>
				{gymNodes}
			</div>
		)	
	}
}

export default GymList;