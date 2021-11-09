class MenuController {
    constructor(elementReference, startingNumber = 1) {
        this.menuContainerRef = document.querySelector(elementReference);
        this.menu = this.menuContainerRef.querySelector('.Menu');
        this.menuHeader = this.menu.querySelector('.Menu_header');
        this.menuPanelContainer = this.menu.querySelector('.Menu_panels');
        this.menuPanels = Array.from(this.menuContainerRef.querySelectorAll('.Menu_panel'));

        this.activeMenu = 0;
        this.animationEnabled = document
            .querySelector('body')
            .classList.contains('enable-animations');
        this.animatingElements = [];

        // handle header button clicks
        const headerBackButtonRefs =
            this.menuContainerRef.querySelectorAll('.MenuHeader_backButton');
        headerBackButtonRefs.forEach((element) => {
            element.addEventListener('click', (event) => {
                this.handleHeaderBackButtonClick(event);
            });
        });

        // handle menu button clicks
        const menuButtonRefs = this.menuContainerRef.querySelectorAll('.Button');
        menuButtonRefs.forEach((element) => {
            element.addEventListener('click', (event) => {
                this.handleMenuButtonClick(event);
            });
        });

        // determine header height
        this.menuHeader.setAttribute('data-height', this.menuHeader.offsetHeight);

        // determine menu panel heights
        this.menuPanels.forEach((panel) => {
            panel.setAttribute('data-panel-height', panel.offsetHeight);
        });

        // set initial menu height
        this.setMenuHeight(this.menu.offsetHeight);

        // listeners
        this.menu.addEventListener('transitionend', (event) => {
            this.handleMenuTransitionEnd(event);
        });
        this.menu.addEventListener('transitionstart', (event) => {
            this.handleMenuTransitionStart(event);
        });

        // allow active styles to work in mobile safari
        document.addEventListener('touchstart', function () {}, true);
    }

    handleHeaderBackButtonClick = () => {
        this.setActiveMenuPanel(this.activeMenu - 1);
    };

    handleMenuButtonClick = (event) => {
        event.preventDefault();
        const menuItem = event.target.parentNode;
        if (menuItem.getAttribute('data-has-submenu') !== null) {
            this.setActiveMenuPanel(this.activeMenu + 1);
        }
    };

    handleMenuTransitionStart = (event) => {
        if (
            event.target === this.menu ||
            event.target === this.menuPanelContainer ||
            this.menuPanels.includes(event.target)
        ) {
            this.animatingElements.push(event.target);
        }
    };
    handleMenuTransitionEnd = (event) => {
        this.animatingElements = this.animatingElements.filter(
            (element) => element !== event.target
        );
        if (this.animatingElements.length === 0) {
            this.removeAnimationClasses();
        }
    };

    setMenuHeight(value = 0) {
        this.menu.style.height = `${value}px`;
    }
    getMenuHeight(panel = this.currentPanel) {
        return (
            parseInt(panel.getAttribute('data-panel-height'), 10) +
            parseInt(this.menuHeader.getAttribute('data-height'), 10)
        );
    }

    setAnimationClasses(currentPanel, nextPanel) {
        if (this.animationEnabled) {
            currentPanel.classList.remove('Menu_panel___active');
            nextPanel.classList.add('Menu_panel___active');
            this.menu.classList.add('Menu___animating');
        }
    }
    removeAnimationClasses() {
        this.menu.classList.remove('Menu___animating');
    }

    setActiveMenuPanel(index = 0) {
        if (index === this.activeMenu) {
            return;
        }
        if (index < 0) {
            index = 0;
        }
        if (index > this.menuPanels.length - 1) {
            index = this.menuPanels.length - 1;
        }
        const currentPanel = this.activeMenuPanel;
        let nextPanel;
        if (this.activeMenu < index) {
            nextPanel = this.nextMenuPanel;
        } else {
            nextPanel = this.previousMenuPanel;
        }
        nextPanel.focus();
        this.setAnimationClasses(currentPanel, nextPanel);
        setTimeout(() => {
            if (this.activeMenu < index) {
                this.setMenuHeight(this.getMenuHeight(this.nextMenuPanel));
            } else {
                this.setMenuHeight(this.getMenuHeight(this.previousMenuPanel));
            }
            this.menu.setAttribute('data-active-menu-depth', index + 1);
            this.activeMenu = index;
        }, 0);
    }

    get activeMenuPanel() {
        return this.menuPanels[this.activeMenu];
    }
    get previousMenuPanel() {
        return this.menuPanels[this.activeMenu - 1] || null;
    }
    get nextMenuPanel() {
        return this.menuPanels[this.activeMenu + 1] || null;
    }
}

const menu = new MenuController('.MenuContainer');
