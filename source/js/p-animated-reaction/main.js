const CLASS_ANIMATE = 'Reaction--animate';
const CLASS_SELECTED = 'Reaction--selected';
const CLASS_TRANSITION_UP = 'Reaction--transition-up';
const CLASS_TRANSITION_DOWN = 'Reaction--transition-down';
const CLASS_NUMERAL = 'Reaction__count-numeral';
const CLASS_UPDATING = 'Reaction__count-numeral--updating';
const CLASS_HIDDEN = 'Reaction__count-numeral--hidden';
const EVENT_CLICK = 'click';
const EVENT_TRANSITION_START = 'transitionstart';
const EVENT_TRANSITION_END = 'transitionend';
const EVENT_TRANSITION_KEYDOWN = 'keydown';

class ReactionCounter {
    
    constructor(elementReference, startingNumber = 1) {

        // find dom element for provided reference
        this.element = document.querySelector(elementReference);
        if (!this.element) {
            throw new Error("Provided HTML element reference not found.");
        }

        // get a live-updating reference to all counter numerals
        this.counterNumerals = this.element.getElementsByClassName(CLASS_NUMERAL);

        // track the counter value
        this.previousCounter = startingNumber;
        this.counter = startingNumber;

        // indicates what a counter animation is in progress
        this.animationInProgress = false;

        // listen for mouse clicks on the counter
        this.element.addEventListener(EVENT_CLICK, (event) => {
            this.handleElementClick(event);
        });

        // listen for transitionstart events
        this.element.addEventListener(EVENT_TRANSITION_START, (event) => {
            this.handleTransistionStart(event);
        });

        // listen for transitionend events
        this.element.addEventListener(EVENT_TRANSITION_END, (event) => {
            this.handleTransistionEnd(event);
        });

        // handle keyboard shortcuts
        document.addEventListener(EVENT_TRANSITION_KEYDOWN, (event) => {
            this.handleKeyDown(event);
        });

        // update counter visuals if a custom value has been provided
        if (startingNumber > 1) {
            this.setCounterValue(startingNumber);
        }
    }

    // sets the counter to any number without animation
    setCounterValue(number) {
        if (isNaN(number) || number < 1 || this.animationInProgress === true) {
            return;
        }
        this.previousCounter = number - 1;
        this.counter = number;

        // convert counter to string
        const counterString = this.counter.toString();

        // add additional numerals as necessary
        if (counterString.length > this.counterNumerals.length){
            this.addNewNumerals(counterString.length - this.counterNumerals.length);
        }

        this.updateCounter();
    }

    // sets the counter to the provided number with animation
    nextCounterValue(number) {
        if (isNaN(number) || number < 1 || this.animationInProgress === true) {
            return;
        }
        this.previousCounter = this.counter;
        this.counter = number;

        // convert counter to string
        const counterString = this.counter.toString();

        // add additional numerals as necessary
        if (counterString.length > this.counterNumerals.length){
            this.addNewNumerals(counterString.length - this.counterNumerals.length);
        }

        // need to make sure new DOM elements are ready
        requestAnimationFrame(() => {
            this.transitionCounter();
        });
    }

    // initiates a counter update animation
    transitionCounter() {

        // manually update if animations are disabled
        if (!document.getElementsByTagName('body')[0].classList.contains('enable-animations')) {
            this.updateCounter();
            return
        }

        // which counter numerals need to be updated?
        const previousCounterString = this.previousCounter.toString();
        const currentCounterString = this.counter.toString();
        Array.from(this.counterNumerals).forEach((numeral, index) => {
            if (currentCounterString[currentCounterString.length - 1 - index] !== previousCounterString[previousCounterString.length - 1 - index]) {
                numeral.classList.add(CLASS_UPDATING);
            }
        });

        // add animate class to enable animations
        this.element.classList.add(CLASS_ANIMATE);

        // what direction does the animation need to?
        if (this.previousCounter < this.counter) {
            this.element.classList.add(CLASS_TRANSITION_UP);
        } else {
            this.element.classList.add(CLASS_TRANSITION_DOWN);
        }

        // fallback to manually update counter if animations don't trigger
        setTimeout(() => {
            if (this.animationInProgress !== true) {
                this.updateCounter();
            }
        }, 100);
    }

