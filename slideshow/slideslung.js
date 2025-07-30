function Slideslung(selector, option = {}) {
    //get slide container
    this.container = document.querySelector(selector)
    if (!this.container) {
        return console.error(`Slideslung: can not find element with selector '${selector}'`)
    }

    this.slides = Array.from(this.container.children)
    this.option = Object.assign({
        items: 1,
        loop: true
    }, option)

    this.currentIndex = 0

    this._init()
}

Slideslung.prototype._init = function () {
    //add class 'slideslung-wrapper' to slide container
    this.container.classList.add('slideslung-wrapper')

    this._createTrack()
    this._createNavigation()
}

Slideslung.prototype._createTrack = function () {
    //create track div
    this.track = document.createElement('div')
    this.track.className = 'slideslung-track'

    this.slides.forEach(slide => {
        slide.classList.add('slideslung-slide') //add class='slideslung-slide' to all slides
        this.track.appendChild(slide) //append slide to the track div
        slide.style.flexBasis = `calc(100% / ${this.option.items})` //decide how many elements are displayed
    })

    //add track to container div
    this.container.appendChild(this.track)
}

Slideslung.prototype._createNavigation = function () {
    const renderNavBtn = (btn, btnClass, btnContent) => {
        btn = document.createElement('button')
        btn.className = btnClass
        btn.textContent = btnContent
        this.container.appendChild(btn)
        return btn
    }

    this.prevBtn = renderNavBtn(this.prevBtn, 'slideslung-prevBtn', '<')
    this.nextBtn = renderNavBtn(this.nextBtn, 'slideslung-nextBtn', '>')

    this.prevBtn.onclick = () => this.moveSlide(-1)
    this.nextBtn.onclick = () => this.moveSlide(1)
}

Slideslung.prototype.moveSlide = function (step) {
    if (this.option.loop) {
        this.currentIndex = (this.currentIndex + step + this.slides.length) % this.slides.length
    } else {
        //calculate current index, let its value >=0 and <=overflow element
        this.currentIndex = Math.min(
            Math.max(this.currentIndex + step, 0),
            this.slides.length - this.option.items
        )
    }

    //calculate offset for setting transformation
    this.offset = -(this.currentIndex * (100 / this.option.items))
    this.track.style.transform = `translateX(${this.offset}%)`
}


const mySlider = new Slideslung('#my-slider', {
    items: 1,
    loop: true
})
console.log(mySlider)