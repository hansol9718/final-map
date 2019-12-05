var width = 1000,
    height = 1000;

var svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

var g = svg.append('g');

d3.json("countries.geojson").then(d=>{

var geoProj = d3.geoMercator()
    .scale(150)
    .rotate([0, 0])
    .center([0, 42.313])
    .translate([width/2, height/2]);

var geoPath = d3.geoPath()
    .projection(geoProj);

g.selectAll('path')
    .data(d.features)
    .enter()
    .append('path')
    .attr('fill', '#ccc')
    .attr('d', geoPath);

d3.json("points.json").then(d=>{
g.selectAll('circle')
    .data(d.features)
    .enter()
    .append('path')
    .attr('fill', 'red')
    .attr('stroke', '#999')
    .attr('d', geoPath)

    var links = [];
    for (let i = 0; i < d.features.length - 1; i++) {
        links.push({
            type: "LineString",
            coordinates: [[geoProj(d.features[i].geometry.coordinates)[0],  geoProj(d.features[i].geometry.coordinates)[1]],
             [geoProj(d.features[i+1].geometry.coordinates)[0],  geoProj(d.features[i+1].geometry.coordinates)[1]]]
        });
    }

    var p = svg.append("g");
    p.selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("x1", d=>d.coordinates[0][0])
        .attr("x2", d=>d.coordinates[1][0])
        .attr("y1", d=>d.coordinates[0][1])
        .attr("y2", d=>d.coordinates[1][1])
        .attr("id", function(d, a) {
            return "l" + a
        }).attr("stroke", "blue")
        .style("opacity", 0)
        .style("opacity", "1")

    p.selectAll("line").each(function(t, d) {
        var offset = d3.select("#l" +d).node().getTotalLength();
        d3.select("#l" + d)
        .attr("stroke-dasharray", offset + "0, " + offset)
        .attr("stroke-dashoffset", offset)
        .transition()
        .duration(300).delay(300 * d).ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        .style("stroke-width", 2)
    })
})
});