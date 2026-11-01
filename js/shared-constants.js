
// Exercise 6.1 - Shared Constants

// Set up dimensions and margins
const margin = {
    top: 40,
    right: 30,
    bottom: 55,
    left: 70
};

const width = 800;
const height = 400;

const innerWidth =
    width - margin.left - margin.right;

const innerHeight =
    height - margin.top - margin.bottom;

// Set up colours
const barColor = "#606464";

const bodyBackgroundColor = "#fffaf0";

// Set up scales
const xScale = d3.scaleLinear();

const yScale = d3.scaleLinear();

// Create bin generator
const binGenerator = d3.bin()
    .value(d => d.energyConsumption);

// Exercise 6.2 - Screen technology filter options

const filters_screen = [
    {
        id: "all",
        label: "All",
        isActive: true
    },
    {
        id: "LED",
        label: "LED",
        isActive: false
    },
    {
        id: "LCD",
        label: "LCD",
        isActive: false
    },
    {
        id: "OLED",
        label: "OLED",
        isActive: false
    }
];

// Exercise 6.3 - Shared variables for Scatter Plot

// Scatter Plot group
let innerChartS;

// Scatter Plot scales
const xScaleS = d3.scaleLinear();
const yScaleS = d3.scaleLinear();

// Colour scale for LED, LCD and OLED
const colorScale = d3.scaleOrdinal();

// Tooltip dimensions
const tooltipWidth = 65;
const tooltipHeight = 32;
