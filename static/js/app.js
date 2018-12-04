function buildMetadata(data) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  
  var sample = d3.select("#selDataset").node().value;
  console.log(sample);
  
  var url=`/metadata/${sample}`;
  
  d3.select("#sample-metadata").selectAll("h6").remove();
  d3.json(url).then(function(data) {
    console.log(data);
    Object.entries(data).forEach(([key, value]) => {
      d3.select("#sample-metadata")
        .append("h6")
        .text(`${key}: ${value}`);
      });
    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

var url = `/samples/${sample}`;

d3.json(url).then(function(data){
  console.log(data);
  var sample_values = data.sample_values;
  var final_values = sample_values.sort(function(a,b){return b-a}).slice(0, 10);
  var otu_ids = data.otu_ids;
  var pie_data = [{
    values: final_values,
    labels: otu_ids,
    type: 'pie'
  }];
  Plotly.newPlot("pie", pie_data);
});

d3.json(url).then(function(data) {
  var trace1 = [{
    x : data.otu_ids,
    y : data.sample_values,
    text: data.otu_labels,
    mode: 'markers',
    marker: {
      size: data.sample_values,
      sizemode:'area',
      sizeref: 0.07,
      color: data.otu_ids
    }
  }]
  Plotly.newPlot("bubble", trace1);
  });
 

}
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
