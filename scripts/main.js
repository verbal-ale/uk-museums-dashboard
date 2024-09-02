'use strict';
import Map from "./map/Map.js"
import BarChart from "./charts/BarChart.js";
import LineChart from "./charts/LineChart.js";
import DonutChart from "./charts/Donutchart.js";
import SummaryStatsController from "./stat view controllers/SummaryStatsController.js";
import MuseumDetailsController from "./stat view controllers/MuseumDetailsController.js";

console.log(`D3 loaded, version ${d3.version}`);

let summaryStatsController, museumStatsController;          // stats panel controllers
let map;                             // the map
let barChart, lineChart, donutChart; // charts
let chosenData, csv_data, ukData, nIrishData, englishData, scottishData, welshData; // regional datasets
let ukAreas, noIrelandLGD, englandLAD, scotlandLAD, walesLAD; //regional topology data
let selectMuseum;                   // callbacks


/**
 * //--- L O A D  F I L E S ---//
 */

// Load topology json files
let ukJson = await d3.json('./data/topologies/uk_regions.topo.json');
let scotlandJson = await d3.json('./data/topologies/scotland.topo.json');
let noIrelandJson = await d3.json('./data/topologies/no_ireland.topo.json');
let walesJson = await d3.json('./data/topologies/wales.topo.json');
let englandJson = await d3.json('./data/topologies/england.topo.json');

// Load data from csv
csv_data = await d3.csv("./data/museum data/MappingMuseumsData2021_09_30_processed_v2.csv", (d)=>{
     //for each row d, return a new object
     return{
        museum_id:                          d.museum_id,
        museum_name:                        d.museum_name,
        address_line_1:                     d.address_line_1,
        address_line_2:                     d.address_line_2,
        city:                               d.city,
        postcode:                           d.postcode ,
        latitude:                           parseFloat(d.latitude),
        longitude:                          parseFloat(d.longitude),
        admin_area_full:                    d.admin_area_full,
        admin_area_1:                       d.admin_area_1,
        admin_area_2:                       d.admin_area_2,
        admin_area_2_type:                  d.admin_area_2_type,
        admin_area_3:                       d.admin_area_3,
        admin_area_3_type:                  d.admin_area_3_type,
        admin_area_4:                       d.admin_area_4,
        admin_area_4_type:                  d.admin_area_4_type,
        accreditation:                      d.accreditation,
        governance_type:                    d.governance_type,
        governance_subtype:                 d.governance_subtype,
        size:                               d.size,
        size_provenance:                    d.size_provenance,
        subject_matter_full:                d.subject_matter_full,
        subject_matter:                     d.subject_matter,
        subject_matter_subtype_1:           d.subject_matter_subtype_1,
        subject_matter_subtype_2:           d.subject_matter_subtype_2,
        year_opened_low	:                   +d.year_opened_low,
        year_opened_high:                   +d.year_opened_high,
        year_closed_low	:                   +d.year_closed_low,
        year_closed_high :                  +d.year_closed_high,
        data_primary_provenance:            d.data_primary_provenance,
        area_deprivation_index:             +d.area_deprivation_index,
        area_deprivation_index_crime:       +d.area_deprivation_index_crime,
        area_deprivation_index_education:	+d.area_deprivation_index_education,
        area_deprivation_index_employment:	+d.area_deprivation_index_employment,
        area_deprivation_index_health:      +d.area_deprivation_index_health,
        area_deprivation_index_housing:     +d.area_deprivation_index_housing,
        area_deprivation_index_income:      +d.area_deprivation_index_income,
        area_deprivation_index_services:    +d.area_deprivation_index_services,
        area_geodemographic_supergroup:     d.area_geodemographic_supergroup,
        area_geodemographic_group:          d.area_geodemographic_group,
        area_geodemographic_subgroup:       d.area_geodemographic_subgroup
    }    
});
console.log("Raw Data Loaded:", csv_data);


/**
 * //--- E X E C U T E  F U N C T I O N S ---//
 */

generateRegionalData(csv_data);
initVizElements();
setUpCallbacks();
renderMap(ukData);
renderCharts(ukData); 
addDropdownButton();

/**
 * //--- F U N C T I O N  D E F I N I T I O N S ---// 
 */

// Create reginal datasets in an array of size 2, where:
// regionalData[0] = "String with the region's name"
// regionalData[1] = an array with the data

