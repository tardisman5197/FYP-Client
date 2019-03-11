// checkError retuns false if there is no error, otherwise
// true is retuned and the error text is written in the
// error-text div.
function checkError(data) {
    if (data.success) {
        return false
    } else {
        document.getElementById("error-text").innerHTML = data.error
        return true
    }
}

// getNewSimulation sends a post request to the server to create
// a new simulation, then updates the sim-id div with the new
// simulation id.
function getNewSimulation() {
    console.log("Getting Simulation");
    var request = new XMLHttpRequest();

    request.open("POST", "http://localhost:8080/simulation/new", true);
    request.setRequestHeader('Content-Type', 'application/json');
    

    request.onload = function () {
    
        var data = JSON.parse(this.response);
        console.log(data)
        if (!checkError(data)) {
            window.simKey = data.key
            document.getElementById("sim-id").innerHTML = window.simKey
            document.getElementById("bar-btns").innerHTML = "\
            <button onclick=\"removeSimulation()\" id=\"newSim-btn\">Remove Simulation</button>\
            <button onclick=\"shutdown()\">Shutdown</button>"
            console.log("Change btn")
        }
    }
    // Send request
    request.send(JSON.stringify(
        {environment: "resources/test.shp"}
    ));

}

// removeSimulation sends a request to remove the simualation from
// the server.
function removeSimulation() {
    var request = new XMLHttpRequest();

    var url = "http://localhost:8080/simulation/remove/" + window.simKey

    request.open("GET", url, true);
    request.setRequestHeader('Content-Type', 'application/json');
    

    request.onload = function () {
    
        var data = JSON.parse(this.response);
        console.log(data)
        if (!checkError(data)) {
            document.getElementById("sim-id").innerHTML = "-"
            document.getElementById("bar-btns").innerHTML = "\
            <button onclick=\"getNewSimulation()\" id=\"newSim-btn\">New Simulation</button>\
            <button onclick=\"shutdown()\">Shutdown</button>"
        }
    }
    // Send request
    request.send();
}

// shutdown sends a request to shutdown the server.
function shutdown() {
    console.log("Shutting Down Server");
    var request = new XMLHttpRequest();

    request.open("GET", "http://localhost:8080/shutdown", true);
    request.send();
}

// getInfo tries to get the information about the simulation in a json string
function getInfo() {
    console.log("Getting Simulation Info");

    var url = "http://localhost:8080/simulation/info/" + window.simKey

    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    

    request.onload = function () {
    
        var data = JSON.parse(this.response);
        console.log(data)
        if (!checkError(data)) {
            document.getElementById("sim-info").innerHTML = "<pre>" + JSON.stringify(data.info, null, 2) + "</pre>"
        }
    }
    // Send request
    request.send();
}