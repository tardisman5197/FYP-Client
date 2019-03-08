function changeToSim() {
    window.location.href = "sim.html"
}

function getNewSimulation() {
    console.log("Getting Simulation");
    var request = new XMLHttpRequest();

    request.open("POST", "http://localhost:8080/simulation/new", false);
    request.setRequestHeader('Content-Type', 'application/json');
    

    request.onload = function () {
    
        var data = JSON.parse(this.response);
        console.log(data)
    }
    // Send request
    request.send(JSON.stringify({
        environment: "resources/test.shp"
    }));

}