import React, { Component } from 'react';
import '../styles/gymlist.css';

class Gym extends Component {
	render() {
		let aliasNodes = null;
		if (this.props.gym.aliases) {
			aliasNodes = this.props.gym.aliases.join(', ');
		}
		let mapAddress = this.props.gym.address;
		if (this.props.gym.gmap) {
			mapAddress = <a href={this.props.gym.gmap} target="_blank">{this.props.gym.address}</a>
		}
		return(
			<div className = 'tiny-indent'>
				<h5 className = 'gymname'>{this.props.gym.name} ({this.props.gym["_id"]})</h5>
				<p className = 'gymdata'>Address: {mapAddress}</p> 
				<p className = 'gymdata'>Landmark: {this.props.gym.landmark}</p>
				<p className = 'gymdata'>Aliases: {aliasNodes}</p>
			</div>
		)
	}
}

export default Gym;