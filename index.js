const APIKEY = '2f39d769c57e89501bbc534f00518796';
let OPERATION;
let PARAMS;
let url; 
const stateSelection = document.getElementById("states");
console.log(stateSelection)
stateSelection.addEventListener("change", (e) => {
    console.log(e);
    getSessionList(e.target.value);
})
let main = document.getElementsByTagName("main")[0];

class Session {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
    sessionDiv() {
        const div = document.createElement("div");
        const name = document.createElement("p");
        
        div.id = this.id;
        div.classList += "session";
        name.innerText = this.name;
        name.classList += "sessionName";

        div.addEventListener("click", () => {
            getMasterList(this.id);
        })
        div.append(name);
        return div;  

    }
}
class BillSnippet {
    constructor(number, title, id, lastAction, description) {
        this.number = number;
        this.title = title;
        this.id = id;
        this.lastAction = lastAction;
        this.description = description;
    }
    billSnippetDiv() {
        const div = document.createElement("div");
        const number = document.createElement("p");
        const title = document.createElement("p");
        const lastAction = document.createElement("p");
        const description = document.createElement("p");

        div.id = this.id;
        div.classList += "billSnippet";
        number.classList += "billNumber";
        number.innerText = this.number;
        title.classList += "billTitle";
        title.innerText = this.title;
        lastAction.classList += "lastAction";
        lastAction.innerText = this.lastAction;
        description.classList += "description";
        description.innerText = this.description;
        
        div.addEventListener("click", () => {

        });

        div.append(title, number, lastAction, description);
        return div;
    }
}
function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}
function getSessionList(state) {
    main.innerHTML = "Loading...";
    OPERATION = "getSessionList";
    PARAMS = `state=${state}`;
    url = `https://api.legiscan.com/?key=${APIKEY}&op=${OPERATION}&${PARAMS}`;
    fetch(url, {
    }).then(data => data.json())
        .then(json => {
            // Array of objects containing session information
            let sessions = json.sessions;
            main.innerHTML = "";
            for (session of sessions) {
                const S = new Session(session.name, session["session_id"])
                main.append(S.sessionDiv())
            }
        })
}


function getMasterList(sessionId) {
    OPERATION = "getMasterList";
    PARAMS = `id=${sessionId}`;
    url = `https://api.legiscan.com/?key=${APIKEY}&op=${OPERATION}&${PARAMS}`;
    main.innerHTML = "Loading...";
    fetch(url)
        .then(data => data.json())
        .then(json => {
            main.innerHTML = "";
            let bills = json.masterlist;
            delete bills.session;
            for (key of Object.keys(bills)) {
                let billSnippet = bills[key];
                const B = new BillSnippet(billSnippet.number, decodeHtml(billSnippet.title), billSnippet["bill_id"], decodeHtml(billSnippet["last_action"]), decodeHtml(billSnippet.description));
                main.append(B.billSnippetDiv());
            }
        }
    )
}