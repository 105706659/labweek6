
// Exercise 6.3: Scatter Plot

function drawScatterplot(data) {

    // Keep records with valid star rating and energy values
    const valid = data.filter(d =>
        Number.isFinite(d.star) &&
        Number.isFinite(d.energyConsumption) &&
        d.star >= 0 &&
        d.energyConsumption >= 0 &&
        d.screenTech
    );

    if (valid.length === 0) {
        console.error("No valid data for Scatter Plot");
        return;
    }

    // Clear old scatter plot
    d3.select("#scatterplot").selectAll("*").remove();

    // Create SVG
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("role", "img")
        .attr(
            "aria-label",
            "Scatter plot of TV energy consumption by star rating"
        );

    // Create inner chart
    innerChartS = svg.append("g")
        .attr(
            "transform",
            `translate(${margin.left}, ${margin.top})`
        );

    // X scale: Star Rating
    xScaleS
        .domain([
            0,
            Math.max(1, d3.max(valid, d => d.star))
        ])
        .range([0, innerWidth]);

    // Y scale: Energy Consumption
    yScaleS
        .domain([
            0,
            Math.max(
                1,
                d3.max(valid, d => d.energyConsumption)
            )
        ])
        .nice()
        .range([innerHeight, 0]);

    // Colour scale
    colorScale
        .domain(["LED", "LCD", "OLED"])
        .range([
            "#1f77b4", // LED - Blue
            "#ff7f0e", // LCD - Orange
            "#2ca02c"  // OLED - Green
        ])
        .unknown("#777777");

    // Draw scatter plot circles
    innerChartS
        .selectAll("circle.scatter-point")
        .data(valid)
        .join("circle")
        .attr("class", "scatter-point")
        .attr("cx", d => xScaleS(d.star))
        .attr("cy", d => yScaleS(d.energyConsumption))
        .attr("r", 3)
        .attr("fill", d => colorScale(d.screenTech))
        .attr("opacity", 0.5);

    // Add X axis
    innerChartS.append("g")
        .attr(
            "transform",
            `translate(0, ${innerHeight})`
        )
        .call(
            d3.axisBottom(xScaleS).ticks(8)
        );

    // Add Y axis
    innerChartS.append("g")
        .call(
            d3.axisLeft(yScaleS).ticks(7)
        );

    // Y axis label
    innerChartS.append("text")
        .attr("class", "axis-label")
        .attr("x", 0)
        .attr("y", -14)
        .text(
            "Labelled Energy Consumption (kWh/year)"
        );

    // X axis label
    innerChartS.append("text")
        .attr("class", "axis-label")
        .attr("x", innerWidth)
        .attr("y", innerHeight + 45)
        .attr("text-anchor", "end")
        .text("Star Rating");

    // Create legend in top-right corner
    const legend = svg.append("g")
        .attr(
            "transform",
            `translate(${width - 105}, ${margin.top})`
        );

    // Legend entries
    ["LED", "LCD", "OLED"].forEach((type, i) => {

        const item = legend.append("g")
            .attr(
                "transform",
                `translate(0, ${i * 20})`
            );

        // Colour rectangle
        item.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", colorScale(type));

        // Category label
        item.append("text")
            .attr("x", 17)
            .attr("y", 9)
            .attr("font-size", 13)
            .text(type);
    });

    console.log(
        "Scatter Plot records:",
        valid.length
    );
}
