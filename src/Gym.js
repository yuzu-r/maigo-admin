import React, { Component } from 'react';

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
			<div>
				<h4>{this.props.gym.name} ({this.props.gym["_id"]})</h4>
				<p>Address: {mapAddress}, Landmark: {this.props.gym.landmark}</p>
				<p>Aliases: {aliasNodes}</p>
			</div>
		)
	}
}

export default Gym;