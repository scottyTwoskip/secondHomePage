function registerToggleBtns() {
    const dataToggleBtns = document.querySelectorAll('button[data-toggle]')
    dataToggleBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            // const targetId = btn.getAttribute('data-toggle')
            const targetId = btn.dataset.toggle
            //line 6 is the same as 5
            const targetEl = document.getElementById(targetId)
            toggleActive(targetEl)
        })
    })
}

function toggleActive(element) {
    element.classList.toggle('active')
    element.classList.toggle('hidden')
}

registerToggleBtns()