// 'export' - to make it a module
// 'default' - only class to be exported
export default class DonutChart{
    
    // Attributes (use '#' for private)
    width; height;              // figure dimensions
    svg; chart; arcs; labels;   // figure features
    data; pieData;              // internal data

     /* --- C O N S T R U C T O R ---
    - container: DOM selector
    - widt: visualisation width
    - height: visualisation height
    - margin: chart area margins [top, bottom, left, right]
    */

    constructor(container, width, height){
        this.width = width;
        this.height = height;
        
        this.svg = d3.select(container)
            .append('svg')
            .classed('donut_chart', true)
            .attr('width', this.width)
            .attr('height', this.height);

        this.chart = this.svg.append('g')
            .attr('transform', 
                `translate(${this.width/2},${this.height/2})`);
        this.arcs = this.chart.selectAll('path');
        this.labels = this.chart.selectAll('text');
    }

    // data is in the format [[key, value], ...]
    #updateArcs(){
        let minFigDimension = Math.min(this.width, this.height);
        
        let arcGen = d3.arc()
            .innerRadius(minFigDimension/4)
            .outerRadius(minFigDimension/2-5);

        // Update arcs with animation
        this.arcs = this.arcs
            .data(this.pieData, d=>d[0])
            .join(
                enter => enter.append('path')
                             .classed('donut_slices', true)
                             .attr('d', arcGen)
                             .style('fill-opacity', 0)
                             .call(enter => enter.transition().duration(1000)
                                                .style('fill-opacity', 1)),
                update => update.call(update => update.transition().duration(1000)
                                                        .attrTween('d', arcTween)),
                exit => exit.call(exit => exit.transition().duration(1000)
                                                  .style('fill-opacity', 0)
                                                  .remove())
        );

        // Update labels with animation
        this.labels = this.labels
        .data(this.pieData, d=>d[0])
        .join(
            enter => enter.append('text')
                         .classed('chart_text', true)
                         .attr('transform', d=>`translate(${arcGen.centroid(d)})`)
                         .style('opacity', 0)
                         .text(d=>d.data[0])
                         .call(enter => enter.transition().duration(1000)
                                            .style('opacity', 1)),
            update => update.call(update => update.transition().duration(1000)
                                                    .attr('transform', d=>`translate(${arcGen.centroid(d)})`)),
            exit => exit.call(exit => exit.transition().duration(1000)
                                              .style('opacity', 0)
                                              .remove())
        );

        // Function to interpolate between the old and new arc shapes
        function arcTween(d) {
            const i = d3.interpolate(this._current, d);
            this._current = i(0);
            return t => arcGen(i(t));
        }
    }

    render(dataset){
        this.data = dataset;
        let pieGen = d3.pie()
            .padAngle(0.02)
            .sort(null)
            .value(d=>d[1]);
        
        this.pieData = pieGen(dataset);
        this.#updateArcs();
        return this; // to allow chaining
    }
}