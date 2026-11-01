// Exercise 6.1 - draw a histogram from individual TV records
function drawHistogram(data) {
    const validData = data.filter(d =>
        Number.isFinite(d.energyConsumption) && d.energyConsumption >= 0
    );

    if (validData.length === 0) {
        d3.select("#histogram").text("No valid energy-consumption data.");
        return;
    }

    // Generate bins with d3.bin (shared with Exercise 6.2).
    const bins = binGenerator(validData);
    const minEng = bins[0].x0;
    const maxEng = bins[bins.length - 1].x1;
    const binsMaxLength = d3.max(bins, d => d.length);

    console.log("Histogram bins:", bins);
    console.log("Rows:", validData.length, "Bins:", bins.length);

    xScale.domain([minEng, maxEng]).range([0, innerWidth]);
    yScale.domain([0, binsMaxLength]).nice().range([innerHeight, 0]);

    const container = d3.select("#histogram");
    container.selectAll("*").remove();

    const svg = container.append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("role", "img")
        .attr("aria-label", "Histogram of television annual energy consumption");

    const innerChart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    innerChart.selectAll(".histogram-bar")
        .data(bins)
        .join("rect")
        .attr("class", "histogram-bar")
        .attr("x", d => xScale(d.x0))
        .attr("y", d => yScale(d.length))
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0)))
        .attr("height", d => innerHeight - yScale(d.length))
        .attr("fill", barColor)
        .attr("stroke", bodyBackgroundColor)
        .attr("stroke-width", 2)
        .append("title")
        .text(d => `${d.x0}–${d.x1} kWh/year: ${d.length} TVs`);

    innerChart.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(10));

    innerChart.append("g")
        .call(d3.axisLeft(yScale).ticks(6));

    innerChart.append("text")
        .attr("x", 0)
        .attr("y", -15)
        .attr("class", "axis-label")
        .text("Frequency");

    innerChart.append("text")
        .attr("x", innerWidth)
        .attr("y", innerHeight + 45)
        .attr("text-anchor", "end")
        .attr("class", "axis-label")
        .text("Labelled Energy Consumption (kWh/year)");
}
