(function () {
    const mainMenuButton = document.getElementById('MainMenu');
    const menuContainer = document.getElementById('ChannelMenu');
    const menuPanelsParent = menuContainer.getElementsByClassName('MenuPanels')[0];
    const menuPanels = menuContainer.getElementsByClassName('MenuPanel');
    const menuItems = menuContainer.getElementsByClassName('MenuItem');
    const menuHeaderBackButtons = menuContainer.getElementsByClassName('MenuHeader__backButton');

    const stackedPanels = [menuPanels[0]];

    let panelUpdateID;
    const setPanelUpdateID = (value) => {
        panelUpdateID = value;
    };

    let panelCloseDelayID;
    const setPanelCloseDelayID = (value) => {
        panelCloseDelayID = value;
    };

    let menuIsOpen = false;
    const setMenuIsOpen = (value) => {
        menuIsOpen = value;
    };
    setMenuIsOpen(menuContainer.classList.contains('open'));

    const mobileMediaQuery = window.matchMedia('(max-width: 899px)');
    mobileMediaQuery.addEventListener('change', processViewSizeChange);

    let viewIsMobile = mobileMediaQuery.matches;
    const setViewIsMobile = (value) => {
        viewIsMobile = value;
    };
    setViewIsMobile(mobileMediaQuery.matches);

    // position menu
    Popper.createPopper(mainMenuButton, menuPanelsParent, {
        placement: 'bottom-start',
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, 4],
                },
            },
            {
                name: 'menuSizer',
                enabled: true,
                phase: 'write',
                fn: () => {
                    if (!menuContainer.classList.contains('open')) {
                        const menuItemPosition = mainMenuButton.getBoundingClientRect();
                        const viewportHeight = window.innerHeight;
                        menuPanels[0].style.maxHeight = `${
                            viewportHeight - menuItemPosition.bottom + 4 - 48
                        }px`;
                    }
                },
            },
            {
                name: 'computeStyles',
                options: {
                    gpuAcceleration: false,
                },
            },
        ],
    });

    // LISTENERS

    // listeners to open/close the menu
    mainMenuButton.addEventListener('click', (event) => {
        event.stopPropagation();
        menuContainer.classList.toggle('open');
    });
    menuContainer.addEventListener('click', (event) => {
        event.stopPropagation();
        menuContainer.classList.remove('open');
    });

    // listener for specific transitions
    menuContainer.addEventListener('transitionend', (event) => {
        if (event.target === menuContainer && event.propertyName === 'visibility') {
            setMenuIsOpen(event.target.classList.contains('open'));
            if (!menuIsOpen) {
                resetMenu();
            }
        }

        if (event.target.classList.contains('MenuPanel') && event.propertyName === 'transform') {
            if (event.target.classList.contains('open')) {
                return;
            }
            resetPanel(event.target);
        }
    });

    // listeners to update menu panels based on mouse interraction
    menuContainer.addEventListener('mouseover', (event) => {
        if (viewIsMobile || event.target !== menuContainer) {
            return;
        }
        // dismiss sub menu panels
        updateMenuPanels(0);
    });
    Array.from(menuPanels).forEach((panel, panelIndex) => {
        panel.addEventListener('mouseenter', () => {
            if (!menuIsOpen || viewIsMobile) {
                return;
            }
            // update menu panels to make this panel active
            updateMenuPanels(panelIndex, panel);
        });
    });

    // listeners for menu header back buttons
    Array.from(menuHeaderBackButtons).forEach((button) =>
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            if (!viewIsMobile) {
                return;
            }
            closeActiveSubPanel();
        })
    );

    // add listeners to menu items that open sub menus
    Array.from(menuItems)
        .filter((menuItem) => menuItem.getAttribute('data-target-panel'))
        .forEach((menuItem) => {
            menuItem.addEventListener('click', (event) => {
                event.stopPropagation();
                if (!viewIsMobile) {
                    return;
                }
                const targetPanel = getMenuPanelByID(menuItem.getAttribute('data-target-panel'));
                // open sub menu panel for target menu item
                openSubPanel(targetPanel);
            });
            menuItem.addEventListener('mouseenter', () => {
                if (viewIsMobile) {
                    return;
                }
                const targetPanel = getMenuPanelByID(menuItem.getAttribute('data-target-panel'));
                // open sub menu panel for target menu item
                openSubPanel(targetPanel);
            });
            menuItem.addEventListener('mouseleave', () => {
                if (viewIsMobile) {
                    return;
                }
                const panel = getMenuPanelByID(menuItem.getAttribute('data-target-panel'));
                const panelIndex = Array.from(menuPanels).indexOf(panel);
                // update menu panels to dismiss panel for targeted menu item
                updateMenuPanels(panelIndex - 1);
            });
        });

    // HELPER FUNCTIONS

    function getActiveMenuPanel() {
        return Array.from(menuPanels).find((panel) => panel.classList.contains('active'));
    }

    function getMenuPanelByID(panelID) {
        return Array.from(menuPanels).find((panel) => panel.getAttribute('id') === panelID);
    }

    function openSubPanel(subPanel) {
        const parentPanel = getActiveMenuPanel();

        if (subPanel.classList.contains('open')) {
            updateMenuPanels(Array.from(menuPanels).indexOf(subPanel), subPanel);
            return;
        }

        if (!viewIsMobile) {
            const menuItem = Array.from(menuItems).find(
                (menuItem) =>
                    menuItem.getAttribute('data-target-panel') === subPanel.getAttribute('id')
            );
            menuItem.classList.add('active');
            positionSubMenu(menuItem, subPanel);
        }

        parentPanel.classList.remove('active');

        subPanel.classList.add('active');
        subPanel.classList.add('open');
        stackedPanels.push(subPanel);
    }

    function closeActiveSubPanel() {
        closeSubPanel(getActiveMenuPanel());
    }

    function closeSubPanel(subPanel) {
        const subPanels = stackedPanels.splice(
            stackedPanels.indexOf(subPanel),
            stackedPanels.length
        );

        const parentPanel = stackedPanels[stackedPanels.length - 1];

        subPanels.forEach((panel) => {
            panel.classList.remove('active');
            panel.classList.remove('open');

            const menuItem = Array.from(menuItems).find(
                (menuItem) =>
                    menuItem.getAttribute('data-target-panel') === panel.getAttribute('id')
            );
            menuItem.classList.remove('active');
        });

        parentPanel.classList.add('active');
    }

    function positionSubMenu(menuItem, panel) {
        const menuItemPosition = menuItem.getBoundingClientRect();
        const menuPanelsParentPosition = menuPanelsParent.getBoundingClientRect();

        const viewportHeight = window.innerHeight;
        const opensUp = menuItemPosition.top > viewportHeight / 2;

        let maxHeight = opensUp
            ? menuItemPosition.bottom + 8 - 48
            : viewportHeight - menuItemPosition.top - 48;

        let panelVPosition = opensUp
            ? menuItemPosition.bottom + 8 - (menuPanelsParentPosition.top + maxHeight)
            : menuItemPosition.top - 8 - menuPanelsParentPosition.top;

        panel.style.top = `${panelVPosition}px`;
        panel.style.maxHeight = `${maxHeight}px`;
    }

    function updateMenuPanels(newActivePanelIndex) {
        // only act on the most recent request to update panels
        cancelAnimationFrame(panelUpdateID);
        clearTimeout(panelCloseDelayID);

        // close extraneous panels
        const invalidPanels = stackedPanels.slice(newActivePanelIndex + 1);

        // no need to do anything if there's nothing to do :P
        if (invalidPanels.length === 0) {
            return;
        }

        setPanelUpdateID(
            requestAnimationFrame(() =>
                setPanelCloseDelayID(setTimeout(() => closeSubPanel(invalidPanels[0]), 250))
            )
        );
    }

    function resetPanel(panel) {
        panel.classList.remove('open');
        panel.classList.remove('active');
        panel.style.top = null;
        panel.style.bottom = null;
        panel.style.maxHeight = null;
        panel.scrollTop = 0;
    }

    function resetMenu() {
        menuContainer.classList.remove('open');

        Array.from(menuPanels).forEach((panel, index) => {
            if (index === 0) {
                panel.classList.add('open');
                panel.classList.add('active');
                panel.scrollTop = 0;
            } else {
                resetPanel(panel);
            }
        });

        Array.from(menuItems).forEach((menuItem) => menuItem.classList.remove('active'));

        // keep the first panel as it's active by default
        stackedPanels.splice(1, stackedPanels.length);
    }

    function processViewSizeChange(event) {
        setViewIsMobile(event.matches);
        resetMenu();
    }
})();
