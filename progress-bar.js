document.addEventListener('DOMContentLoaded', function() {
    const variableElement = document.getElementById('variable_cambiante');
    if (!variableElement) return;

    const cardContent = variableElement.closest('.card-content');
    if (!cardContent) return;

    cardContent.innerHTML = '';

    const progressContainer = document.createElement('div');
    progressContainer.className = 'circle-progress-container';

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "120");
    svg.setAttribute("height", "120");
    svg.setAttribute("viewBox", "0 0 120 120");

    const backgroundCircle = document.createElementNS(svgNS, "circle");
    backgroundCircle.setAttribute("cx", "60");
    backgroundCircle.setAttribute("cy", "60");
    backgroundCircle.setAttribute("r", "54");
    backgroundCircle.setAttribute("fill", "none");
    backgroundCircle.setAttribute("stroke", "#e0e0e0");
    backgroundCircle.setAttribute("stroke-width", "12");
    svg.appendChild(backgroundCircle);

    const progressCircle = document.createElementNS(svgNS, "circle");
    progressCircle.setAttribute("cx", "60");
    progressCircle.setAttribute("cy", "60");
    progressCircle.setAttribute("r", "54");
    progressCircle.setAttribute("fill", "none");
    progressCircle.setAttribute("stroke", "#4CAF50");
    progressCircle.setAttribute("stroke-width", "12");
    progressCircle.setAttribute("stroke-linecap", "round");
    progressCircle.setAttribute("transform", "rotate(-90 60 60)");
    progressCircle.setAttribute("stroke-dasharray", "339.3");
    progressCircle.setAttribute("stroke-dashoffset", "339.3");
    svg.appendChild(progressCircle);

    const percentText = document.createElement('div');
    percentText.className = 'progress-percent';
    percentText.innerText = '0%';

    progressContainer.appendChild(svg);
    progressContainer.appendChild(percentText);
    cardContent.appendChild(progressContainer);

    const styles = document.createElement('style');
    styles.innerHTML = `
        .circle-progress-container {
            position: relative;
            width: 120px;
            height: 120px;
            margin: 0 auto;
        }
        .progress-percent {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 24px;
            font-weight: bold;
        }
    `;
    document.head.appendChild(styles);

    function updateProgress(percent) {
        const circumference = 2 * Math.PI * 54;
        const offset = circumference - (percent / 100) * circumference;
        progressCircle.setAttribute("stroke-dashoffset", offset);
        percentText.innerText = `${percent}%`;

        let color;
        if (percent < 30) {
            color = "#FF5252";
        } else if (percent < 70) {
            color = "#FFC107";
        } else {
            color = "#4CAF50";
        }
        progressCircle.setAttribute("stroke", color);
    }

    updateProgress(0);

    let currentPercent = 0;
    let targetPercent = Math.floor(Math.random() * 101);

    function setNewTarget() {
        targetPercent = Math.floor(Math.random() * 101);
        console.log("New target set:", targetPercent);
    }

    const animationInterval = setInterval(() => {
        if (currentPercent < targetPercent) {
            currentPercent++;
            updateProgress(currentPercent);
        } else if (currentPercent > targetPercent) {
            currentPercent--;
            updateProgress(currentPercent);
        }
    }, 30);

    setInterval(() => {
        setNewTarget();
    }, 10000);
});
