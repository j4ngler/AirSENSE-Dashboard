
var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var rainfall = {
    type: 'line',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: 'My first Dataset',
            backgroundColor: window.chartColors.red,
            borderColor: window.chartColors.red,
            data: [3,9,2,1,6,4,8],
            fill: true,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Rainfall'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            x: {
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Month'
                }
            },
            y: {
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Value'
                },
                ticks: {
                    max: 5,
                    min: 0,
                    stepSize: 5
                }
            }
        },
        elements: {
            point:{
                radius: 0
            }
        },
    }
};


var wind = {
    type: 'line',
    data: {
        labels: ['January', 'February', 'March', 'April'],
        datasets: [{
            label: 'My First dataset',
            backgroundColor: window.chartColors.red,
            borderColor: window.chartColors.red,
            data: [1,6,3,5],
            fill: false,
        }, {
            label: 'My Second dataset',
            fill: false,
            backgroundColor: window.chartColors.blue,
            borderColor: window.chartColors.blue,
            data: [4,2,3,1],
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Wind',
            position: 'top'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            x: {
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Month'
                }
            },
            y: {
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Value'
                },
                ticks: {
                    max: 5,
                    min: 0,
                    stepSize: 2
                }
            }
        },
    }
};

var rh = {
    type: 'line',
    data: {
        labels: ['January', 'February', 'March', 'April'],
        datasets: [{
            label: 'My First dataset',
            backgroundColor: window.chartColors.red,
            borderColor: window.chartColors.red,
            data: [1,6,3,5],
            fill: true,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'RH%',
            position: 'top'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            x: {
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Month'
                }
            },
            y: {
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Value'
                },
                ticks: {
                    max: 5,
                    min: 0,
                    stepSize: 2
                }
            }
        },
        elements: {
            point:{
                radius: 0
            }
        },
        
    }
};

var battery = {
    type: 'line',
    data: {
        labels: ['January', 'February', 'March', 'April'],
        datasets: [{
            label: 'My First dataset',
            backgroundColor: window.chartColors.red,
            borderColor: window.chartColors.red,
            data: [1,6,3,5],
            fill: false,
        }, {
            label: 'My Second dataset',
            fill: false,
            backgroundColor: window.chartColors.blue,
            borderColor: window.chartColors.blue,
            data: [4,2,3,1],
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Battery',
            position: 'top'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            x: {
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Month'
                }
            },
            y: {
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Value'
                },
                ticks: {
                    max: 5,
                    min: 0,
                    stepSize: 2
                }
            }
        },
    }
};

var solar = {
    type: 'line',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: 'Filled',
            backgroundColor: window.chartColors.red,
            borderColor: window.chartColors.red,
            data: [3,9,2,1,6,4,8],
            fill: true,
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Solar'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            x: {
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Month'
                }
            },
            y: {
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Value'
                },
                ticks: {
                    max: 5,
                    min: 0,
                    stepSize: 5
                }
            }
        },
        elements: {
            point:{
                radius: 0
            }
        },
    }
};





window.onload = function() {
  /*  var ctx = document.getElementById('rainfall').getContext('2d');
    window.myLine1 = new Chart(ctx, rainfall);
    var ctx = document.getElementById('wind').getContext('2d');
    window.myLine2 = new Chart(ctx, wind);
    var ctx = document.getElementById('rh').getContext('2d');
    window.myLine3 = new Chart(ctx, rh);
    var ctx = document.getElementById('battery').getContext('2d');
    window.myLine4 = new Chart(ctx, battery);
    var ctx = document.getElementById('solar').getContext('2d');
    window.myLine5 = new Chart(ctx, solar);*/
};