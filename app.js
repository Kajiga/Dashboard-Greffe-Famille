let currentDate = new Date();

let attributions = [];

function renderCollaborateurs() {

    const zone = document.getElementById("collaborateurs");
    zone.innerHTML = "";

    collaborateurs.forEach(c => {
        zone.innerHTML += `<li>✅ ${c}</li>`;
    });

    const select = document.getElementById("listeCollaborateurs");
    select.innerHTML = "";

    collaborateurs.forEach(c => {
        select.innerHTML += `<option>${c}</option>`;
    });
}

function renderTaches() {

    const zone = document.getElementById("taches");

    if (!zone) return;

    zone.innerHTML = "";
    taches.forEach(t => {
        zone.innerHTML += `<li>${t}</li>`;
    });

    const select = document.getElementById("listeTaches");
    select.innerHTML = "";

    taches.forEach(t => {
        select.innerHTML += `<option>${t}</option>`;
    });
}


function renderTodo() {

    const agendaLocal =
        JSON.parse(
            localStorage.getItem("agendaGreffe")
            || "[]"
        );

    const zone = document.getElementById("todo");
    zone.innerHTML = "";

    agendaLocal
        .sort((a, b) => a.date.localeCompare(b.date))
        .forEach(e => {

            zone.innerHTML += `
                <li>
                    <strong>${e.date}</strong><br>
                    ${e.titre}
                </li>
            `;

        });
}
function renderCalendar() {

const agendaLocal =
JSON.parse(
    localStorage.getItem("agendaGreffe")
    || "[]"
);

    const cal = document.getElementById("calendar");
    cal.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const months = [
        "Janvier","Février","Mars","Avril","Mai","Juin",
        "Juillet","Août","Septembre","Octobre",
        "Novembre","Décembre"
    ];

    document.getElementById("monthTitle").innerText =
        months[month] + " " + year;

    let firstDay =
        new Date(year, month, 1).getDay();

    if (firstDay === 0) {
        firstDay = 7;
    }

    const nbDays =
        new Date(year, month + 1, 0).getDate();

    for (let i = 1; i < firstDay; i++) {

        const empty =
            document.createElement("div");

        cal.appendChild(empty);
    }

    const today = new Date();

    for (let dayNumber = 1; dayNumber <= nbDays; dayNumber++) {

        const day =
            document.createElement("div");

        day.className = "day";

        const dateString =
            year + "-" +
            String(month + 1).padStart(2, "0") + "-" +
            String(dayNumber).padStart(2, "0");

        day.innerHTML =
            "<strong>" + dayNumber + "</strong>";

        if (
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === dayNumber
        ) {
            day.classList.add("today");
        }

        agendaLocal.forEach(event => {

            if (event.date === dateString) {

                day.classList.add("event");

                day.innerHTML += `
                    <br>
                    🔴
                `;
            }

        });

     day.addEventListener("click", () => {
    // Désactivé sur le dashboard
});

        cal.appendChild(day);
    }
}

function ajouterTache() {

    const champ =
        document.getElementById("nouvelleTache");

    const valeur =
        champ.value.trim();

    if (!valeur) return;

    taches.push(valeur);

    champ.value = "";

    renderTaches();
    majBonus();
}

function attribuer() {

    const tache =
        document.getElementById("listeTaches").value;

    const collaborateur =
        document.getElementById("listeCollaborateurs").value;

    attributions.push(
        `${tache} ➜ ${collaborateur}`
    );

    const zone =
        document.getElementById("attributions");

    zone.innerHTML = "";

    attributions.forEach(a => {
        zone.innerHTML += `<li>${a}</li>`;
    });
}

function majBonus() {

    const choix =
        document.getElementById("bonusSelect").value;

    const zone =
        document.getElementById("bonusZone");

    if (choix === "Collaborateurs") {

        zone.innerHTML =
            collaborateurs.join("<br>");

    } else if (choix === "Tâches") {

        zone.innerHTML =
            taches.join("<br>");

    } else if (choix === "Agenda") {

        zone.innerHTML =
            agenda.map(e =>
                e.date + " - " + e.titre
            ).join("<br>");
    }

}

function previousMonth() {

    currentDate.setMonth(
        currentDate.getMonth() - 1
    );

    renderCalendar();

}

function nextMonth() {

    currentDate.setMonth(
        currentDate.getMonth() + 1
    );

    renderCalendar();

}

function renderPresenceTable() {

    const body =
        document.getElementById("presenceBody");

    body.innerHTML = "";

    const agendaLocal =
        JSON.parse(
            localStorage.getItem("agendaGreffe")
            || "[]"
        );

    collaborateurs.forEach(c => {

        let ligne = `<tr><td>${c}</td>`;

        for(let i = 0; i < 5; i++){

            let date = new Date();
            let jour = date.getDay();

            let decalage =
                jour === 0
                ? -6
                : 1 - jour;

            date.setDate(
                date.getDate()
                + decalage
                + i
            );

            const dateString =
                date.getFullYear()
                + "-"
                + String(date.getMonth()+1).padStart(2,"0")
                + "-"
                + String(date.getDate()).padStart(2,"0");

            const absent =
                agendaLocal.some(
                    e =>
                        e.absence === true &&
                        e.collaborateur === c &&
                        e.date === dateString
                );

            ligne +=
                absent
                ? "<td>❌</td>"
                : "<td>✅</td>";

        }

        ligne += "</tr>";

        body.innerHTML += ligne;

    });

}

window.addEventListener("storage", function () {

    renderPresenceTable();
    renderTodo();
    renderCalendar();

});

function renderWeekHeaders() {

    const nomsJours =
        ["Lun", "Mar", "Mer", "Jeu", "Ven"];

    let date = new Date();
    let jour = date.getDay();

    let decalage =
        jour === 0
        ? -6
        : 1 - jour;

    date.setDate(
        date.getDate() + decalage
    );

    for(let i = 0; i < 5; i++){

        const current =
            new Date(date);

        current.setDate(
            date.getDate() + i
        );

        document.getElementById(
            "jour" + (i + 1)
        ).innerHTML =
            nomsJours[i]
            + "<br>"
            + String(current.getDate()).padStart(2,"0");

    }

}

window.onload = function () {

    renderCollaborateurs();
renderWeekHeaders();
renderPresenceTable();
    renderTaches();
    renderTodo();
    renderCalendar();
    majBonus();


};

window.addEventListener("focus", () => {
    renderCalendar();
    renderTodo();
});