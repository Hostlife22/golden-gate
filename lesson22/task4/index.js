const btnElements = document.querySelectorAll('.pagination__page');

function handleClick(event) {
    console.log(event.target.dataset.pageNumber);
}

btnElements.forEach((btn) => {
    btn.addEventListener('click', handleClick);
});
