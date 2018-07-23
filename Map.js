function loadMap(){
    var projection = d3.geo.albersUsa()
				   .translate([width/2, height/2])    // translate to center of screen
				   .scale([1000]);          // scale things down so see entire US
        
// Define path generator
    var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);  // tell path generator to use albersUsa projection


    d3.json("SPD_Beats_WGS84.json", function(error, data) {
        if (error) {
            console.log(error);
        }
        console.log
        d3.select("svg").selectAll("path")
            .data(data.geometries)
            .enter()
            .append("path")
            .attr("d", path)
            .style("stroke", "#fff")
            .style("stroke-width", "1")
            .style("fill", "red");

    })
}