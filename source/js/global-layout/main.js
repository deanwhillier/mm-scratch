(function () {
    const RHS = document.getElementById('RHS');
    const RHSPanels = RHS.getElementsByClassName('Panel');

    document.addEventListener('keydown', (event) => {
        switch (event.code) {
            // open/close the global banner
            case 'Digit1': {
                toggleGlobalBanner();
                break;
            }
            // open/close the mobile menu
            case 'Digit2': {
                toggleMobileMenu();
                triggerRHS(true);
                break;
            }
            // open/close the team sidebar
            case 'Digit3': {
                toggleTeamSidebar();
                break;
            }
            // open/close the rhs
            case 'Digit4': {
                toggleMobileMenu(true);
                triggerRHS();
                break;
            }
        }
    });

    // main view
    document.querySelector('#Main').addEventListener('click', () => {
        const rootElement = document.getElementById('root');
        if (rootElement.classList.contains('MobileMenu--open')) {
            toggleMobileMenu(true);
        }
    });

    // mobile menu button
    document.querySelector('.MobileMenu').addEventListener('click', (event) => {
        event.stopPropagation();
        event.target.blur();
        toggleMobileMenu();
        triggerRHS(true);
    });

    // rhs back button
    document.querySelectorAll('.RHSBackButton').forEach((button) =>
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            event.target.blur();
            const lastActivePanel = Array.from(RHSPanels)
                .filter((panel) => panel.classList.contains('active'))
                .pop();
            if (!lastActivePanel) {
                RHS.classList.remove('open');
                return;
            }
            lastActivePanel.classList.remove('active');
        })
    );

    function toggleGlobalBanner(forceClose = false) {
        document.getElementById('GlobalBanner').classList[forceClose ? 'remove' : 'toggle']('open');
        document
            .getElementById('root')
            .classList[forceClose ? 'remove' : 'toggle']('GlobalBanner--open');
    }

    function toggleTeamSidebar(forceClose = false) {
        document.getElementById('Teams').classList[forceClose ? 'remove' : 'toggle']('open');
        document.getElementById('root').classList[forceClose ? 'remove' : 'toggle']('Teams--open');
    }

    function toggleMobileMenu(forceClose = false) {
        const rootElement = document.getElementById('root');
        rootElement.classList[forceClose ? 'remove' : 'toggle']('MobileMenu--open');
    }

    function triggerRHS(forceClose = false) {
        if (forceClose) {
            RHS.classList.remove('open');
            Array.from(RHSPanels).forEach((panel) => panel.classList.remove('active'));
            return;
        }
        const nextPanel = Array.from(RHSPanels).find(
            (panel, index) => index !== 0 && !panel.classList.contains('active')
        );
        if (!nextPanel) {
            return;
        }
        if (!RHS.classList.contains('open')) {
            RHS.classList.add('open');
            return;
        }
        nextPanel.classList.add('active');
    }
})();
