const manageClasses = () => {
    const firstElement = document.querySelector('.one');
    firstElement.classList.add('selected');

    const secondElement = document.querySelector('.two');
    secondElement.classList.remove('selected');

    const thirdElement = document.querySelector('.three');
    thirdElement.classList.toggle('three_done');

    const fourElement = document.querySelector('.four');
    if (fourElement.classList.contains('some-class') === true) {
        fourElement.classList.add('another-class');
        fourElement.classList.remove('some-class');
    } else {
        fourElement.classList.add('some-class');
        fourElement.classList.remove('another-class');
    }
};
manageClasses();
