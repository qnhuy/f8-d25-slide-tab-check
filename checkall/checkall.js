const checkAll = document.querySelector('.check-all')
const checkItems = Array.from(document.querySelectorAll('.check-item'))
const inputs = Array.from(document.querySelectorAll('input'))
let countChecked = 0

function handleCheck(e, item) {
    const inputElement = item.querySelector('input')
    if (e.target !== inputElement) {   
        inputElement.checked ? inputElement.checked = false : inputElement.checked = true
    }

    checkItems.forEach(item => item.children[0].checked ? countChecked++ : '')

    const checkAllBox = checkAll.children[0]

    if (countChecked === checkItems.length) {
        checkAllBox.indeterminate = false
        checkAllBox.checked = true
    } else if (countChecked === 0) {
        checkAllBox.indeterminate = false
        checkAllBox.checked = false
    } else if (countChecked < checkItems.length) {
        checkAllBox.indeterminate = true
    }

    countChecked = 0
}

checkItems.forEach(item => item.onclick = (e) => handleCheck(e, item))

checkAll.onclick = (e) => {
    const allChecked = checkItems.every(item => item.children[0].checked)

    if (allChecked) {
        checkItems.forEach(item => item.children[0].checked = false)
    } else {
        checkItems.forEach(item => item.children[0].checked = true)
    }

    handleCheck(e, checkAll)
}