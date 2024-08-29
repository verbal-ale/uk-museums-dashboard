export default class Map{

    width; height;
    
    svg; mapGroup; pointGroup;
    projection; pathGen;

    zoom;

    regions;
    data;

    pointClick = ()=>{};

    selectionCoords;

    // constructor
    constructor(container, width, height){
        this.width = width;
        this.height = height;

        // setting up selections
        this.svg = d3.select(container).append('svg')
            .classed('vis map', true)
            .attr('width', width)
            .attr('height', height);
        this.mapGroup = this.svg.append('g')
            .classed('map', true);
        this.pointGroup = this.svg.append('g')
            .classed('points', true);

        // setting the zoom
        this.#setZoom();
        // Adding the dropdown button
       // this.addDropdownButton();
    }

    // function to set the zoom behaviour
    #setZoom(){
        this.zoom = d3.zoom()
            .extent([[0,0], [this.width,this.height]])
            .translateExtent([[0,0], [this.width,this.height]])
            .scaleExtent([1,8])
            .on('zoom', ({transform})=>{
                // applies transform and call render map to update zoom scales
                this.mapGroup.attr('transform', transform);
                this.pointGroup.attr('transform', transform);
            })
        this.svg.call(this.zoom)
    }

    // function to render the base map
    #renderMap(projection){
        this.projection = projection()
            .fitSize([this.width,this.height], this.regions);
        this.pathGen = d3.geoPath()
            .pointRadius(4)
            .projection(this.projection);

        this.mapGroup.selectAll('path.regions')
            .data(this.regions.features)
            .join('path')
            .classed('regions', true)
            .attr('d', this.pathGen)
            .classed('back', d=>d.id==='IRL')
    }

    #renderPoints(maxRadius) {
        let pointScale = d3.scaleSqrt([0, d3.max(this.data, d=> d[2])], [0, maxRadius]);
    
        this.pointGroup.selectAll('circle.point')
            .data(this.data)
            .join('circle')
            .classed('point', true)
            .attr('transform', d=> `translate(${this.projection([d[1], d[0]])})`)
            .attr('r', 1) // Set a smaller radius (adjust as needed)
            .style('fill', d => {
                // Assign different colors based on governance type
                switch (d[2]) {
                    case 'Independent':
                        return '#ff6a6a';
                    case 'University':
                        return '#9c180ebe ';
                    case 'Government':
                        return '#003C71';
                    default:
                        return '#747474'; // Unknown governance type
                }
            });
            this.#updateEvents();
            
    }

    #updateEvents(){
        this.pointGroup.selectAll('circle.point')
        .on('mouseenter', (event, datum)=> {
            d3.select(event.target)
                .classed('highlighted', true);     
        })
        .on('mouseleave', (event, datum)=> {
            d3.select(event.target)
                .classed('highlighted', false);
        })
        .on('click', (e,d)=>{
            this.pointClick(e,d);
        });
    }

    // Renders a base (background) map
    baseMap(regions=[], projection=d3.geoEqualEarth){
        this.regions = regions;
        this.#renderMap(projection);
        return this;
    }

    // Renders points on the map
    // dataset should be in format [[lat,lon,val],...]
    renderPoints(dataset, maxRadius=30){
        this.data = dataset;
        this.#renderPoints(maxRadius);
        return this;
    }

    setPointClick(f=()=>{}){
        // register new callback
        this.pointClick = f;
        // rebind callback to event
        this.#updateEvents();
        // return this for chaining
        return this;
    }


}