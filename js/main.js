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
            document.getElementById("sim-id").innerHTML = "Simulation: <strong>" + window.simKey +"</strong>"
            document.getElementById("bar-btns").innerHTML = "\
            <button onclick=\"removeSimulation()\" class=\"btn btn-warning\" id=\"newSim-btn\">Remove Simulation</button>\
            <button onclick=\"shutdown()\" class=\"btn btn-danger\">Shutdown</button>"
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
            document.getElementById("sim-id").innerHTML = "Simulation: <strong>-</strong>"
            document.getElementById("bar-btns").innerHTML = "\
            <button onclick=\"getNewSimulation()\" class=\"btn btn-success\" id=\"newSim-btn\">New Simulation</button>\
            <button onclick=\"shutdown()\" class=\"btn btn-danger\">Shutdown</button>"
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
            // get the number of agents in the info
            var noOfAgents
            if (data.info.agents) {
                noOfAgents = data.info.agents.length
            } else {
                noOfAgents = 0
            }

            // document.getElementById("sim-overview").innerHTML = "<pre>" + JSON.stringify(data.info, null, 2) + "</pre>"
            document.getElementById("sim-overview").innerHTML = "\
            <table>\
                <tbody>\
                    <tr>\
                        <td>Number Of Agents: </td>\
                        <td>"+ noOfAgents + "</td>\
                    </tr>\
                    <tr>\
                        <td>Current Tick: </td>\
                        <td>"+ data.info.tick + "</td>\
                    </tr>\
                </tbody>\
            </table>"
            document.getElementById("last-update").innerHTML = "Last updated: " + new Date().toLocaleString()
            getImage()
        }
    }
    // Send request
    request.send();
}

// getImage sends a request to get an image of the simualtion.
function getImage() {
    console.log("Getting Simulation Image");

    var url = "http://localhost:8080/simulation/view/" + window.simKey

    var request = new XMLHttpRequest();
    request.open("POST", url, true);
    

    request.onload = function () {
    
        var data = JSON.parse(this.response);
        console.log(data)
        if (!checkError(data)) {
            document.getElementById("sim-img").src = "data:image/jpg;base64," + data.image
        }
    }
    // Send request
    request.send(JSON.stringify({
            cameraPosition: [],
            cameraDirection: []
    }));
}

// runSimulation sends a request for the server to run the simualation
function runSimulation() {
    console.log("Running Simulation")
    document.getElementById("run-btn").disabled = true
    document.getElementById("run-btn").innerHTML = "\
    <div class=\"spinner-border text-dark\" role=\"status\">\
        <span class=\"sr-only\">Loading...</span>\
    </div>"

    var url = "http://localhost:8080/simulation/run/" + window.simKey

    var request = new XMLHttpRequest();
    request.open("POST", url, true);
    

    request.onload = function () {
    
        var data = JSON.parse(this.response);
        console.log(data)
        if (!checkError(data)) {
            document.getElementById("run-btn").disabled = false
            document.getElementById("run-btn").innerHTML = "Run"
            console.log("Simulation ran")
            getInfo()
        }
    }

    noOfSteps = document.getElementsByName("noOfSteps")[0].value

    // Send request
    request.send(JSON.stringify(
        {steps: noOfSteps}
    ));;
}