function generateRegionalData(csvData){
    
    // generate reginal museum data
    let groupByArea = d3.groups(csvData, d=>d.admin_area_1);
    ukData = new Array("United Kingdom", csvData);
    nIrishData = groupByArea[0];
    englishData = groupByArea[1];
    scottishData = groupByArea[2];
    welshData = groupByArea[3];

    // generate regions topology data
    ukAreas = topojson.feature(ukJson, ukJson.objects.areas);
    noIrelandLGD = topojson.feature(noIrelandJson, noIrelandJson.objects.lgd);
    englandLAD =  topojson.feature(englandJson, englandJson.objects.lad);
    scotlandLAD = topojson.feature(scotlandJson, scotlandJson.objects.lad);
    walesLAD =  topojson.feature(walesJson, walesJson.objects.lad);

    console.log("Regional Data Structures Created:\n", ukData,
                    "\n", nIrishData,
                    "\n", englishData,
                    "\n", scottishData,
                    "\n", welshData);
}

//add dropdown map region button to switch between regions
function addDropdownButton() {
    // Append the dropdown button container
    const dropdownContainer = d3.select('body').append('div')
        .classed('dropdown', true)
        .style('position', 'absolute')
        .style('top', '10px')  // Adjust as needed
        .style('left', '10px'); // Adjust as needed

    // Append the select element for the dropdown
    const dropdownSelect = dropdownContainer.append('select')
        .on('change', () => {
            // Handle the change event when an option is selected
            const selectedOption = dropdownSelect.property('value');
            console.log('Selected option:', selectedOption); 
            switch(selectedOption) {
                case 'UK':
                    chosenData = ukData;
                    break;
                case 'N. Ireland':
                    chosenData = nIrishData;
                    break;
                case 'England':
                    chosenData = englishData;
                    break;
                case 'Scotland':
                    chosenData = scottishData;
                    break;
                case 'Wales':
                    chosenData = welshData;
                    break;
                default:
                    chosenData = ukData;
                    break;
                }
                renderMap(chosenData);
                renderCharts(chosenData);
                museumStatsController.updateMuseumDetails(chosenData[1][0]);
                
            }); 

    // Append options to the select element
    dropdownSelect.selectAll('option')
        .data(['UK', 'N. Ireland', 'England', 'Scotland','Wales']) // test options
        .enter().append('option')
        .attr('value', d => d)
        .text(d => d);
}

// initialises the dashboard
function initVizElements(){
    
    // get the dimensions of the containers we want to populate
    let mapDiv = document.getElementById("map_view")
    let mapWidth = mapDiv.offsetWidth;
    let mapHeight = mapDiv.offsetHeight;
    
    let barChartDiv = document.getElementById("bar_chart_view");
    let chartWidth  = barChartDiv.offsetWidth;
    let chartHeight = barChartDiv.offsetHeight;
    
    summaryStatsController = new SummaryStatsController(
        "summary_stats_title",
        "depravation_index_val",
        "number_of_open_museums_val",
        "demographic_group_val",
        "number_of_closed_museums_val",
        "number_museums_locations_val",
        "accreditation_ratio_val",
        "most_common_subject_val",
        "most_common_museum_size_val",
        "least_common_subject_val",
        "most_common_museum_type_val"
    );
    
    museumStatsController = new MuseumDetailsController(
        "#museum_name",
        "#museum_address",
        "#museum_accreditation",
        "#museum_type",
        "#museum_size",
        "#museum_subject_category",
        "#museum_subject_specific",
        "#museum_year_opened",
        "#museum_year_closed"
    );

    map = new Map(mapDiv, mapWidth, mapHeight);
    
    barChart = new BarChart('div#bar_chart_view', chartWidth, chartHeight,  [20, 40, 40, 20]);
    barChart.setLabels('Subject Matter Categories', "");
    lineChart = new LineChart('div#line_chart_view', chartWidth, chartHeight,  [20, 40, 40, 20]);
    lineChart.setLabels('Museums open since 1900', "");
    donutChart = new DonutChart('div#donut_chart_view', chartWidth, chartHeight);

    museumStatsController.updateMuseumDetails(ukData[1][0]);
}

function setUpCallbacks(){
    selectMuseum = (e, d)=>{
        let museum = ukData[1].find(m => m.latitude === d[0] && m.longitude === d[1]);
        let museumNeighbours = ukData[1].filter(o=>o.admin_area_2 === museum.admin_area_2);
        museumStatsController.updateMuseumDetails(museum);
        renderCharts([museum.admin_area_2, museumNeighbours]);
    }
}

