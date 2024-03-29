const widthDesktopLargeMin = 1600;
const widthDesktopSmallMax = widthDesktopLargeMin - 1;
const widthDesktopSmallMin = 1200;
const widthTabletLargeMax = widthDesktopSmallMin - 1;
const widthTabletLargeMin = 900;
const widthTabletSmallMax = widthTabletLargeMin - 1;
const widthTabletSmallMin = 600;
const widthMobileMax = widthTabletSmallMin - 1;

const WindowWidths = {
    MOBILE: `(max-width: ${widthMobileMax}px)`,
    TABLET_SMALL: `(min-width: ${widthTabletSmallMin}px) and (max-width: ${widthTabletSmallMax}px)`,
    TABLET_LARGE: `(min-width: ${widthTabletLargeMin}px) and (max-width: ${widthTabletLargeMax}px)`,
    DESKTOP_SMALL: `(min-width: ${widthDesktopSmallMin}px) and (max-width: ${widthDesktopSmallMax}px)`,
    DESKTOP_LARGE: `(min-width: ${widthDesktopLargeMin}px)`,
};

(function () {
    const root = document.getElementById('root');
    const Main = document.getElementById('Main');
    const RHS = document.getElementById('RHS');
    const MainPanels = Main.getElementsByClassName('Panel');
    const RHSPanels = RHS.getElementsByClassName('Panel');

    let currentWindowWidth;

    const state = {
        globalThreadsEnabled: false,
    };

    Object.values(WindowWidths).map((queryDefinition) => {
        const query = window.matchMedia(queryDefinition);
        query.addEventListener('change', handleMediaQueryChange);
        handleMediaQueryChange(query);
        return query;
    });

    document.addEventListener('keydown', (event) => {
        switch (event.code) {
            // open/close the global banner
            case 'Digit1': {
                toggleGlobalBanner();
                break;
            }
            // open/close the team sidebar
            case 'Digit2': {
                toggleTeamSidebar();
                break;
            }
            // open/close the apps sidebar
            case 'Digit3': {
                if (currentWindowWidth === 'MOBILE' || currentWindowWidth === 'TABLET_SMALL') {
                    return;
                }
                toggleAppsSidebar();
                break;
            }
            // open/close the mobile menu
            case 'Digit4': {
                if (currentWindowWidth !== 'MOBILE' && currentWindowWidth !== 'TABLET_SMALL') {
                    return;
                }
                toggleMobileMenu();
                closeRHS();
                break;
            }
            // RHS: open and add panels
            case 'Digit5': {
                toggleMobileMenu(true);
                pushRHS();
                break;
            }
            // RHS: remove panels and close
            case 'Digit6': {
                popRHS();
                break;
            }
            // Main: switch between channels and threads
            case 'Digit7': {
                toggleMobileMenu(true);
                toggleGlobalThreads();
                toggleGlobalThreadPanel(true);
                closeRHS();
                break;
            }
            // Main: reveal global thread panel
            case 'Digit8': {
                toggleGlobalThreadPanel();
                break;
            }
        }
    });

    // main view
    document.querySelector('#Main').addEventListener('click', () => {
        if (root.classList.contains('MobileMenu--open')) {
            toggleMobileMenu(true);
        }
    });

    // mobile menu button
    document.querySelectorAll('.MobileMenu').forEach((menuButton) =>
        menuButton.addEventListener('click', (event) => {
            event.stopPropagation();
            event.target.blur();
            toggleMobileMenu();
            closeRHS();
        })
    );

    // main sub panel back button
    document.querySelectorAll('.MainBackButton').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            event.target.blur();
            const lastActivePanel = Array.from(MainPanels)
                .filter((panel) => panel.classList.contains('active'))
                .pop();
            lastActivePanel.classList.remove('active');
        });
    });

    // rhs sub panel back button
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
        root.classList[forceClose ? 'remove' : 'toggle']('GlobalBanner--open');
    }

    function toggleTeamSidebar(forceClose = false) {
        document.getElementById('Teams').classList[forceClose ? 'remove' : 'toggle']('open');
        root.classList[forceClose ? 'remove' : 'toggle']('Teams--open');
    }

    function toggleAppsSidebar(forceClose = false) {
        document.getElementById('AppsBar').classList[forceClose ? 'remove' : 'toggle']('open');
        root.classList[forceClose ? 'remove' : 'toggle']('AppsBar--open');
    }

    function toggleMobileMenu(forceClose = false) {
        root.classList[forceClose ? 'remove' : 'toggle']('MobileMenu--open');
    }

    function toggleGlobalThreads(forceClose = false) {
        state.globalThreadsEnabled = forceClose ? false : !state.globalThreadsEnabled;
        root.classList[forceClose ? 'remove' : 'toggle']('GlobalThreads--active');
    }

    function toggleGlobalThreadPanel(forceClose = false) {
        let close = forceClose;
        if (!state.globalThreadsEnabled) {
            close = true;
        }
        document
            .querySelector('#Main .Panel__thread')
            .classList[close ? 'remove' : 'toggle']('active');
    }

    function closeRHS() {
        RHS.classList.remove('open');
        Array.from(RHSPanels).forEach((panel) => panel.classList.remove('active'));
    }

    function pushRHS() {
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

    function popRHS() {
        const activePanels = Array.from(RHSPanels).filter(
            (panel, index) => index !== 0 && panel.classList.contains('active')
        );
        if (activePanels.length === 0) {
            if (RHS.classList.contains('open')) {
                RHS.classList.remove('open');
                return;
            }
            return;
        }
        const lastActivePanel = activePanels.pop();
        lastActivePanel.classList.remove('active');
    }

    function handleMediaQueryChange(event) {
        if (event.matches) {
            Object.keys(WindowWidths).forEach((query) => root.classList.remove(query));
            const matchIndex = Object.values(WindowWidths).indexOf(event.media);
            currentWindowWidth = Object.keys(WindowWidths)[matchIndex];
            root.classList.add(currentWindowWidth);
        }
    }
})();
