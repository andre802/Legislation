const APIKEY = '2f39d769c57e89501bbc534f00518796';
let OPERATION;
let PARAMS;
let url; 
let billSnippets = [];
const stateSelection = document.getElementById("states");
stateSelection.addEventListener("change", (e) => {
    getSessionList(e.target.value);
    window.history.replaceState(null, null, `?state=${e.target.value}`);
})
const search = document.createElement("input");
search.type = "text";
search.id = "search";
search.addEventListener("change", () => {
    let input = search.value;
    let filtered = billSnippets.filter(bill => bill.description.includes(input));
    document.getElementById("bills").innerHTML = "";
    filtered.forEach(b => {
        document.getElementById("bills").append(b.billSnippetDiv());
    })
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
        title.classList += "title";
        title.innerText = this.title;
        lastAction.classList += "lastAction";
        lastAction.innerText = this.lastAction;
        description.classList += "description";
        description.innerText = this.description;
        // Show bill info
        div.addEventListener("click", () => {
            getBillInfo(this.id, this.description);
        });

        div.append(title, number, lastAction, description);
        return div;
    }
}
class Bill {
    constructor(session, description, title, committeeName, history, subject, sponsors, votes, text) {
        this.session = session;
        this.description = description;
        this.title = title;
        this.committeeName = committeeName;
        this.history = history;
        this.subject = subject;
        this.sponsors = sponsors;
        this.votes = votes;
        this.text = text;

        this.historySpans = [];
        this.votesSpans = []
        this.subjectSpans = [];
        this.sponsorsSpans = [];
    }
    billDiv() {
        const div = document.createElement("div");
        const title = document.createElement("p");
        const description = document.createElement("p");
        const session = document.createElement("p");
        const committeeName = document.createElement("p");
        const historyDiv = document.createElement("div");
        const historyP = document.createElement("p");
        const subjectDiv = document.createElement("div");
        const subjectP = document.createElement("p");
        const sponsors = document.createElement("div");
        const sponsorsP = document.createElement("p");
        const votes = document.createElement("div");
        const votesP = document.createElement("p");
        const textLink = document.createElement("a");

        div.classList += "bill";
        title.innerHTML = this.title;
        title.classList += "title";
        description.innerText = this.description;
        description.classList += "description";
        session.innerText = this.session;
        session.classList += 'session';
        if (this.committeeName.length > 0) {
            committeeName.innerText = this.committeeName.name;
        }
        historyDiv.classList += 'history'
        historyP.innerText = "History";
        historyP.classList += "billDescriptor";
        historyDiv.append(historyP);
        historyDiv.addEventListener("click", () => {
                if (historyDiv.childElementCount == 1) {
                    this.historySpans.forEach(h => {
                        historyDiv.append(h);
                    })
                } else {
                    historyDiv.innerHTML = "";
                    historyDiv.append(historyP);
                }
            })
        this.history.forEach(h => {
            let historySpan = document.createElement("span");
            let action = document.createElement("p");
            let date = document.createElement("p");
            historySpan.classList += "historySpan";
            action.innerText = h.action;
            date.innerText = h.date;
            historySpan.append(action, date);
            this.historySpans.push(historySpan);
            historyDiv.append(historySpan);
        })
        if (this.subject.length > 0) {
            subjectP.innerText = "Subjects";
            subjectP.classList += "billDescriptor";
            subjectDiv.append(subjectP);
            subjectDiv.classList += "subjects";
            subjectDiv.addEventListener("click", () => {
                if (subjectDiv.childElementCount == 1) {
                    this.subjectSpans.forEach(s => {
                        subjectDiv.append(s);
                    })
                } else {
                    subjectDiv.innerHTML = "";
                    subjectDiv.append(subjectP);
                }
            })
            this.subject.forEach(s => {
                const subjectSpan = document.createElement("span");
                subjectSpan.classList += "subject";
                subjectSpan.innerText = s["subject_name"];
                subjectDiv.append(subjectSpan);
                this.subjectSpans.push(subjectSpan);
            })
        }
        sponsors.classList += "sponsors";
        sponsorsP.innerText = "Sponsors";
        sponsorsP.classList += "billDescriptor";
        sponsors.append(sponsorsP);
        sponsors.addEventListener("click", () => {
                if (sponsors.childElementCount == 1) {
                    this.sponsorsSpans.forEach(s => {
                        sponsors.append(s);
                    })
                } else {
                    sponsors.innerHTML = "";
                    sponsors.append(sponsorsP);
                }
            })
        this.sponsors.forEach(s => {
            let sponsorsSpan = document.createElement("span");
            let name = document.createElement("p");
            sponsorsSpan.classList += "sponsorsSpan";
            name.innerText = s.name;
            sponsorsSpan.append(name);
            sponsors.append(sponsorsSpan);
            this.sponsorsSpans.push(sponsorsSpan);
        })
        if (this.votes.length > 0) {
            votes.classList += "votes";
            votesP.innerText = "Votes";
            votesP.classList += "billDescriptor";
            votes.append(votesP);
            votes.addEventListener("click", () => {
                if (votes.childElementCount == 1) {
                    this.votesSpans.forEach(v => {
                        votes.append(v);
                    })
                } else {
                    votes.innerHTML = "";
                    votes.append(votesP);
                }
            })
            this.votes.forEach(v => {
                let voteSpan = document.createElement("span");
                let date = document.createElement("p");
                let desc = document.createElement("p");
                let yea = document.createElement("p");
                let nay = document.createElement("p");
                let nv = document.createElement('p');
                let absent = document.createElement("p");

                voteSpan.classList += "voteSpan";
                desc.innerText = v.desc;
                date.innerText = v.date;
                yea.innerText = v.yea;
                nay.innerText = v.nay;
                nv.innerText = v.nv;
                absent.innerText = v.absent;
                voteSpan.append(desc, date, yea, nay, nv)
                votes.append(voteSpan);
                this.votesSpans.push(voteSpan);
            })
        }
        textLink.innerText = "Click to read full text";
        textLink.href = this.text;
        textLink.target = "_blank";
        div.append(title, description, session, committeeName, historyDiv, subjectDiv, sponsors, votes, textLink);
        return div;
    }
}
function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}
function getBillInfo(id, description) {
    main.innerHTML = "Loading...";
    OPERATION = "getBill";
    PARAMS = `id=${id}`;
    url = `https://api.legiscan.com/?key=${APIKEY}&op=${OPERATION}&${PARAMS}`;
    fetch(url)
        .then(data => data.json())
        .then(json => {
            console.log(json);
            main.innerHTML = "";
            json = json.bill;
            const B = new Bill(json.session["session_name"], description, json.title,json.committee,json.history,json.subjects,json.sponsors,json.votes,json.texts[0]["state_link"]);        
            main.append(B.billDiv())
        })

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
    const billsDiv = document.createElement("div");
    billsDiv.id = 'bills';
    fetch(url)
        .then(data => data.json())
        .then(json => {
            main.innerHTML = "";
            main.append(search);
            let bills = json.masterlist;
            delete bills.session;
            for (key of Object.keys(bills)) {
                let billSnippet = bills[key];
                const B = new BillSnippet(billSnippet.number, decodeHtml(billSnippet.title), billSnippet["bill_id"], decodeHtml(billSnippet["last_action"]), decodeHtml(billSnippet.description));
                billsDiv.append(B.billSnippetDiv());
                billSnippets.push(B);
            }
        }
    ).finally(() => {
        main.append(billsDiv);
    })
    
}