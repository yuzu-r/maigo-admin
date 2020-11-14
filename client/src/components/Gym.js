import React, { Component } from 'react';
import '../styles/gymlist.css';

class Gym extends Component {
	render() {
		let aliasNodes = null;
		if (this.props.gym.aliases) {
			aliasNodes = this.props.gym.aliases.join(', ');
		}
		let mapAddress = this.props.gym.address;
		let gmapLink = this.props.gym.gmap;
		let isExRaidEligible = this.props.gym.is_ex_eligible;
		let gmap = 'Google Maps link is missing.'
		if (gmapLink !== undefined) {
			gmap = <a href={gmapLink} target="_blank" rel="noopener noreferrer">Google Maps Link</a>
		}
		return(
			<div className = 'tiny-indent'>
				<h5 className = 'gymname'>{this.props.gym.name} ({this.props.gym["_id"]})</h5>
				<p className = 'gymdata'>Ex Raid Eligible: {isExRaidEligible ? "YES" : "" }</p>
				<p className = 'gymdata'>{gmap}</p>
				<p className = 'gymdata'>Address: {mapAddress}</p> 
				<p className = 'gymdata'>Landmark: {this.props.gym.landmark}</p>
				<p className = 'gymdata'>Aliases: {aliasNodes}</p>
			</div>
		)
	}
}

export default Gym;