function AppendLinkToText(text, link, mustHaveLink) {
    var html = ""
    if (mustHaveLink && link.length == 0) {
        return html;
    }
    if (text.length != 0) {
        if (link.length != 0) {
            html += '<a href=' + link + '>';
        }
        html += text;
        if (link.length != 0) {
            html += '</a>';
        }
    }
    return html;
}

function HighlightText(text, lookfor) {
    String.prototype.splice = function(idx, rem, str) {
        return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
    };
    var beg = text.indexOf(lookfor);
    var end = beg + lookfor.length;
    text = text.splice(end, 0, "</b>");
    text = text.splice(beg, 0, "<b>");
    return text;
}

function Publication(publicationJSON) {
    this.json = publicationJSON;
    this.toHtml = function() {
        var html = "";
        html += '<div class=\'thumb image\'>';
        html += '<div style=\'padding-top:2px\'>';
        if (String(this.json.url).length != 0) {
            html += '<a href=' + this.json.url + '>';
        }
        html += '<img width="80px" height="80px" src=' + this.json.icon + ' alt=\'PAPER\'/>';
        if (this.json.url.length != 0) {
            html += '</a>';
        }
        html += '</div>';
        html += '</div>';
        html += '<div class=\'ref\'>';
        html += '<div class=\'title\'>';
        if (this.json.url.length != 0) {
            html += '<a href=' + this.json.url + '>';
        }
        html += this.json.title;
        if (this.json.url.length != 0) {
            html += '</a> &nbsp;';
        }
        html += '</div>';
        html += '<div class=\'authors\'>';
        if (this.json.hasOwnProperty('authors')) {
            html += HighlightText(this.json.authors, 'Ahmed M. Fathy');
        } else if (this.json.hasOwnProperty('author')) {
            html += HighlightText(this.json.author, 'Ahmed M. Fathy');
        }
        html += '</div>';

        html += '<div class=\'links\'>';
        html += "<i>";
        if (this.json.hasOwnProperty('series')) {
            html += this.json.series;
        } else if (this.json.hasOwnProperty('journal')) {
            html += this.json.journal + " " + this.json.year;
        } else if (this.json.hasOwnProperty('booktitle')) {
            html += "Chapter in the book \"" + this.json.booktitle + "\" " + this.json.year;
        }
        html += "</i>";

        // html += '</div>';

        // html += '<div class=\'links\'>';
        if (this.json.hasOwnProperty('url')) {
            hyperLink = AppendLinkToText("http", this.json.url, true);
            if (hyperLink.length != 0) {
                html += " [" + AppendLinkToText("http", this.json.url, true);
            } else {
                html += " [";

            }
        }
        if (this.json.hasOwnProperty('talk')) {
            hyperLink = AppendLinkToText("talk", this.json.talk, true);
            if (hyperLink.length != 0) {
                html += " | " + AppendLinkToText("talk", this.json.talk, true);
            }
        }
        if (this.json.hasOwnProperty('slides_pdf')) {
            hyperLink = AppendLinkToText("slides pdf", this.json.slides_pdf, true);
            if (hyperLink.length != 0) {
                html += " | " + AppendLinkToText("slides pdf", this.json.slides_pdf, true);
            }
        }
        if (this.json.hasOwnProperty('slides_ppt')) {
            hyperLink = AppendLinkToText("slides ppt", this.json.slides_ppt, true);
            if (hyperLink.length != 0) {
                html += " | " + AppendLinkToText("slides ppt", this.json.slides_ppt, true);
            }
        }

        if (this.json.hasOwnProperty('code')) {
            hyperLink = AppendLinkToText("code", this.json.code, true);
            if (hyperLink.length != 0) {
                if (html.slice(-1) == "[") html += AppendLinkToText("code", this.json.code, true);
                else html += " | " + AppendLinkToText("code", this.json.code, true);
            }
        }
        if (this.json.hasOwnProperty('video')) {
            hyperLink = AppendLinkToText("video", this.json.video, true);
            if (hyperLink.length != 0) {
                html += " | " + hyperLink;
            }
        }

        html += "]"
        html += '</div>';
        html += '</div>';
        html += '<hr />';
        return html;
    }
}

function initAllPublications(pubs, refereed, type) {
    var json = new Array();
    if (type == "paper") {
        json.push('{ \
        "authors"     : "A. M. Fathy, M. H. Abdelshafy, and M. R. A Atia", \
        "title"      : "MODELING OPEN-CELLED ALUMINUM FOAMS STRUCTURE USING 3-D VORONOI DIAGRAM", \
        "journal"    : "The International Conference on Applied Mechanics and Mechanical Engineering", \
        "volume"     : " 18", \
        "year"       : "2018", \
        "doi"        : " 10.21608/AMME.2018.35022", \
        "url"        : " https://amme.journals.ekb.eg/article_35022.html", \
        "icon": "publications/modeling.jpg",\
        "code":"https://github.com/ahmedfathy17/Open-cell-Foam-Model-Generation-Using-3-D-Voronoi-diagram.git"\
        } ');

        json.push('{ \
        "authors"     : "A. M. Fathy, M. H. Abdelshafy, and M. R. A Atia", \
        "title"      : "Numerical study of compression response of open-celled Aluminum foam structure using 3-D Voronoi diagram model", \
        "journal"    : "3rd International Conference on Materials Science and Nanotechnology (ICMSNT 2018) Chengdu, China", \
        "volume"     : " 18", \
        "year"       : "2018", \
        "url"        : "papers/ICMSNT.pdf", \
        "icon": "publications/Numerical_study.jpg",\
        "video":"https://www.youtube.com/watch?v=NMC2FxQ047E"\
        } ');

    }

    json.forEach(function(element, index, json) {
        json[index] = (JSON.parse(element));
    });
    json.sort(function(a, b) {
        var x = a.year;
        var y = b.year;
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });

    if (refereed) {
        json = json.filter(element => !element.hasOwnProperty('refereed'));
    } else {
        json = json.filter(element => element.hasOwnProperty('refereed'));
    }

    json.forEach(element => pubs[pubs.length] = new Publication(element));
}

