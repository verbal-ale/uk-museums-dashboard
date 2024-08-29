// 'export' - to make it a module
// 'default' - only class to be exported
export default class LineChart{

    // Attributes (use '#' for private)
    width; height; margin;                                       // figure dimensions
    svg; chart; circles; curve; axisX; axisY; labelX; labelY;    // figure features
    scaleX; scaleY;                                               // scaling
    data;                                                          // internal data

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
            .classed('linechart', true)
            .attr('width', this.width)
            .attr('height', this.height);

        this.chart = this.svg.append('g')
            .attr('transform', 
                `translate(${this.margin[2]},${this.margin[0]})`);
        this.circles = this.chart.selectAll('circle');

        this.axisX = this.svg.append('g')
            .attr('transform',
                `translate(${this.margin[2]},${this.height - this.margin[1]})`);
        this.axisY = this.svg.append('g')
            .attr('transform',
                `translate(${this.margin[2]},${this.margin[0]})`);

        this.labelX = this.svg.append('text')
            .attr('transform', 
                `translate(${this.width/2},${this.height})`)
            .style('text-anchor', 'middle')
            .attr('dy', -5)
            .attr('class', 'chart_text');

        this.labelY = this.svg.append('text')
            .attr('transform',
                `translate(0,${this.margin[0]})rotate(-90)`)
            .style('text-anchor', 'end')
            .attr('dy', 15);
    }

    #updateScales(){
        let chartWidth = this.width - this.margin[2] - this.margin[3],
            chartHeight = this.height - this.margin[0] - this.margin[1];
        
        let rangeX = [0, chartWidth];
        let rangeY = [chartHeight, 0];
        
        let domainX = [d3.min(this.data, d=>d[0]), d3.max(this.data, d=>d[0])];
        let domainY = [d3.min(this.data, d=>d[1]), d3.max(this.data, d=>d[1])];

        this.scaleX = d3.scaleLinear(domainX, rangeX);
        this.scaleY = d3.scaleLinear(domainY, rangeY);
    }

    #updateAxes(){
        let axisGenX = d3.axisBottom(this.scaleX).tickFormat(d3.format(".0f")),
            axisGenY = d3.axisLeft(this.scaleY);
        
        this.axisX.call(axisGenX);
        this.axisY.call(axisGenY);
    }

    // data is in the format [[key, value], ...]
    #updateCircles(){
        this.circles = this.circles
            .data(this.data, d=>d[0])
            .join('circle')
            .attr('id', d=>d[2])
            .attr('cx', d=> this.scaleX(d[0]))
            .attr('cy', d=> this.scaleY(d[1]))
            .attr('r', 0);

            this.circles.transition()
            .duration(1000) // Adjust if needed
            .attr('r', 0); 
    }

    #updateCurve(){

        let lineGen = d3.line()
            .curve(d3.curveLinear)
            .x(d => this.scaleX(d[0]))
            .y(d => this.scaleY(d[1]));

        this.curve = this.chart.append('path')
            .datum(this.data)
            .classed('curve', true)
            .attr('d', lineGen(this.data))
            .attr('stroke-dasharray', function() { return this.getTotalLength() })
            .attr('stroke-dashoffset', function() { return this.getTotalLength() });

        this.curve.transition()
            .duration(1000) // Adjust if needed
            .attr('stroke-dashoffset', 0)
            .ease(d3.easeLinear);
    }


    // The dataset parameter needs to be in a generic format,
    // so that it works for all future data
    // here we assume a [[k, v], ...] format for efficiency
    
    render(dataset){
        this.clearPath();
        this.data = dataset;
        this.#updateScales();
        this.#updateAxes();
        this.#updateCircles();
        this.#updateCurve();

        return this; // to allow chaining
    }


    setLabels(labelX='population', labelY='area'){
        this.labelX.text(labelX);
        this.labelY.text(labelY);
        return this;
    }

    clearPath(){
        d3.selectAll(".curve").remove();
    }

}
