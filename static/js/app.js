// Get the data endpoint
const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';

// Load the data to be used locally
const dataset = {};
d3.json(url).then(function(data) {
    for (i = 0; i < data['names'].length; i++) {
        dataset[data['names'][i]] = data['samples'][i];
    }

    init(dataset, 940);
});

// Initializes the page with default plots
function init(dataset, testSubjectId) { 
    // Add data to the dropdown
    let dropDown = d3.select('select');
    for (const key in dataset) {
        dropDown.append('option').text(key);
    }

    // Set up plots
    createBar(dataset[testSubjectId]);
}

// Create a trace for a bar chart to display the top 10 OTUs found in the selected individual
function createBar(testSubjectData) {
    let traceTop10 = {
        type: 'bar',
        orientation: 'h',
        x: testSubjectData.sample_values.slice(0, 10).toReversed(),
        y: testSubjectData.otu_ids.slice(0, 10).toReversed().map((x) => `OTU ${x}`)
    };
    let plots = [traceTop10];
    Plotly.newPlot('bar',plots);
}

// Updates plots when a new test subject is selected from the dropdown
function optionChanged() {
    let testSubjectId = d3.select('#selDataset').property('value');
}
