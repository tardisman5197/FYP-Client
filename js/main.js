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
            document.getElementById("sim-id").innerHTML = "Simulation: <strong>" + window.simKey + "</strong>"
            document.getElementById("bar-btns").innerHTML = "\
            <button onclick=\"removeSimulation()\" class=\"btn btn-warning\" id=\"newSim-btn\">Remove Simulation</button>\
            <button onclick=\"shutdown()\" class=\"btn btn-danger\">Shutdown</button>"

            getInfo()
            getImage()
        }
    }
    // Send request
    request.send(JSON.stringify(
        { 
            environment: "resources/intersect.shp",
            lights: [
                [50.0, 50.0],
                [55.0, 50.0]
            ]
        }
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
            
            htmlStr = "\
            <table>\
                <tbody>\
                    <tr>\
                        <td>Number Of Agents: </td>\
                        <td>"+ noOfAgents + "</td>\
                    </tr>\
                    <tr>\
                        <td>Current Tick: </td>\
                        <td>"+ data.info.tick + "</td>\
                    </tr>"

            if (data.info.environment.lights) {
                htmlStr += "<tr><td>Lights:</td><td>ID</td><td>Position</td><td>Stop</td></tr>"
                for (var i=0; i<data.info.environment.lights.length; i++) {
                    htmlStr += "<tr><td></td>\
                    <td>"+data.info.environment.lights[i].id+"</td>\
                    <td>"+data.info.environment.lights[i].position+"</td>\
                    <td>"+data.info.environment.lights[i].stop+"</td>\
                    <td><button class=\"btn btn-secondary\" onclick=\"updateLight("+data.info.environment.lights[i].id+","+!data.info.environment.lights[i].stop+")\">Toggle</button></td>\
                    </tr>"
                }
            }

            
            htmlStr += "\
                </tbody>\
            </table>"
            document.getElementById("sim-overview").innerHTML = htmlStr
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
        cameraPosition: [70,10,70],
        cameraDirection: [50,0,50]
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

    noOfSteps = parseFloat(document.getElementsByName("noOfSteps")[0].value)

    // Send request
    request.send(JSON.stringify(
        { steps: noOfSteps }
    ));;
}

// addRoute adds more input boxes for a vehicle route
function addRoute() {
    var htmlStr = "\
    <div class=\"input-group\">\
        <button class=\"btn btn-danger\" onclick=\"removeRoute(this)\">x</button>\
        <input type=\"number\" class=\"form-control route-x\" placeholder=\"x\" value=0.0>\
        <input type=\"number\" class=\"form-control route-y\" placeholder=\"y\" value=0.0>\
    </div>"
    document.getElementById("route-input").insertAdjacentHTML("beforeend", htmlStr)
}

// removeRoute destroys a route input line
function removeRoute(btn) {
    var toRemvoe = btn.parentNode
    toRemvoe.parentNode.removeChild(toRemvoe)
}

// addVehicle sends a request to add a vehicle
// with the paramaters given
function addVehicle() {
    var request = new XMLHttpRequest();

    var url = "http://localhost:8080/simulation/add/" + window.simKey

    request.open("POST", url, true);
    request.setRequestHeader('Content-Type', 'application/json');


    request.onload = function () {
        var data = JSON.parse(this.response);
        console.log(data)
        if (!checkError(data)) {
            getInfo()
            getImage()
        }
    }

    var startLoc = [
        parseFloat(document.getElementById("start-loc-x").value),
        parseFloat(document.getElementById("start-loc-y").value)
    ]
    var startSpeed = parseFloat(document.getElementById("start-speed").value)
    var maxSpeed = parseFloat(document.getElementById("max-speed").value)
    var acc = parseFloat(document.getElementById("acceleration").value)
    var dec = parseFloat(document.getElementById("deceleration").value)
    var type = document.getElementById("agent-type").value
    var freq = parseFloat(document.getElementById("frequency").value)
    var routeX = document.getElementsByClassName("route-x")
    var routeY = document.getElementsByClassName("route-y")

    var route =[]
    for (var i = 0; i<routeX.length; i++) {
        route.push([
            parseFloat(routeX[i].value),
            parseFloat(routeY[i].value)
        ])
    }
    console.log(route)

    var jsonStr = JSON.stringify(
        {
            agents: [{
                startLocation: startLoc,
                startSpeed: startSpeed,
                maxSpeed: maxSpeed,
                acceleration: acc,
                deceleration: dec,
                type: type,
                frequency: freq,
                route: route
            }]
        }
    )
    console.log(jsonStr)

    // Send request
    request.send(jsonStr);
}

// updateLight sends a request to update a traffic light's value
function updateLight(id, stop) {
    var request = new XMLHttpRequest();

    var url = "http://localhost:8080/simulation/light/update/" + window.simKey

    request.open("POST", url, true);
    request.setRequestHeader('Content-Type', 'application/json');


    request.onload = function () {
        var data = JSON.parse(this.response);
        console.log(data)
        if (!checkError(data)) {
            getInfo()
        }
    }

    var jsonStr = JSON.stringify(
        {
            stop: stop,
            id: id
        }
    )
    console.log(jsonStr)

    // Send request
    request.send(jsonStr);
}

function demoSetup() {
    var request = new XMLHttpRequest();

    var url = "http://localhost:8080/simulation/add/" + window.simKey

    request.open("POST", url, true);
    request.setRequestHeader('Content-Type', 'application/json');


    request.onload = function () {
        var data = JSON.parse(this.response);
        console.log(data)
        if (!checkError(data)) {
            getInfo()
            getImage()
        }
    }

    var routes = [
        [[50.0, 0.0],[50.0, 50.0],[50.0, 100.0]],
        [[50.0, 0.0],[50.0, 50.0],[0.0, 50.0]],
        [[50.0, 0.0],[50.0, 50.0],[55.0, 55.0],[100.0, 50.0]],
        [[100.0, 50.0],[55.0, 50.0],[0.0, 50.0]],
        [[100.0, 50.0],[55.0, 50.0],[50.0, 0.0]],
        [[100.0, 50.0],[55.0, 50.0],[50.0, 55.0],[50.0, 100.0]]
    ]

    var agents = []
    
    for (var i=0; i<routes.length; i++) {
        var agent = {}
        agent.startLocation = routes[i][0]
        agent.startSpeed = 0.0
        agent.maxSpeed = 8.0
        agent.acceleration = 3.0
        agent.deceleration = 3.0
        agent.type = "vehicle"
        agent.frequency = (i%3)+8
        agent.route = routes[i]

        agents.push(agent)
    }

    var jsonStr = JSON.stringify(
        {
            agents: agents
        }
    )
    console.log(jsonStr)

    // Send request
    request.send(jsonStr);
}