async function firewallHandler(event) {
    // Access the value of x-deny, one of the headers
    let condition = event.request.headers.get("x-deny");

    if (condition) {
        // event.deny() triggers a default 403 Response
        event.deny();
    }

    let anotherCondition = event.request.headers.get("x-drop"); // Access the value of x-drop, , one of the headers
    if (anotherCondition) {
        // event.drop() drops the connection without returning a Response
        event.drop();
    }

    // Access the value of x-third, , one of the headers
    let aThirdCondition = event.request.headers.get("x-third");
    if (aThirdCondition) {
        // event.addRequestHeader() adds a new header to the Request object, passing key:"value".
        event.addRequestHeader("X-New-Request-Header", "Hello");
    }

    // Access the value of x-fourth, one of the headers
    let aFourthCondition = event.request.headers.get("x-fourth");
    if (aFourthCondition) {
        //  event.addResponseHeader() adds a new header to the Response object
        //  that will be delivered after accessing the origin. 
        event.addResponseHeader("X-New-Response-Header", "Bye");
    }

    // The metadata object contains the attributes of the request
    if (event.request.metadata["remote_addr"] == "127.0.0.1") {
        // event.respondWith(new Response()) allows you to serve your own Response
        event.respondWith(new Response('{"my_custom_response": true}', {
            status: 599,
            headers: { "content-type": "application/json" }
        }));
    }

    // If the request was not denied or dropped and did not have a Response returned,
    // it is necessary to continue the processing, and to do so use use -> event.continue()
    // Do not forget this command, otherwise the request won't continue!
    event.continue();
}

addEventListener("firewall", (event) => event.waitUntil(firewallHandler(event)));