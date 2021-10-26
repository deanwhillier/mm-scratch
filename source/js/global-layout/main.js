(function () {
    document.addEventListener('keydown', (event) => {
        switch (event.code) {
            // open/close the global banner
            case 'Digit1': {
                document.getElementById('GlobalBanner').classList.toggle('open');
                document.getElementById('root').classList.toggle('GlobalBanner--open');
                break;
            }
            // open/close the team sidebar
            case 'Digit2': {
                document.getElementById('Teams').classList.toggle('open');
                document.getElementById('root').classList.toggle('Teams--open');
                break;
            }
            // open/close the mobile menu
            case 'Digit3': {
                document.getElementById('root').classList.toggle('MobileMenu--open');
                break;
            }
            // open/close the rhs
            case 'Digit4': {
                document.getElementById('RHS').classList.toggle('open');
                document.getElementById('root').classList.toggle('RHS--open');
                break;
            }
        }
    });
})();
