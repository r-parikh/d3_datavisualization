/**
 * Created by rutul on 4/14/2017.
 */

d3.queue()
    .defer(d3.json, "countries.geo.json")
    .defer(d3.csv, "g20_2015.csv")
    .defer(d3.csv, "brics.csv")
    .await(mainFunction);

function mainFunction(errors, countrydata, g20, brics){

    projectMap(countrydata, g20, "#main-choropleth");
}

function projectMap(countrydata, csvdata, id) {

    var w = 1498;    //providing the dimensions for the svg
    var h = 600;

    var mapprojection = d3.geoEquirectangular()     //generating the map projection
        .fitExtent([[10,10],[w-20,h+100]], countrydata).precision(.1); // allows us to leave some padding around map

    var mapSvg = d3.select(id).append("svg")
        .attr("width", w)
        .attr("height", h);

    var countries = {};
    var mapdata = d3.entries(csvdata);
    //console.log(mapdata["7"].value["Country Name"]);

    mapdata.map(function(d,i){      //mapping the countries' name while counting how many times the country's name has been occurred
        if(countries[d.value["Country Name"]]==undefined){
            countries[d.value["Country Name"]] = 1;
        }
        else{
            countries[d.value["Country Name"]] += 1;
        }
    });
    //console.log(countries);

    //console.log(countrydata.features["0"].properties["name"]);
    var path = d3.geoPath()     //drawing the map by using the path
        .projection(mapprojection);

    countrydata.features.map(function(d) {
        mapSvg.append("path")
            .datum(d)
            .attr("d", path)
            .style("stroke", function (d) {
                if (d.properties.name == "Antarctica")
                    return "none";
                else
                    return "grey";


            })
            .attr("class",function (e) {
                var name = e.properties["name"];
                if (countries[name] == undefined)
                    return "notg20";
                else
                    return "region"
            })
            .on("mouseover", function (d) {
                d3.select(this).attr("class", function (e) {
                    var name = e.properties["name"];
                    if (countries[name] == undefined)
                        return "notg20";
                    else
                        return "region hover";

                });
                d3.select(this).on("mouseout", function(d) {
                    d3.select(this).attr("class", function (e) {
                        var name = e.properties["name"];
                        if (countries[name] == undefined)
                            return "notg20";
                        else
                            return "region";

                    });
                })
            })
            .on("click", function (d) {
                svg.selectAll('path').attr('class','region');
                d3.selectAll('path').on("mouseover", function (d) {
                    d3.select(this).attr("class", "region hover");
                    d3.select(this).on("mouseout", function(d) {
                        d3.select(this).attr("class", "region");
                    });
                });
                d3.select(this).on("mouseout", null);
                d3.select(this).on('mouseover',null);
                d3.select(this).attr('class','selected');
            });

    });

}
//---------------------------------------------------------------------------------------------------------------------------