    // updates the counter visual value to match the internal value
    updateCounter() {

        // remove all classes added for animations
        this.element.classList.remove(CLASS_ANIMATE);
        this.element.classList.remove(CLASS_TRANSITION_UP);
        this.element.classList.remove(CLASS_TRANSITION_DOWN);
        Array.from(this.counterNumerals).forEach(numeral => numeral.classList.remove(CLASS_UPDATING));

        // convert counter to string
        const counterString = this.counter.toString();

        // remove excess numerals as necessary
        if (counterString.length < this.counterNumerals.length) {
            this.removeOldNumerals(this.counterNumerals.length - counterString.length);
        }

        // update individual numeral values
        Array.from(this.counterNumerals).forEach((numeral, index) => {
            const currentNumeral = parseInt(counterString[counterString.length - 1 - index], 10);

            // update the previous numeral attribute value
            let previousNumeral = currentNumeral > 0 ? currentNumeral - 1 : 9;
            if (index === this.counterNumerals.length - 1 && previousNumeral === 0) {
                previousNumeral = '';
            }
            numeral.setAttribute('data-previous-value', previousNumeral);

            // update the current numeral text
            numeral.innerText = currentNumeral;

            // update the next numeral attribute value
            let nextNumeral = currentNumeral < 9 ? currentNumeral + 1 : 0;
            numeral.setAttribute('data-next-value', nextNumeral);
        });
    }

    // helper methods

    // convenience method to increment the counter by 1
    increment(value = 1) {
        this.nextCounterValue(this.counter + value);
    }

    // convenience method to decrement the counter by 1
    decrement(value = 1) {
        this.nextCounterValue(this.counter <= value ? 1 : this.counter - value);
    }

    // adds new counter numerals
    addNewNumerals(count = 1) {
        for (let i = 0; i < count; i++) {
            // create new numeral counter and add to the DOM
            const newCounterNumeral = document.createRange().createContextualFragment(`<span class="${CLASS_NUMERAL}" data-previous-value data-next-value="1"><span class="${CLASS_HIDDEN}">0</span></span>`, 'text/html');
            this.counterNumerals[0].parentNode.appendChild(newCounterNumeral);
        }
    }

    // removes existing counter numerals
    removeOldNumerals(count = 1) {
        for (let i = 0; i < count; i++) {
            this.element.querySelector(`.${CLASS_NUMERAL}:last-child`).remove();
        }
    }

    // event handlers

    handleElementClick() {
        if (!this.element.classList.contains(CLASS_SELECTED)) {
            this.element.classList.add(CLASS_SELECTED);
            this.increment();
            return;
        }
        this.element.classList.remove(CLASS_SELECTED);
        this.decrement();
    }

    handleTransistionStart() {
        this.animationInProgress = true;
    }
    
    handleTransistionEnd() {
        this.updateCounter();
        this.animationInProgress = false;
    }
    
    // these keyboard shortcuts are only intended to be used for demo'ing purposes
    handleKeyDown(event) {
        this.element.classList.remove(CLASS_SELECTED);
        switch (event.code) {
            case 'ArrowUp':
                this.increment(event.shiftKey === true ? 10 : 1);
                break;
            case 'ArrowDown':
                this.decrement(event.shiftKey === true ? 10 : 1);
                break;
            case 'Digit1':
                this.setCounterValue(1);
                break;
            case 'Digit2':
                this.setCounterValue(10);
                break;
            case 'Digit3':
                this.setCounterValue(100);
                break;
            case 'Digit4':
                this.setCounterValue(1000);
                break;
        }
    }
}

new ReactionCounter('.Reaction');