// renders the map and elements on it according to teh user's choice (hardcoded for now)
function renderMap(data){
    let dotSize = 1; // currently not working
    let mapMode = ukAreas;
    let museumData = data[1];
    let coordinates = [];
    
    switch(data[0]){
        case ukData[0]:
            museumData = ukData[1];    
            mapMode = ukAreas;
            break;
        case nIrishData[0]:
            museumData = nIrishData[1];        
            mapMode = noIrelandLGD;
            break;
        case englishData[0]:
            museumData = englishData[1];    
            mapMode = englandLAD;
            break;
        case scottishData[0]:
            museumData = scottishData[1];    
            mapMode = scotlandLAD;
            break;
        case welshData[0]:
            museumData = welshData[1];    
            mapMode = walesLAD;
            break;
        default:
            break;
    }
    museumData.forEach(museum => {
        coordinates.push([museum.latitude, museum.longitude, museum.governance_type, dotSize]);
        });
    map.baseMap(mapMode, d3.geoWinkel3);
    map.setPointClick(selectMuseum);
    map.renderPoints(coordinates);

}

// renders charts according to the user's choice (hardcoded for now)
function renderCharts(data){
    
    // variables
    let barChartData, lineChartData, donutChartData, mseumsOpenByYearHigh, museumsClosedByYearHigh;
        
    setSummaryStats(data[0], data[1]);
    barChartData = d3.rollups(data[1], D => D.length, d => d.subject_matter);    // displays the counts of museums by subject matter
    donutChartData = d3.rollups(data[1], (D)=> D.length, d=>d.accreditation);
    
    mseumsOpenByYearHigh = getOpenMuseumCounts(data[1]);
    museumsClosedByYearHigh = getClosedMuseumCounts(data[1]);
    lineChartData = calculateMuseumsOpenPerYear(mseumsOpenByYearHigh, museumsClosedByYearHigh);

    // Render Charts
    barChart.render(barChartData);
    lineChart.render(lineChartData.filter(d=>d[0]>1900));
    donutChart.render(donutChartData);
   
    console.log("Current Data Being Rendered:\nRegion:" , data,
                        "\nSubject Matter Counts:",  barChartData, 
                        "\nMuseums open by Year", lineChartData, 
                        "\nAccreditation counts:", donutChartData);
}

// set summary stats output
function setSummaryStats(choice, museumData){
    summaryStatsController.setPanelTitle(choice);
    summaryStatsController.setAreaDeprivationIndex(museumData);
    summaryStatsController.setOpenMuseums(museumData);
    summaryStatsController.setDemographicGroup(museumData);
    summaryStatsController.setClosedMuseums(museumData);
    summaryStatsController.setNumberLocations(museumData);
    summaryStatsController.setAccreditationRatio(museumData);
    summaryStatsController.setMostCommonSubject(museumData);
    summaryStatsController.setMostCommonSize(museumData);
    summaryStatsController.setLeastCommonSubject(museumData);
    summaryStatsController.setMostCommonType(museumData);
}

// returns the counts museums per year open
function getOpenMuseumCounts(museumData){
    return d3.rollups(museumData, (D)=> D.length, d=>d.year_opened_high).sort((a, b)=> d3.ascending(a[0], b[0]));
}

// returns the counts museums per year closed
function getClosedMuseumCounts(museumData){
    let count = d3.rollups(museumData, (D)=> D.length, d=>d.year_closed_high);
    count.shift();
    return count;
}

// calculates how many museums there are open in total every year
function calculateMuseumsOpenPerYear(yearOpenData, yearClosedData){
    
    // Calculate counts array: 
    // iterate through the data and record the museums open thus far
    let yearlyOpenMuseumsArray = yearOpenData.reduce((acc, curr) => {
        
        /*  1. init sum to be the number of museums open at:
                a. the current year + 0 if it's the first year
                b. the current year + the last year otherwise
            2. add this sum to the accumulator array
        */
        let sum = curr[1] + (acc.length ? acc[acc.length - 1] : 0);
        acc.push(sum);
        return acc;
    }, []);

    // Create two maps from the data:
    // one with the counts of open museums in total for a particular year
    let yearlyOpenMuseumsMap = yearOpenData.map((item, index) => [item[0], yearlyOpenMuseumsArray[index]])
                                        .reduce((map, [key, val]) => {
                                            map[key] = val;
                                            return map;
                                        }, {});
    // and one with how many museums closed that particular year
    let countsOfYearlyClosures = yearClosedData.map((item, index) => [item[0], yearlyOpenMuseumsArray[index]])
                                        .reduce((map, [key, val]) => {
                                            map[key] = val;
                                            return map;
                                        }, {});
    
    // Initialize an empty result array
    let result = [];

    // subtract the closures from the open museums count
    Object.keys(yearlyOpenMuseumsMap).forEach(key => {
        let value = yearlyOpenMuseumsMap[key] - (countsOfYearlyClosures[key] || 0);
        result.push([key, value]); 
    });

    return result;

}


