document.addEventListener('DOMContentLoaded', function() {
    const variableElements = document.querySelectorAll('.variable-card');
    if (variableElements.length < 2) return;
    
    const secondVariableCard = variableElements[1];
    const cardContent = secondVariableCard.querySelector('.card-content');
    if (!cardContent) return;
    
    cardContent.innerHTML = '';
    
    const speedometerContainer = document.createElement('div');
    speedometerContainer.className = 'speedometer-container';
    
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "200");
    svg.setAttribute("height", "120");
    svg.setAttribute("viewBox", "0 0 200 120");
    
    // Background arc - draw an UPPER semi-circle (correct sweep flag)
    const backgroundArc = document.createElementNS(svgNS, "path");
    backgroundArc.setAttribute("d", "M 20 100 A 80 80 0 0 1 180 100");
    backgroundArc.setAttribute("stroke", "#e0e0e0");
    backgroundArc.setAttribute("stroke-width", "8");
    backgroundArc.setAttribute("fill", "none");
    svg.appendChild(backgroundArc);
    
    // Red zone (0-30%) - Use precise coordinates for 30% point
    const redZone = document.createElementNS(svgNS, "path");
    redZone.setAttribute("d", "M 20 100 A 80 80 0 0 1 52.98 35.28"); // Updated end point
    redZone.setAttribute("stroke", "#FF5252");
    redZone.setAttribute("stroke-width", "8");
    redZone.setAttribute("fill", "none");
    svg.appendChild(redZone);
    
    // Yellow zone (30-70%) - Use precise coordinates for 30% and 70% points
    const yellowZone = document.createElementNS(svgNS, "path");
    yellowZone.setAttribute("d", "M 52.98 35.28 A 80 80 0 0 1 147.02 35.28"); // Updated start and end points
    yellowZone.setAttribute("stroke", "#FFC107");
    yellowZone.setAttribute("stroke-width", "8");
    yellowZone.setAttribute("fill", "none");
    svg.appendChild(yellowZone);
    
    // Green zone (70-100%) - Use precise coordinate for 70% point
    const greenZone = document.createElementNS(svgNS, "path");
    greenZone.setAttribute("d", "M 147.02 35.28 A 80 80 0 0 1 180 100"); // Updated start point
    greenZone.setAttribute("stroke", "#4CAF50");
    greenZone.setAttribute("stroke-width", "8");
    greenZone.setAttribute("fill", "none");
    svg.appendChild(greenZone);
    
    // Draw tick marks around the arc - now on top half
    for (let i = 0; i <= 10; i++) {
        const tickAngle = 180 - i * 18; // 180 to 0 degrees
        const radians = tickAngle * Math.PI / 180;
        const x1 = 100 + 75 * Math.cos(radians);
        const y1 = 100 - 75 * Math.sin(radians); // Subtract to get points above centerline
        const x2 = 100 + 85 * Math.cos(radians);
        const y2 = 100 - 85 * Math.sin(radians); // Subtract to get points above centerline
        
        const tick = document.createElementNS(svgNS, "line");
        tick.setAttribute("x1", x1);
        tick.setAttribute("y1", y1);
        tick.setAttribute("x2", x2);
        tick.setAttribute("y2", y2);
        tick.setAttribute("stroke", "#333");
        tick.setAttribute("stroke-width", "2");
        svg.appendChild(tick);
        
        if (i % 2 === 0) {
            const text = document.createElementNS(svgNS, "text");
            const labelX = 100 + 65 * Math.cos(radians);
            const labelY = 100 - 65 * Math.sin(radians) - 2; // Adjust text position
            text.setAttribute("x", labelX);
            text.setAttribute("y", labelY);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("fill", "#333");
            text.setAttribute("font-size", "10");
            text.textContent = i * 10;
            svg.appendChild(text);
        }
    }
    
    // Add a needle with pivot at bottom
    const needle = document.createElementNS(svgNS, "line");
    needle.setAttribute("x1", "100"); // Center x
    needle.setAttribute("y1", "100"); // Center y (bottom)
    needle.setAttribute("x2", "20");  // End point x - pointing left initially
    needle.setAttribute("y2", "100"); // End point y - horizontal
    needle.setAttribute("stroke", "#D32F2F");
    needle.setAttribute("stroke-width", "2");
    svg.appendChild(needle);
    
    // Center pivot point for needle
    const needleCenter = document.createElementNS(svgNS, "circle");
    needleCenter.setAttribute("cx", "100");
    needleCenter.setAttribute("cy", "100");
    needleCenter.setAttribute("r", "5");
    needleCenter.setAttribute("fill", "#D32F2F");
    svg.appendChild(needleCenter);
    
    // Create percentage text inside SVG
    const percentText = document.createElementNS(svgNS, "text");
    percentText.setAttribute("x", "100");
    percentText.setAttribute("y", "80");
    percentText.setAttribute("text-anchor", "middle");
    percentText.setAttribute("fill", "#333");
    percentText.setAttribute("font-size", "16");
    percentText.setAttribute("font-weight", "bold");
    percentText.textContent = "0%";
    svg.appendChild(percentText);
    
    speedometerContainer.appendChild(svg);
    cardContent.appendChild(speedometerContainer);
    
    const styles = document.createElement('style');
    styles.innerHTML = `
        .speedometer-container {
            position: relative;
            width: 200px;
            height: 120px;
            margin: 0 auto;
            text-align: center;
        }
    `;
    document.head.appendChild(styles);
    
    function updateSpeedometer(percent) {
        // Calculate angle: 0% = 0 degrees (pointing left), 100% = 180 degrees (pointing right)
        // Negative rotation for proper direction (clockwise from left to right)
        const angle = percent * 1.8;
        needle.setAttribute("transform", `rotate(${angle}, 100, 100)`);
        percentText.textContent = `${percent}%`;
    }
    
    let currentPercent = 0;
    let targetPercent = Math.floor(Math.random() * 101);
    
    function setNewTarget() {
        targetPercent = Math.floor(Math.random() * 101);
    }
    
    const animationInterval = setInterval(() => {
        if (currentPercent < targetPercent) {
            currentPercent++;
            updateSpeedometer(currentPercent);
        } else if (currentPercent > targetPercent) {
            currentPercent--;
            updateSpeedometer(currentPercent);
        }
    }, 30);
    
    setInterval(() => {
        setNewTarget();
    }, 10000);
});
