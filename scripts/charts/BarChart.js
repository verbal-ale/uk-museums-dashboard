// 'export' - to make it a module
// 'default' - only class to be exported
export default class BarChart{

    // Attributes (use '#' for private)
    width; height; margin;                                      // figure dimensions
    svg; chart; bars; axisX; axisY; labelX; labelY; labelTitle; // figure features
    scaleX; scaleY;                                             // scaling
    data;   
    barClick = ()=>{};
    barHover = ()=>{};
    barOut = ()=>{};
    axisYFormat = d3.format('.3~s');
    // internal data

    /* --- C O N S T R U C T O R ---
    - container: DOM selector
    - widt: visualisation width
    - height: visualisation height
    - margin: chart area margins [top, bottom, left, right]
    */
    constructor(container, width, height, margin){
        this.width = width;
        this.height = height;
        this.margin = margin;

        this.svg = d3.select(container)
            .append('svg')
            .classed('barchart', true)
            .attr('width', this.width)
            .attr('height', this.height);

        // Append title
        this.labelTitle = this.svg.append('text')
            .attr('x', this.width * 2 / 3)
            .attr('y', this.margin[0]*2) // Adjust the position as needed
            .attr('text-anchor', 'middle')
            .attr('class', 'chart_text');

        this.chart = this.svg.append('g')
            .attr('transform', 
                `translate(${this.margin[2]},${this.margin[0]})`);
        this.bars = this.chart.selectAll('rect.bar');

        this.axisX = this.svg.append('g')
            .classed('axisXtext', true)    
            .attr('transform',
                `translate(${this.margin[2]},${this.height - this.margin[1]}) `);
        this.axisY = this.svg.append('g')
            .attr('transform',
                `translate(${this.margin[2]},${this.margin[0]})`);
        
        this.labelX = this.svg.append('text')
            .classed('chart_text', true)
            .attr('transform', 
                `translate(${this.width/2},${this.height})`)
            .style('text-anchor', 'middle')
            .attr('dy', -10);

        this.labelY = this.svg.append('text')
            .classed('chart_text', true)    
            .attr('transform',
                `translate(0,${this.margin[0]})rotate(-90)`)
            .style('text-anchor', 'end')
            .attr('dy', 15);
    }

    // Private Methods
    // data is in the format [[key, value], ...]
    #updateBars(){
        this.bars = this.bars
        .data(this.data, d => d[0])
        .join(
            enter => enter.append('rect')
                .classed('bar', true)
                .attr('x', d => this.scaleX(d[0]))
                .attr('y', this.height - this.margin[1]) // Start the bars from the bottom of the chart
                .attr('width', this.scaleX.bandwidth()) // Use scaleX bandwidth for the width
                .attr('height', 0) // Set initial height to 0 for the animation
                .attr('fill-opacity', 0) // Set initial opacity to 0
                .call(enter => enter.transition() // Apply transition
                .duration(1000) // Animation duration
                .attr('y', d => this.scaleY(d[1])) // Transition y position to the actual value
                .attr('height', d => this.height - this.margin[0] - this.margin[1] - this.scaleY(d[1])) // Transition height to the actual value
                .attr('fill-opacity', 1)), // Fade in the bars
        update => update.transition() // Apply transition
            .duration(1000) // Animation duration
            .attr('x', d => this.scaleX(d[0]))
            .attr('y', d => this.scaleY(d[1]))
            .attr('width', this.scaleX.bandwidth()) // Update width with scaleX bandwidth
            .attr('height', d => this.height - this.margin[0] - this.margin[1] - this.scaleY(d[1])) // Update height to the actual value
     )
         
        this.bars.selectAll('title')
            .data(d=>[d])
            .join('title')
            .text(d=>`${d[0]}: ${this.axisYFormat(d[1])}`);
        
        this.#updateEvents(); 
    }

    #updateScales(){
        let chartWidth = this.width - this.margin[2] - this.margin[3],
            chartHeight = this.height - this.margin[0] - this.margin[1];
        
        let rangeX = [0, chartWidth];
        let rangeY = [chartHeight, 0];
        
        let domainX = this.data.map(d=>d[0]);
        let domainY = [0, d3.max(this.data, d=>d[1])];

        this.scaleX = d3.scaleBand(domainX, rangeX).padding(0.2);
        this.scaleY = d3.scaleLinear(domainY, rangeY);
    }

    #updateAxes(){
        let axisGenX = d3.axisBottom(this.scaleX),
            axisGenY = d3.axisLeft(this.scaleY);
        
        this.axisX.call(axisGenX);
        this.axisY.call(axisGenY);
    }

     //Interactivity - mouse events
     #updateEvents(){
        this.bars.on('mouseover', (event, d) => {
            d3.select(event.currentTarget)
                .classed('highlighted', true); // Add class to the hovered bar
            this.barHover(event, d); // Call the provided hover function
        })
        .on('mouseout', (event, d) => {
            d3.select(event.currentTarget)
                .classed('highlighted', false); // Remove class from the bar on mouseout
            this.barOut(event, d); // Call the provided mouseout function
        })
        .on('click', (event, d) => {
            console.log('Bar clicked:', d);
            this.barClick(event, d);
        })
    }

    // Public API

    // The dataset parameter needs to be in a generic format,
    // so that it works for all future data
    // here we assume a [[k, v], ...] format for efficiency
    render(dataset){
        this.data = dataset;
        this.#updateScales();
        this.#updateAxes();
        this.#updateBars();
        return this; // to allow chaining
    }

    setLabels(labelX='categories', labelY='values'){
        this.labelX.text(labelX);
        this.labelY.text(labelY);
        return this;
    }

    //Bar actions
    setBarClick(f=()=>{}){
        this.barClick = f;
        this.#updateEvents();
        return this;
    }
    
        setBarHover(f=()=>{}){
        this.barHover = f;
        this.#updateEvents();
        return this;
    }
    
        setBarOut(f=()=>{}){
        this.barOut = f;
        this.#updateEvents();
        return this;
    }
    // allow an optional tag to set on bars, e.g., 'selected'
    highlightBars(keys=[]) {
        this.bars.selectAll('.highlight-text').remove(); // Remove existing highlighted text
        
        this.bars.filter(d => keys.includes(d[0]))
            .append('text')
            .attr('class', 'highlight-text')
            .attr('x', d => this.scaleX(d[0]) + this.scaleX.bandwidth() / 2)
            .attr('y', d => this.scaleY(d[1]) - 10) // Adjust y position to be above the bar
            .attr('text-anchor', 'middle')
            .text(d => d[1]); // Display the value associated with the bar
        
        return this;
    }

}