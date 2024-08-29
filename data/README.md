Project page: https://museweb.dcs.bbk.ac.uk/home

Glossary page: https://museweb.dcs.bbk.ac.uk/glossary

License: CC-BY


Columns:
 - museum_id: entry id in original database
 - museum_name: name of museum
 - address_line_1, address_line_2, city, postcode: postal address of museum (may include blank fields)
 - latitude, longitude: geographical coordinates of museum
 - admin_area_...: UK administrative organisation for the location of the museum
      - admin_area_full: full string (each level is separated by "/", sublevel types are described in parenthesis)
      - admin_area_1: top level, e.g., nation
      - admin_area_2, admin_area_2_type: second level, e.g., region or council
      - admin_area_3, admin_area_3_type: third level, e.g., English county or London borough (blank for Scotland, Wales and Northern Ireland)
      - admin_area_4, admin_area_4_type: fourth level, e.g., English district or borough
 - accreditation: accreditation status of museum by local authority (Arts Council England, the Welsh Government, Museums Galleries Scotland or the Northern Ireland Museums Council)
 - governance_...: museum governance
      - governance_type: independent, government, university or unknown
      - governance_subtype: detailed independent or government governance
 - size: size estimation by number of yearly visits: small (<10k); medium (<50k); large (<1M); huge (>1M)
 - size_provenance: origin of size estimation (surveys, papers, MappingMuseum project, prediction)
 - subject_matter_...: category of museum by topic
      - subject_matter_full: full string (each level is separated by "/")
      - subject_matter: top level topic
      - subject_matter_subtype_1: second level topic (may be blank)
      - subject_matter_subtype_2: third level topic (mostly blank)
 - year_opened_...: estimate of year when museum was opened
      - year_opened_low: lower estimate for museum opening
      - year_opened_high: higher estimate for museum opening (if identical to lower estimate, this is the exact year)
 - year_closed_...: estimate of year when museum was opened
      - year_closed_low: lower estimate for museum closing (na if museum was still opened in 2021)
      - year_closed_high: higher estimate for museum closing (if identical to lower estimate, this is the exact year)
 - data_primary_provenance: provenance of museum entry (see glossary page for more detail)
 - area_deprivation_index: 2011 deprivation index of small area (average of 1500 people); 1 most deprived - 10 least deprived; each country has a different index
      - area_deprivation_index_crime
      - area_deprivation_index_education
      - area_deprivation_index_employment
      - area_deprivation_index_health
      - area_deprivation_index_housing
      - area_deprivation_index_income
      - area_deprivation_index_services
 - area_geodemographic_...: description of small area using population characteristics
      - area_geodemographic_supergroup
      - area_geodemographic_group
      - area_geodemographic_subgroup