function allPubsInHTML(refereed, type) {
    var myPubs = [];
    initAllPublications(myPubs, refereed, type);
    var htmlPubs = "";
    htmlPubs += '<div id=\'content\'>';
    htmlPubs += '<div class=\'results list\'>';
    for (index = 0; index < myPubs.length; index++) {
        htmlPubs += myPubs[index].toHtml();
    }
    htmlPubs += '</div>';
    htmlPubs += '</div>';
    return htmlPubs;
}

function updatePubListWithAll(refereed, id, type) {
    var s = allPubsInHTML(refereed, type);
    document.getElementById(id).innerHTML = s;
}

/******Projects functions*/
function initAllProjects(proj) {
    var json = new Array();
    json.push('{ \
        "title"      : "Build an OpenStreetMap Route Planner Using A* Search Algorithm", \
        "index"    : "5", \
        "icon": "publications/map.png",\
        "code":"https://github.com/ahmedfathy17/Route-Planning-Project.git"\
        } ');

    json.push('{ \
        "title": "Memory Management Chatbot using Smart Pointers and Rule of Five", \
        "index": "3", \
        "icon": "publications/chatbot_demo.gif",\
        "code":"https://github.com/ahmedfathy17/Chatbot.git"\
        } ');

    json.push('{ \
            "title": "Open-cell Foam Model Generator Using 3-D Voronoi-diagram", \
            "index": "2", \
            "icon": "publications/Open-cell.gif",\
            "code":"https://github.com/ahmedfathy17/Open-cell-Foam-Model-Generation-Using-3-D-Voronoi-diagram.git"\
            } ');

    json.push('{ \
        "title": "Linux System Monitor", \
        "index": "4", \
        "icon": "publications/monitor.png",\
        "code":"https://github.com/ahmedfathy17/Linux-System-Monitor-Project-.git"\
        } ');

    json.push('{ \
        "title": "Concurrent Traffic Simulation using Multi-threading",\
        "index": "1", \
        "icon": "publications/traffic_simulation.gif",\
        "code":"https://github.com/ahmedfathy17/Concurrent-Traffic-Simulation-project.git"\
        } ');

    json.push('{ \
        "title": "AI and EHR: Expected Hospitalization Time Regression Model",\
        "index": "6", \
        "icon": "publications/bais.png",\
        "code":"https://github.com/ahmedfathy17/AI_For_Health_Care_EHR_Project.git"\
        } ');

    json.push('{ \
        "title": "Activity Aware Pulse Rate Algorithm",\
        "journal": "7", \
        "icon": "publications/ppg_mechanics.png",\
        "code":"https://github.com/ahmedfathy17/Activity-Aware-Pulse-Rate-Algorithm.git"\
        } ');

    json.push('{ \
        "title": "Pneumonia Detection from Chest X-Rays Using Deep learning",\
        "index": "8", \
        "icon": "publications/xray.png",\
        "code":"https://github.com/ahmedfathy17/Pneumonia-Detection-from-Chest-X-Rays-Using-Deep-learning.git"\
        } ');

    json.push('{ \
        "title": "Build a Forward Planning Agent",\
        "index": "9", \
        "icon": "publications/Progression.PNG",\
        "code":"https://github.com/ahmedfathy17/Build-a-Forward-Planning-Agent.git"\
        } ');


    json.forEach(function(element, index, json) {
        json[index] = (JSON.parse(element));
    });

    json.sort(function(a, b) {
        var x = a.index;
        var y = b.index;
        return ((x > y) ? 1 : ((x < y) ? -1 : 0));
    });

    json.forEach(element => proj[proj.length] = new Project(element));
}

function Project(projectsJSON) {
    console.log("Project");
    this.json = projectsJSON;
    this.toHtml = function() {
        var html = "";
        html += '<div class=\'column\'>';
        html += '<div class=\'card\'>';
        if (String(this.json.code).length != 0) {
            html += '<a href=' + this.json.code + '>';
        }
        html += '<img class=\'proj-image\' src=' + this.json.icon + ' alt=\'Avatar\' >';
        html += '<div class=\'container\'>';
        html += ' <h4><b>' + this.json.title + '</b></h4>'
        html += '</div>';
        if (this.json.code.length != 0) {
            html += '</a>';
        }
        html += '</div>';
        html += '</div>';
        return html;
    }
}

function allProjectsInHTML() {
    var myPojects = [];
    initAllProjects(myPojects);
    var htmlProjects = "";
    for (index = 0; index < myPojects.length; index++) {
        htmlProjects += myPojects[index].toHtml();
    }

    return htmlProjects;
}

function updateProjectListWithAll(id) {
    var s = allProjectsInHTML();
    document.getElementById(id).innerHTML = s;
}