function percent(n, d) {
    return d == 0 ? 0 : (parseFloat(n) / d) * 100;
}

function mapCGPA(m) {
    m = parseFloat(m);
    if (m >= 90) return 10;
    if (m >= 80) return 9;
    if (m >= 70) return 8;
    if (m >= 60) return 7;
    if (m >= 50) return 6;
    if (m >= 45) return 5;
    return 0;
}

function animate(barId, labelId, target) {
    let bar = document.getElementById(barId);
    let lbl = document.getElementById(labelId);
    let i = 0;
    let interval = setInterval(() => {
        if (i > target) { clearInterval(interval); return; }
        bar.style.width = i + "%";
        lbl.textContent = Math.round(i) + "%";
        i += 1;
    }, 7);
}

function calcCE() {
    let mode = document.getElementById("subjectType").value;

    let ct = percent(document.getElementById("ct").value, 20);
    let se = percent(document.getElementById("se").value, 50);
    let ass = percent(
        document.getElementById("ass").value,
        mode === "Theory" ? 30 : 20
    );

    let ce = mode === "Theory"
        ? ct * 0.3 + se * 0.4 + ass * 0.3
        : ct * 0.2 + se * 0.6 + ass * 0.2;

    document.getElementById("ce_value");
    animate("ceBar", "ceBarLabel", ce);

    return ce;
}

function calculate() {
    let ce = calcCE();
    let mode = document.getElementById("subjectType").value;
    let task = document.getElementById("calcMode").value;
    let lpw = parseFloat(document.getElementById("lpw").value);
    let see = parseFloat(document.getElementById("see").value);
    let target = parseFloat(document.getElementById("targetFinal").value);

    let box = document.getElementById("resultBox");
    box.value = "";

    if (task === "CE % (Auto)") {
        box.value = "CE = " + ce.toFixed(2) + "%";
        return;
    }

    if (task === "Final %") {
        let final = mode === "Theory"
            ? ce * 0.6 + see * 0.4
            : ce * 0.3 + lpw * 0.3 + see * 0.4;
        animate("finalBar", "finalBarLabel", final);
        box.value = "Final = " + final.toFixed(2) + "%";
        return;
    }

    if (task === "Required SEE for Target %") {
        let req = mode === "Theory"
            ? (target - ce * 0.6) / 0.4
            : (target - ce * 0.3 - lpw * 0.3) / 0.4;

        if (req > 100) box.value = "SEE Needed = " + req.toFixed(2) + "% (Impossible)";
        else if (req < 0) box.value = "SEE Needed = " + req.toFixed(2) + "% (Already Enough)";
        else box.value = "SEE Needed = " + req.toFixed(2) + "%";

        return;
    }
}

function showPrediction() {
    let ce = calcCE();
    let mode = document.getElementById("subjectType").value;
    let lpw = parseFloat(document.getElementById("lpw").value);

    let box = document.getElementById("resultBox");
    box.value = "";

    let text = "===============================\n";
    text += "       SEE PREDICTION TABLE\n";
    text += "===============================\n";
    text += "SEE% | Final% | CGPA\n";
    text += "-------------------------------\n";

    for (let see of [40,50,60,70,80,90,100]) {
        let final = mode === "Theory"
            ? ce * 0.6 + see * 0.4
            : ce * 0.3 + lpw * 0.3 + see * 0.4;
        let cg = mapCGPA(final);
        text += `${see}   | ${final.toFixed(2)} | ${cg}\n`;
    }

    box.value = text;
}

function calcSemester() {
    let subs = {
        "Maths": [parseFloat(document.getElementById("math").value), 4],
        "NT": [parseFloat(document.getElementById("nt").value), 3],
        "ICC": [parseFloat(document.getElementById("icc").value), 2],
        "Eco": [parseFloat(document.getElementById("eco").value), 3],
        "DLD": [parseFloat(document.getElementById("dld").value), 3],
        "ED": [parseFloat(document.getElementById("ed").value), 3]
    };

    let totalCredits = 0, weighted = 0;

    for (let s in subs) {
        totalCredits += subs[s][1];
        weighted += mapCGPA(subs[s][0]) * subs[s][1];
    }

    let sgpa = weighted / totalCredits;

    document.getElementById("resultBox").value =
        "Semester CGPA = " + sgpa.toFixed(2);

    animate("semBar", "semBarLabel", sgpa * 10);
}

function resetAll() {
    document.querySelectorAll("input").forEach(i => i.value = "0");
    document.getElementById("resultBox").value = "";
}
