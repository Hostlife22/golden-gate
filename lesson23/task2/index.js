const generateNumbersRange = (from, to) => {
    const section = [];

    for (let i = from; i <= to; i++) {
        section.push(i);
    }

    return section;
};

const getSeatLines = () =>
    generateNumbersRange(1, 10)
        .map(
            (seatNumber) =>
                `<div
                    class="sector__seat"
                    data-section-seat="${seatNumber}"
                ></div>`
        )
        .join('');

const getSectorLines = () => {
    const seatString = getSeatLines();

    return generateNumbersRange(1, 10)
        .map(
            (lineNumber) =>
                `<div
                    class="sector__line"
                    data-section-line="${lineNumber}"
                >${seatString}</div>`
        )
        .join('');
};

const arenaElement = document.querySelector('.arena');

const renderArena = () => {
    const linesString = getSectorLines();

    const sectorsString = generateNumbersRange(1, 3)
        .map(
            (sectorNumber) =>
                `<div
                    class="sector"
                    data-section-sector="${sectorNumber}"
                >${linesString}</div>`
        )
        .join('');

    arenaElement.innerHTML = sectorsString;
};

const onSeatSelect = (event) => {
    const isSeat = event.target.classList.contains('sector__seat');

    if (!isSeat) {
        return;
    }

    const seatNumber = event.target.dataset.sectionSeat;
    const lineNumber =
        event.target.closest('.sector__line').dataset.sectionLine;
    const sectorNumber = event.target.closest('.sector').dataset.sectionSector;

    const boardSelectedElement = document.querySelector(
        '.board__selected-seat'
    );

    boardSelectedElement.textContent = `S ${sectorNumber} - L ${lineNumber} - S ${seatNumber}`;
};

arenaElement.addEventListener('click', onSeatSelect);

renderArena();
