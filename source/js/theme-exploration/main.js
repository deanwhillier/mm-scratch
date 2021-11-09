(function () {
    const body = document.getElementsByTagName('body')[0];
    const themedElements = document.getElementsByClassName('ThemedElement');

    document.addEventListener('keydown', (event) => {
        switch (event.code) {
            // toggle sub-themed
            case 'Digit1': {
                body.classList.toggle('sub-themed');
                break;
            }
            // toggle hover, remove active
            case 'KeyH': {
                Array.from(themedElements).forEach((iconButton) => {
                    iconButton.classList.remove('active');
                    iconButton.classList.toggle('hover');
                });
                break;
            }
            // toggle active, remove hover
            case 'KeyA': {
                Array.from(themedElements).forEach((iconButton) => {
                    iconButton.classList.remove('hover');
                    iconButton.classList.toggle('active');
                });
                break;
            }
            // toggle focus
            case 'KeyF': {
                Array.from(themedElements).forEach((iconButton) => {
                    iconButton.classList.toggle('focus');
                });
                break;
            }
        }
    });
})();
