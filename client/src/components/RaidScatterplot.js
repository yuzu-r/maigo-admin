import React, { Component } from 'react'
import * as d3 from 'd3'
import * as d3ScaleChromatic from 'd3-scale-chromatic'
import * as d3Legend from 'd3-svg-legend'
import '../styles/raidplot.css'

class RaidScatterplot extends Component {
	constructor(props) {
		super(props)
		this.state = {
			gyms: [
              {name: 'Sprint Store', abbreviation: 'sprint'},
              {name: 'Frog Habitat', abbreviation: 'frog'}, 
              {name: 'Long Song Sculpture', abbreviation: 'long'},              
              {name: 'Veterans Memorial Hall (Albany)', abbreviation: 'vets'},
              {name: 'Little Free Library Colusa', abbreviation: 'lfl'},
              {name: '', abbreviation: ''}
            ],
      svgHeight: 500,
      svgWidth: 1000
		}
		this.createScatterplot = this.createScatterplot.bind(this)
		this.getTierColor = this.getTierColor.bind(this)
		this.starText = this.starText.bind(this)
		this.parseGymName = this.parseGymName.bind(this)
	}
	componentDidMount() {
		this.createScatterplot()
	}
	createScatterplot() {
		const node = this.node
		const margin = {top: 20, right: 300, bottom: 130, left: 60},
    		navMargin = {top: 430, right: 300, bottom: 30, left: 60},
    		width = this.state.svgWidth - margin.left - margin.right,
    		height = this.state.svgHeight - margin.top - margin.bottom,
    		navHeight = this.state.svgHeight - navMargin.top - navMargin.bottom,
    		circleSize = 7,
    		navCircleSize = 2,
    		numGyms = this.state.gyms.length;

  	const tooltip = d3.select('body')
    	.append('div')
    	.attr('class', 'tip')
    	.style('visibility', 'hidden');
  
  	const utcParseDate = d3.utcParse('%Y-%m-%dT%H:%M:%S.%LZ');

  	const tierColor = d3.scaleOrdinal()
    	.domain(d3.range(1,6).map(i => this.starText(i)))
    	.range(d3.range(1,6).map(i => this.getTierColor(2*i-1)));
  
	  const x = d3.scaleTime().range([0, width]);
  	const navX = x.copy();
  	const y= d3.scaleOrdinal()
    	.domain(d3.range(numGyms).map(i => this.state.gyms[i]['abbreviation']))
    	.range(d3.range(numGyms).map(i => i * height/numGyms + height/numGyms));
  	const navY = y.copy()
    	.range(d3.range(numGyms).map(i => i*navHeight/numGyms + navHeight/numGyms))
  
  	const xAxis = d3.axisBottom(x).ticks(6),
    	  navXAxis = d3.axisBottom(navX),
      	yAxis = d3.axisLeft(y)

		const gridAxis = d3.axisBottom(x)
		    .tickArguments([d3.timeDay.every(1)])
		    .tickSize(-(y(this.parseGymName('Little Free Library Colusa'))))
		    .tickFormat('');

		const brush = d3.brushX()
		    .extent([[0, 0], [width, navHeight]])
		    .on('brush end', brushed);

		const zoom = d3.zoom()
		    .scaleExtent([1,120])
		    .translateExtent([[0, 0], [width, height]])
		    .extent([[0, 0], [width, height]])
		    .on('zoom', zoomed);
		  
		d3.select(node).append('defs').append('clipPath')
		    .attr('id', 'clip')
		    .append('rect')
		      .attr('width', width)
		      .attr('height', height);

 	 	const focus = d3.select(node)
 	 		.append('g')
    		.attr('class', 'focus')
    		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const context = d3.select(node)
    	.append('g')
		    .attr('class', 'context')
		    .attr('transform', 'translate(' + navMargin.left + ',' + navMargin.top + ')');

    /* determine the earliest and latest date in the dataset */
    const minN = d3.min(this.props.data, d => utcParseDate(d.start_time)).getTime();
    const maxN = d3.max(this.props.data, d => utcParseDate(d.start_time)).getTime();

    /* add padding to the ends of the date range */
    const hourInMs = 3.6e6;
    const dayInMs = 8.64e7;
    let minDate = new Date(minN - 3 * hourInMs),
        maxDate = new Date(maxN + 3 * hourInMs),
        initialSelection = new Date(maxN - 3 * dayInMs);
    
    if (initialSelection < minDate) {
      initialSelection = minDate;
    }
    
    x.domain([minDate, maxDate]);
    navX.domain(x.domain());

    focus.append('rect')
      .attr('class', 'zoom')
      .attr('width', width)
      .attr('height', height)
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(zoom);    

    focus.selectAll('.raid')
      .attr('clip-path', 'url(#clip)')
      .data(this.props.data)
      .enter()
      .append('circle')
      .attr('class', 'raid')
      .attr('cx', d => x(utcParseDate(d.start_time)))
      .attr('cy', d => y(this.parseGymName(d.gym.name)))
      .attr('r', circleSize)
      .attr('fill', d => this.getTierColor(2*d.boss.tier-1))
      .on('mouseover', d => {     
        var dateFormat = d3.utcFormat('%-m/%d');
        var timeFormat = d3.timeFormat('%-I:%M %p');
        var tipText = this.starText(d.boss.tier);
        tipText += '\n' + d.boss.name;
        tipText += '\n' + dateFormat(utcParseDate(d.start_time));
        tipText += ' ' + timeFormat(utcParseDate(d.start_time));
        tooltip.style('background-color', this.getTierColor(2*d.boss.tier-2))
        tooltip.style('color','black');
        tooltip.style('text-align', 'center');
        tooltip.text(tipText); 
        return tooltip.style('visibility', 'visible');
        })
      .on('mousemove', function(){
          var styleTop = (d3.event.pageY-10)+'px';
          var styleLeft = (d3.event.pageX+10)+'px';
          return tooltip.style('top', styleTop).style('left',styleLeft);
        })
      .on('mouseout', function(){
          return tooltip.style('visibility', 'hidden');
        });

    focus.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    focus.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxis);

