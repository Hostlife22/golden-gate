export const getTitle = () => {
    const title = document.querySelector('.title');

    return title.textContent;
};

export const getDescription = () => {
    const about = document.querySelector('.about');

    return about.innerText;
};

export const getPlans = () => {
    const plans = document.querySelector('.plans');

    return plans.innerHTML;
};
export const getGoal = () => {
    const goal = document.querySelector('.goal');

    return goal.outerHTML;
};
