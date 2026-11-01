
// Exercise 6.1 - Load TV Data

function loadTVData() {

    d3.csv("data/W6_TVdata.csv", row => ({

        brand: String(row.brand ?? "").trim(),

        model: String(row.model ?? "").trim(),

        screenSize:
            row.screenSize === ""
                ? NaN
                : Number(row.screenSize),

        screenTech:
            String(row.screenTech ?? "").trim(),

        star:
            row.star === ""
                ? NaN
                : Number(row.star),

        energyConsumption:
            row.energyConsumption === ""
                ? NaN
                : Number(row.energyConsumption)

    }))
    .then(data => {

        // Remove records without valid energy data
        const validData = data.filter(d =>
            Number.isFinite(d.energyConsumption) &&
            d.energyConsumption >= 0
        );

        console.log("Loaded TV data:", data.length);

        console.log(
            "Valid energy records:",
            validData.length
        );

        console.table(validData.slice(0, 5));

        if (validData.length === 0) {
            throw new Error(
                "No valid energyConsumption data"
            );
        }

        // Update status
        const status =
            document.querySelector("#data-status");

        if (status) {
            status.textContent =
                `${validData.length} TV records loaded`;
        }

// Exercise 6.1 - Draw Histogram
drawHistogram(validData);

// Exercise 6.2 - Create Filters
populateFilters(validData);

// Exercise 6.3 - Draw Scatter Plot
drawScatterplot(validData);

// Exercise 6.3 - Create Tooltip
createTooltip();

// Exercise 6.3 - Handle mouse interactions
handleMouseEvents();


    })
    .catch(error => {

        console.error("Error loading CSV:", error);

        const status =
            document.querySelector("#data-status");

        if (status) {
            status.textContent =
                "Could not load TV data. Check Console.";
        }

    });
}

// Run after the page has loaded
if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        loadTVData
    );

} else {

    loadTVData();

}