    focus.append('g')
      .attr('class', 'grid')
      .attr('transform', 'translate(0,' + height + ')')
      .call(gridAxis);

    focus.append('text')
      .attr('x', width/2)
      .attr('y', height + margin.bottom/3)
      .style('text-anchor', 'middle')
      .text('Hatch Time');

    focus.append('g')
      .attr('class', 'legendOrdinal')
      .attr('transform', 'translate(' + (width + 3 * circleSize) + ',' + (height- margin.bottom) + ')');

    var legendOrdinal = d3Legend.legendColor()
      .shape('circle')
      .shapeRadius(circleSize)
      .shapePadding(2)
      .scale(tierColor)
      .title('Raid Tier Guide');

    focus.select('.legendOrdinal')
      .call(legendOrdinal);

    focus.append('text')
      .attr('x', width/2)             
      .attr('y', margin.top)
      .attr('class', 'title-text')
      .attr('text-anchor', 'middle')  
      .text('Raid History of Nearby Gyms');
    
    context.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + navHeight + ')')
      .call(navXAxis);

    context.append('svg')
      .attr('width', width + navMargin.left + navMargin.right)
      .attr('height', navHeight + navMargin.top + navMargin.bottom)
      .append('g')
      .attr('transform', 'translate(' + navMargin.left + ',' + navMargin.top + ')'); 

    context.append('g')
      .attr('class', 'brush')
      .call(brush)
      //.call(brush.move, x.range());  // sets brush to select the entire range
      .call(brush.move, [x(initialSelection), x(maxDate)]);

    context.selectAll('navRaids')
      .data(this.props.data)
      .enter()
      .append('circle')
      .attr('cx', d => navX(utcParseDate(d.start_time)))
      .attr('cy', d => navY(this.parseGymName(d.gym.name)))
      .attr('r', navCircleSize)
      .attr('fill', d => this.getTierColor(2*d.boss.tier-1))    


    function brushed() {
	    // ignore brush-by-zoom
	    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return; 
	    var s = d3.event.selection || navX.range();
	    d3.select(node).select('.zoom').call(zoom.transform, d3.zoomIdentity
	        .scale(width / (s[1] - s[0]))
	        .translate(-s[0], 0));

	    x.domain(s.map(navX.invert, navX));
	    focus.selectAll('.raid').attr('cx', d => x(utcParseDate(d.start_time)));
	    focus.selectAll('.raid').attr('clip-path','url(#clip)');
	    focus.select('.grid').call(gridAxis);
	    focus.select('.axis--x').call(xAxis);
  	}

		function zoomed() {
		    // ignore zoom-by-brush
		    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return;
		    var t = d3.event.transform;
		    context.select('.brush').call(brush.move, x.range().map(t.invertX, t));
		    x.domain(t.rescaleX(navX).domain());
		    focus.selectAll('.raid').attr('cx', d => x(utcParseDate(d.start_time)));
		    focus.select('.grid').call(gridAxis);
		    focus.select('.axis--x').call(xAxis);
		  }
	}
	starText(tier) {
    let text = '';
    for (let i = 1; i <= tier; i++) {
      text += '\u2605';
    }
    return text;		
	}
	getTierColor(index) {
    let cs = d3ScaleChromatic.schemePaired; 
    return cs[index];
	}
  parseGymName(officialGymName) {
    for (let i = 0; i < this.state.gyms.length; i++) {
      if (this.state.gyms[i].name === officialGymName) {
        return this.state.gyms[i].abbreviation;
      }
    }
  }	
 	render() {
    console.log('rendering plot ', this.props.data.length);
		return (
			<svg 
				ref={node => this.node = node} 
				width={this.state.svgWidth} 
				height={this.state.svgHeight}>
			</svg>
		)
	}
}

export default RaidScatterplot;