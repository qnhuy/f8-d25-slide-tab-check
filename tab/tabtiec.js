const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

function Tabtiec(selector, options = {}) {
    //select container and catch error
    this.container = $(selector)
    if (!this.container) {
        return console.error(`Tabtiec: No container found for selector ${selector}`)
    }

    //select tabs from container catch error
    this.tabs = Array.from(this.container.querySelectorAll('li a'))
    if (!this.tabs.length) {
        return console.error('Tabtiec: no tabs found inside the container!')
    }

    //get proportional panels with tabs
    this.panels = this.tabs.map((tab) => {
        const panel = $(tab.getAttribute('href'))
        if (!panel) {
            console.error(`Tabtiec: no panel found for selector ${tab.getAttribute('href')}`)
        }
        return panel
    }).filter(Boolean) //discard null element

    //return when tabs and panels are not match
    if (this.tabs.length !== this.panels.length) return

    this.options = Object.assign({
        remember: true,
        onChange: null,
    }, options)

    this.paramKey = this._shortenForUrl(selector)

    //save original html of tab container
    this._originalHTML = this.container.innerHTML

    this._init()
}

//default active the first tab and its content
Tabtiec.prototype._init = function () {
    const searchParams = new URLSearchParams(location.search)
    const savedTabHref = searchParams.get(this.paramKey) //get tab href from param key in url
    const savedTabElement = $(`a[href="#${savedTabHref}"]`) //read active tab href from url and get its element

    //if tab element exist, return it, else return the first tab
    const tabChecked = savedTabElement ? savedTabElement : this.tabs[0]
    this._functionTab(tabChecked, false, false)

    this.currentTab = tabChecked

    //handle tabs if it is clicked
    this.tabs.forEach(tab => {
        tab.onclick = (event) => {
            event.preventDefault()
            
            //if clicked tab is not current tab, then switch tab, else do nothing 
            if (this.currentTab !== tab) {
                this.currentTab = tab 
                this._functionTab(tab, true)
            }
        }
    })
}

Tabtiec.prototype._functionTab = function (activeTab, triggerOnChange = false, updateUrl = this.options.remember) {
    //remove active state of all tabs
    this.tabs.forEach(tab => {
        tab.closest('li').classList.remove('tabtiec--active')
    })
    //assign active state for clicked tab
    activeTab.closest('li').classList.add('tabtiec--active')


    //hide all panels content
    this.panels.forEach(panel => panel.hidden = true)
    //get proportional panel from clicked tab
    const activePanel = $(activeTab.getAttribute('href'))
    //show panel
    activePanel.hidden = false

    //if in remember mode, save active tab to the url
    if (updateUrl) {
        const activeTabHref = this._shortenForUrl(activeTab.getAttribute('href'))
        const searchParams = new URLSearchParams(location.search) //get search parameters from url
        searchParams.set(this.paramKey, activeTabHref) //set value of param key = href of active tab 
        history.replaceState(null, null, `?${searchParams}`)
    }

    if (triggerOnChange && typeof this.options.onChange === 'function') {
        this.options.onChange({
            tab: activeTab,
            panel: activePanel,
        })
    }
}

Tabtiec.prototype._shortenForUrl = function (str) {
    return str.replace(/[^a-zA-Z0-9]/g, '')
}

//destroy tabtiec
Tabtiec.prototype.destroy = function (btn) {
    this.container.innerHTML = this._originalHTML
    this.container = null
    this.tabs = null
    this.panels = null
    this.currentTab = null  
}





const tabContain1 = new Tabtiec('#tabs-number', {
    remember: true,
    onChange: (data) => {
        console.log(data)
    }
})
//handle when click destroy button
const destroyBtn1 = $('#destroy-num')
destroyBtn1.onclick = function () {
    tabContain1.destroy(destroyBtn1)
}

const tabContain2 = new Tabtiec('#tabs-alphabet', {
    remember: true,
    onChange: (data) => {
        console.log(data)
    }
})
//handle when click destroy button
const destroyBtn2 = $('#destroy-alph')
destroyBtn2.onclick = function () {
    tabContain2.destroy(destroyBtn2)
}