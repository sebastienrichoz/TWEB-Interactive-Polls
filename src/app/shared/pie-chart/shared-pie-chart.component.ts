import { Component, OnInit } from '@angular/core';
import {single, multi} from '../../pollcreator/data';

// declare let d3: any;

@Component({
    selector: 'shared-pie-chart',
    templateUrl: 'shared-pie-chart.component.html',
    styleUrls: ['shared-pie-chart.component.css']
})
export class SharedPieChartComponent implements OnInit {

    ngOnInit() {}

    // constructor() { }
    //
    // ngOnInit() {
    //     var width = 200,
    //         height = 200,
    //         radius = Math.min(width, height) / 2;
    //
    //     var color = d3.scaleOrdinal()
    //         .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    //
    //     var arc = d3.arc()
    //         .outerRadius(radius - 10)
    //         .innerRadius(0);
    //
    //     var labelArc = d3.arc()
    //         .outerRadius(radius - 40)
    //         .innerRadius(radius - 40);
    //
    //     var pie = d3.pie()
    //         .sort(null)
    //         .value(function(d) { return d.population; });
    //
    //     var svg = d3.select(".pie-chart").empty()
    //         .append("svg")
    //         .attr("width", width)
    //         .attr("height", height)
    //         .append("g")
    //         .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    //
    //     d3.csv("public/data/data.csv", type, function(error, data) {
    //         if (error) throw error;
    //
    //         var g = svg.selectAll(".arc")
    //             .data(pie(data))
    //             .enter().append("g")
    //             .attr("class", "arc");
    //
    //         g.append("path")
    //             .attr("d", arc)
    //             .style("fill", function(d) { return color(d.data.age); });
    //
    //         g.append("text")
    //             .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
    //             .attr("dy", ".35em")
    //             .text(function(d) { return d.data.age; });
    //     });
    //
    //     function type(d) {
    //         d.population = +d.population;
    //         return d;
    //     }
    // }

}
