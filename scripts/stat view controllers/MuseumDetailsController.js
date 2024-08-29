
export default class MuseumDetailsController{

    // as laid out on the panel
    nameContainer;
    addressContainer;           sizeContainer;
    openMuseumsContainer;       subjectCategoryContainer;
    accreditationContainer;     subjectSpecificContainer;
    closedMuseumsContainer;     yearOpenedContainer;
    typeContainer;              yearClosedContainer;

    floatFormat;
    
    constructor(nameContainerID, 
                addressContainerID,
                accreditationContainerID,
                typeContainerID,
                sizeContainerID,
                subjectCategoryContainerID,
                subjectSpecificContainerID,
                yearOpenedContainerID,
                yearClosedContainerID){
                    this.nameContainer = d3.select(nameContainerID);   
                    this.addressContainer = d3.select(addressContainerID);   
                    this.accreditationContainer = d3.select(accreditationContainerID);   
                    this.typeContainer = d3.select(typeContainerID);
                    this.sizeContainer = d3.select(sizeContainerID);
                    this.subjectCategoryContainer = d3.select(subjectCategoryContainerID);
                    this.subjectSpecificContainer = d3.select(subjectSpecificContainerID);
                    this.yearOpenedContainer = d3.select(yearOpenedContainerID);
                    this.yearClosedContainer = d3.select(yearClosedContainerID);
                    

    }

    updateMuseumDetails(museum){
        console.log("SELECTED:", museum);
        this.nameContainer.text(museum.museum_name);
        this.addressContainer.text(museum.address_line_1 + ', ' + museum.address_line_2  + ", " + museum.city + ', ' + museum.postcode);
        this.accreditationContainer.text(museum.accreditation);
        this.typeContainer.text(museum.governance_subtype + " - " + museum.governance_type); 
        this.sizeContainer.text(museum.size); 
        this.subjectCategoryContainer.text(museum.subject_matter); 
        this.subjectSpecificContainer.text(museum.subject_matter_subtype_1); 
        this.yearOpenedContainer.text(museum.year_opened_low); 
        if (isNaN(museum.year_closed_low)){
            this.yearClosedContainer.text('-');    
        }else{
            this.yearClosedContainer.text(museum.year_closed_low === '0' ? 'N/A' : museum.year_closed_low); 
    }
    }
}