// 'export' - to make it a module
// 'default' - only class to be exported
export default class SummaryStatsController{

    // as laid out on the panel
    areaTitle;
    depravationIndex;    openMuseums;
    demographicGroup;    closedMuseums;
    numberLocations;     accreditationRatio;
    mostCommonSubject;   mostCommonSize;
    leastCommonSubject;  mostCommonType;

    floatFormat;
    
    constructor(titleContainer, 
                depravationIndexContainer,
                openMuseumsContainer,
                demographicGroupContainer,
                closedMuseumsContainer,
                numberLocationsContainer,
                accreditationRatioContainer,
                mostCommonSubjectContainer,
                mostCommonSizeContainer,
                leastCommonSubjectContainer,
                mostCommonTypeContainer){
        
        this.areaTitle = document.getElementById(titleContainer);
        
        this.depravationIndex = document.getElementById(depravationIndexContainer);
        this.openMuseums = document.getElementById(openMuseumsContainer);
        this.demographicGroup = document.getElementById(demographicGroupContainer);
        this.closedMuseums = document.getElementById(closedMuseumsContainer);
        this.numberLocations = document.getElementById(numberLocationsContainer);
        this.accreditationRatio = document.getElementById(accreditationRatioContainer);
        this.mostCommonSubject = document.getElementById(mostCommonSubjectContainer);
        this.mostCommonSize = document.getElementById(mostCommonSizeContainer);
        this.leastCommonSubject = document.getElementById(leastCommonSubjectContainer);
        this.mostCommonType = document.getElementById(mostCommonTypeContainer);

        this.floatFormat = d3.format(".2f");
    }

    setPanelTitle(choice){
        this.areaTitle.textContent = choice;
    }

    setAreaDeprivationIndex(data){
        let index = data.map(d=>d.area_deprivation_index)
                        .reduce((acc, curr)=> acc + curr, 0)/data.map(d=>d.area_deprivation_index).length
        this.depravationIndex.textContent = this.floatFormat(index);
    }

    setOpenMuseums(data){
        let openMuseumsVals = data.map(d=>d.year_closed_high)
        let count = 0;
        openMuseumsVals.forEach(function(val) {
            if (isNaN(val)){ count ++;}
        });
        this.openMuseums.textContent = count;
    }

    setDemographicGroup(data){
        let groupsAndCounts = Array.from(
            d3.rollup(data, v=>v.length, d=>d.area_geodemographic_supergroup));
            groupsAndCounts.sort((a,b)=> b.count - a.count);

        this.demographicGroup.textContent = groupsAndCounts[0][0];
    }

    setClosedMuseums(data){
        let closedMuseumsVals = data.map(d=>d.year_closed_high)
        let count = 0;
        closedMuseumsVals.forEach(function(val) {
            if (!isNaN(val)){ count ++;}
        });
        this.closedMuseums.textContent = count;
    }

    setNumberLocations(data){
        let citiesMap = d3.rollup(data, v=>v.length, d=>d.city);
        this.numberLocations.textContent = citiesMap.size;
    }

    setAccreditationRatio(data){
        let accreditationArray = d3.rollups(data, v=>v.length, d=>d.accreditation);
        this.accreditationRatio.textContent = "1 : " + 
                            this.floatFormat(accreditationArray[0][1]/accreditationArray[1][1]);
    }

    setMostCommonSubject(data){
        let subjectsAndCounts = Array.from(
            d3.rollup(data, v=>v.length, d=>d.subject_matter));
            subjectsAndCounts.sort((a,b)=> b[1] - a[1]);
        this.mostCommonSubject.textContent = subjectsAndCounts[0][0];
        if(subjectsAndCounts[0][1]===subjectsAndCounts[1][1]){
            this.mostCommonSubject.textContent = "-";
        }
    }

    setMostCommonSize(data){
        let sizesAndCounts = Array.from(
            d3.rollup(data, v=>v.length, d=>d.size));
            sizesAndCounts.sort((a,b)=> b.count - a.count);
        this.mostCommonSize.textContent = sizesAndCounts[0][0];
        if(sizesAndCounts[0][1]===sizesAndCounts[1][1]){
            this.mostCommonSize.textContent = "-";
        }
    }

    setLeastCommonSubject(data){
        let subjectsAndCounts = Array.from(
            d3.rollup(data, v=>v.length, d=>d.subject_matter));
            subjectsAndCounts.sort((a,b)=> a[1] - b[1]);
        this.leastCommonSubject.textContent = subjectsAndCounts[0][0];
        if(subjectsAndCounts[0][1]===subjectsAndCounts[1][1]){
            this.leastCommonSubject.textContent = "-";
        }
    }

    setMostCommonType(data){
        let typesAndCounts = Array.from(
            d3.rollup(data, v=>v.length, d=>d.governance_type));
            typesAndCounts.sort((a,b)=> b[1] - a[1]);
        this.mostCommonType.textContent = typesAndCounts[0][0];
    }
}
