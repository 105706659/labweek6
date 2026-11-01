
// =======================================
// WEEK 6 - INTERACTIONS
// Exercise 6.2 + Exercise 6.4
// =======================================

"use strict";


// =======================================
// EXERCISE 6.2 - INTERACTIVE FILTERS
// =======================================

function populateFilters(data) {

    const controls = d3.select("#filters_screen");

    if (controls.empty()) {
        console.error("Missing #filters_screen");
        return;
    }

    // Update histogram when selecting a filter
    function updateHistogram(filterId) {

        // Step 1: Filter the dataset
        const updatedData = filterId === "all"
            ? data
            : data.filter(
                tv => tv.screenTech === filterId
            );

        // Step 2: Generate bins
        // Use the original bin boundaries
        const originalBins = binGenerator(data);

        const thresholds = originalBins
            .slice(0, -1)
            .map(bin => bin.x1);

        const fixedBinGenerator = d3.bin()
            .value(tv => tv.energyConsumption)
            .domain(xScale.domain())
            .thresholds(thresholds);

        const updatedBins =
            fixedBinGenerator(updatedData);

        // Step 3: Update histogram rectangles
        const bars = d3.select("#histogram")
            .selectAll("rect.histogram-bar")
            .data(updatedBins)
            .join("rect")
            .attr("class", "histogram-bar")
            .attr("x", d => xScale(d.x0))
            .attr("width", d =>
                Math.max(
                    0,
                    xScale(d.x1) - xScale(d.x0)
                )
            )
            .attr("fill", barColor)
            .attr("stroke", bodyBackgroundColor)
            .attr("stroke-width", 2);

        // Update tooltips on histogram bars
        bars.each(function(d) {

            const rect = d3.select(this);

            let title = rect.select("title");

            if (title.empty()) {
                title = rect.append("title");
            }

            title.text(
                `${d.x0} - ${d.x1} kWh/year: ${d.length} TVs`
            );
        });

        // Step 4: Add transition
        bars.interrupt()
            .transition()
            .duration(500)
            .ease(d3.easeCubicInOut)
            .attr("y", d => yScale(d.length))
            .attr("height", d =>
                innerHeight - yScale(d.length)
            );

        console.log(
            "Selected filter:", filterId,
            "TV records:", updatedData.length
        );
    }


    // Create filter buttons
    controls
        .selectAll("button.filter")
        .data(filters_screen, d => d.id)
        .join("button")
        .attr("type", "button")
        .attr("class", "filter")
        .classed("active", d => d.isActive)
        .attr("aria-pressed", d =>
            String(d.isActive)
        )
        .text(d => d.label)

        // Handle button click
        .on("click", function(event, d) {

            if (d.isActive) {
                return;
            }

            // Update active status
            filters_screen.forEach(filter => {
                filter.isActive =
                    filter.id === d.id;
            });

            // Update button appearance
            controls
                .selectAll("button.filter")
                .classed(
                    "active",
                    filter => filter.isActive
                )
                .attr("aria-pressed", filter =>
                    String(filter.isActive)
                );

            // Update histogram
            updateHistogram(d.id);
        });

}


// =======================================
// EXERCISE 6.4 - CREATE SVG TOOLTIP
// =======================================

function createTooltip() {

    // Check scatterplot exists
    if (!innerChartS) {
        console.error(
            "Scatterplot has not been created"
        );
        return;
    }

    // Remove previous tooltip
    innerChartS
        .selectAll("g.tooltip")
        .remove();

    // Create SVG tooltip group
    const tooltip = innerChartS
        .append("g")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("pointer-events", "none");

    // Add background rectangle
    tooltip
        .append("rect")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("fill", barColor)
        .attr("fill-opacity", 0.75);

    // Add text inside tooltip
    tooltip
        .append("text")
        .text("N/A")
        .attr("x", tooltipWidth / 2)
        .attr("y", tooltipHeight / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "white")
        .style("font-size", "16px")
        .style("font-weight", 900);

}


// =======================================
// EXERCISE 6.4 - MOUSE EVENTS
// =======================================

function handleMouseEvents() {

    if (!innerChartS) {
        console.error(
            "Scatterplot has not been created"
        );
        return;
    }

    const tooltip =
        innerChartS.select("g.tooltip");

    if (tooltip.empty()) {
        console.error(
            "Tooltip has not been created"
        );
        return;
    }

    // Select scatterplot circles
    innerChartS
        .selectAll("circle.scatter-point")

        // -------------------------------
        // MOUSE ENTER
        // -------------------------------
        .on("mouseenter", function(event, d) {

            console.log("Mouse entered circle:", d);

            // Get circle coordinates
            const cx = Number(
                this.getAttribute("cx")
            );

            const cy = Number(
                this.getAttribute("cy")
            );

            // Calculate tooltip X position
            const x = Math.max(
                0,
                Math.min(
                    innerWidth - tooltipWidth,
                    cx - tooltipWidth / 2
                )
            );

            // Calculate tooltip Y position
            const preferredY =
                cy - tooltipHeight - 12;

            const y = preferredY >= 0
                ? preferredY
                : Math.min(
                    innerHeight - tooltipHeight,
                    cy + 12
                );

            // Display TV screen size
            tooltip
                .select("text")
                .text(
                    Number.isFinite(d.screenSize)
                        ? d.screenSize
                        : "N/A"
                );

            // Show tooltip near the circle
            tooltip
                .interrupt()
                .attr(
                    "transform",
                    `translate(${x}, ${y})`
                )
                .transition()
                .duration(200)
                .style("opacity", 1);

            // Highlight circle
            d3.select(this)
                .attr("opacity", 1)
                .attr("r", 5);

        })

        // -------------------------------
        // MOUSE LEAVE
        // -------------------------------
        .on("mouseleave", function(event, d) {

            console.log("Mouse left circle:", d);

            // Hide tooltip
            tooltip
                .interrupt()
                .transition()
                .duration(150)
                .style("opacity", 0);

            // Restore circle appearance
            d3.select(this)
                .attr("opacity", 0.5)
                .attr("r", 3);

        });

}
