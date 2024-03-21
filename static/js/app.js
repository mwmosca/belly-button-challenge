// Get the data endpoint
const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';

// Initializes the page with default plots
function init() {
    // Fetch the JSON data and create plots
    d3.json(url).then(function(data) {
        // Add data to the dropdown
        let dropDown = d3.select('select');
        for (i = 0; i < data['names'].length; i++) {
            dropDown.append('option').text(data['names'][i]);
        }

        // Create a trace for a bar chart to display the top 10 OTUs found in the selected individual
        let traceTop10 = {
            type: 'bar',
            orientation: 'h',
            x: data.samples[0].sample_values.slice(0, 10).toReversed(),
            y: data.samples[0].otu_ids.slice(0, 10).toReversed().map((x) => `OTU ${x}`)
        };
    
        let plots = [traceTop10]
    
        Plotly.newPlot('bar',plots)
    });
}

init();
