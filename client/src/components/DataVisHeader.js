import React, { Component } from 'react';
import '../styles/index.css';

class DataVisHeader extends Component {
	render() {
		return (
			<div>		
	      <div className="navbar navbar-dark bg-dark navbar-fixed-top">
	        <div className="container d-flex justify-content-between">
            <h3 className="text-white">Pokemon Go Raid Visualizations</h3>
	          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarHeader" aria-controls="navbarHeader" aria-expanded="false" aria-label="Toggle navigation">
	            <span className="navbar-toggler-icon"></span>
	          </button>
	        </div>
	      </div>
	      <div className="collapse bg-dark" id="navbarHeader">
	        <div className="container">
	          <div className="row">
	            <div className="col-sm-5 ">
	              <h4 className="text-white">View</h4>
	              <ul className="list-unstyled tiny-indent">
	                <li>
	                	<button type="button" className="btn btn-link no-indent">
	                		Hatch Times for Five Gyms
	                	</button>
	                </li>
	               <li>
	  								<button type="button" className="btn btn-link no-indent">
	                		Hatch Times by Time of Day
	                	</button>
	                </li>
	               <li>
	  								<button type="button" className="btn btn-link no-indent">
	                		Raid Boss Frequency
	                	</button>
	                </li>
	              </ul>
	            </div>
	            <div className="col-sm-7 ">
	              <h4 className="text-white">About</h4>
	              <p className="text-white text-left tiny-indent">Add some information about how the data was collected, etc. Link to portfolio.</p>
	            </div>
	          </div>
	        </div>
	      </div>
	    </div>
		)
	}
}

export default DataVisHeader;