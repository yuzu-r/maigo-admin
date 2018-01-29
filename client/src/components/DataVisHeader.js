import React, { Component } from 'react';
import '../styles/index.css';

class DataVisHeader extends Component {
	render() {
		let inactiveButtonClass = 'btn btn-link no-indent',
				activeButtonClass = 'btn btn-link no-indent active-chart';

		return (
			<div>		
	      <div className="navbar navbar-dark bg-dark navbar-fixed-top">
	        <div className="container d-flex justify-content-between">
            <h3 className="text-white header-text-top">Pokémon Go Raid Visualizations</h3>
	          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarHeader" aria-controls="navbarHeader" aria-expanded="false" aria-label="Toggle navigation">
	            <span className="navbar-toggler-icon"></span>
	          </button>
	        </div>
	      </div>
	      <div className="collapse bg-dark" id="navbarHeader">
	        <div className="container">
	          <div className="row">
	            <div className="col-sm-5">
	              <h4 className="text-white">View</h4>
	              <ul className="list-unstyled tiny-indent">
	                <li>
	                	<button 
	                		type="button" 
	                		className = {this.props.active === 'scatter' ? activeButtonClass : inactiveButtonClass} 
	                		onClick = {this.props.changeView.bind(this,'scatter')}
	                	>
	                		Raid History of Five Gyms
	                	</button>
	                </li>
	               <li>
	  								<button 
	  									type="button" 
	  									className = {this.props.active === 'stacked' ? activeButtonClass : inactiveButtonClass} 
	  									onClick = {this.props.changeView.bind(this,'stacked')}
	  								>
	                		Hatch Times by Time of Day
	                	</button>
	                </li>
	               <li>
	  								<button 
	  									type="button" 
	  									className = {this.props.active === 'pie' ? activeButtonClass : inactiveButtonClass} 
	  									onClick = {this.props.changeView.bind(this,'pie')}
	  									>
	                		Raid Boss Frequency
	                	</button>
	                </li>
	              </ul>
	            </div>
	            <div className="col-sm-7">
	              <h4 className="text-white">About</h4>
	              <p className="text-white text-left tiny-indent">I collected raid egg data over a two week period for nearby PoGo gyms. Here I used d3 to display the results of my observation period.</p>
	            </div>
	          </div>
	        </div>
	      </div>
	    </div>
		)
	}
}

export default DataVisHeader;