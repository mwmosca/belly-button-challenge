// Get the data endpoint
const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';
// Create a container to store the data locally
const dataset = {};

d3.json(url).then(function(data) {
    // Load the data to be used locally
    for (i = 0; i < data['names'].length; i++) {
        dataset[data['names'][i]] = {
            samples: data['samples'][i],
            metadata: ` ID: ${data['metadata'][i]['id']}
                        ETHNICITY: ${data['metadata'][i]['ethnicity']}
                        GENDER: ${data['metadata'][i]['gender']}
                        AGE: ${data['metadata'][i]['age']}
                        LOCATION: ${data['metadata'][i]['location']}
                        BBTYPE: ${data['metadata'][i]['bbtype']}
                        WFREQ: ${data['metadata'][i]['wfreq']}`
        };
    }

    // Initialize the webpage
    init(dataset, data['names'][0]);
});

// Initializes the page with default plots
function init(dataset, testSubjectId) { 
    // Add test subject IDs to the dropdown
    let dropDown = d3.select('#selDataset');
    for (const key in dataset) {
        dropDown.append('option').text(key);
    }

    // Set up plots and demographic info
    createBar(dataset[testSubjectId]['samples']);
    createBubble(dataset[testSubjectId]['samples']);
    d3.select('#sample-metadata').append('card-text').text(dataset[testSubjectId]['metadata']);
}

// Updates plots and demographic info when a new test subject is selected from the dropdown
function optionChanged() {
    let testSubjectId = d3.select('#selDataset').property('value');
    createBar(dataset[testSubjectId]['samples']);
    createBubble(dataset[testSubjectId]['samples']);
    d3.select('card-text').text(dataset[testSubjectId]['metadata']);
}

// Create a bar chart to display the top 10 OTUs found in the selected individual
function createBar(testSubjectData) {
    let traceBar = {
        type: 'bar',
        orientation: 'h',
        x: testSubjectData.sample_values.slice(0, 10).toReversed(),
        y: testSubjectData.otu_ids.slice(0, 10).toReversed().map((x) => `OTU ${x}`)
    };
    let plots = [traceBar];
    let layout = {
        title: {
            text: 'Top 10 Bacteria Cultures Found'
        },
        xaxis: {
            title: {
                text: 'Number of Bacteria'
            }
        }
    };
    Plotly.newPlot('bar', plots, layout);
}

// Create a bubble chart to compare sample values among all OTUs found in the selected individual
function createBubble(testSubjectData) {
    let traceBubble = {
        x: testSubjectData.otu_ids,
        y: testSubjectData.sample_values,
        mode: 'markers',
        marker: {
            size: testSubjectData.sample_values,
            color: testSubjectData.otu_ids
        },
        text: testSubjectData.otu_labels
    };
    let plots = [traceBubble];
    let layout = {
        title: {
            text: 'Bacteria Cultures Per Sample'
        },
        xaxis: {
            title: {
                text: 'OTU ID'
            }
        },
        yaxis: {
            title: {
                text: 'Number of Bacteria'
            }
        }
    };
    Plotly.newPlot('bubble', plots, layout);
}