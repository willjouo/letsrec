/**
 * This class manages the topbar
 * Cool stuff to implement:
 * - Keyboard arrows
 * - Sub-menu
 * - Support for icons
 * - Better for keyboard shortcut
 * - Toggle type item
 * - Apply HSL darker color when window out of focus
 */
// Node
const path = require('path');

// Electron
const {remote} = require('electron');

// Core
const DomEvent = require('../../core/dom-event');
const Template = require('../../core/template');

const Topbar = {
    content: [],
    visible: false,

    /**
     * Injects the modal code into the DOM
     */
    init: function(){
        let devMode = true;
        document.body.innerHTML += Template(path.join(__dirname, 'topbar'), {
            dev: devMode ? `<button data-menu="dev">Debug</button>` : ''
        });

        setImmediate(()=>{
            document.getElementById('topbar').addEventListener('click', (e)=>{
                let m = DomEvent(e, '[data-menu]');
                if(m !== null){
                    if(!Topbar.visible){
                        Topbar.onClick(m.getAttribute('data-menu'));
                    }
                    else {
                        Topbar.destroyMenu();
                    }
                }
            });

            // Set correct maximize button
            Topbar.updateMaximizeButton();
        });
    },

    onClick: (role)=>{
        if(role == 'quit'){
            remote.app.quit();
        }
        else if(role == 'min'){
            remote.getCurrentWindow().minimize();
        }
        else if(role == 'max'){
            let bw = remote.getCurrentWindow();
            if(bw.isMaximized()){
                bw.unmaximize();
            }
            else {
                bw.maximize();
            }
            Topbar.updateMaximizeButton();
        }
        else {
            Topbar.showMenu(role);
        }
    },

    updateMaximizeButton: ()=>{
        let bw = remote.getCurrentWindow();
        let btn = document.querySelector('[data-menu="max"] > div');
        if(bw.isMaximized()){
            btn.classList.add('topbar-unmaximize');
            btn.classList.remove('topbar-maximize');
        }
        else {
            btn.classList.add('topbar-maximize');
            btn.classList.remove('topbar-unmaximize');
        }
    },

    setProjectName: (name)=>{
        let title = name === null ? 'RPGM' : htmlentities(name)+' - RPGM';
        document.getElementById('topbar-title').innerHTML = title;
        document.title = title;
    },

    /** SUBMENU */
    showMenu: (name)=>{
        let items = Topbar.getMenuItems(name);

        Topbar.content = [];
        
        // Content
        let html = '';
        let internali = 0;
        for(let i = 0; i < items.length; ++i)
        {
            let type = items[i].hasOwnProperty('type') ? items[i].type : 'item';
            if(type === 'item')
            {
                let s = items[i].hasOwnProperty('disable') && items[i].disable ? ' menu-disable' : '';
                let shortcut = items[i].hasOwnProperty('shortcut') ? `<span class="menu-item-shortcut">${items[i].shortcut}</span>` : '';
                html += `
                <div class="menu-item${s}" data-menu="${internali}">
                    <span class="menu-item-label">${items[i].text}</span>
                    ${shortcut}
                </div>`;
                Topbar.content.push(items[i]);
                internali++;
            }
            else if(type === 'separator')
            {
                html += '<div class="menu-separator"></div>';
            }
        }

        // Menu itself, pop it or use the existing one
        if(document.getElementById('menu') === null)
            document.body.insertAdjacentHTML('beforeend', `<div id="menu">${html}</div>`);
        else
            document.getElementById('menu').innerHTML = html;

        // Positioning
        let btn = document.querySelector(`[data-menu="${name}"]`),
            elrect = btn.getBoundingClientRect(),
            elx = elrect.left+document.body.scrollLeft,
            ely = elrect.top+document.body.scrollTop,
            elh = btn.offsetHeight,
            menu = document.getElementById('menu');
        menu.style.top = `${Math.floor(ely+elh)}px`;
        menu.style.left = `${Math.floor(elx)}px`;

        // Remove old selected style and apply good one
        document.querySelectorAll('#topbar button').forEach(e => e.classList.remove('selected'));
        document.querySelector(`#topbar button[data-menu="${name}"]`).classList.add('selected');

        // Hook and visible
        if(!Topbar.visible){
            Topbar.visible = true;
            setImmediate(()=>{
                document.body.addEventListener('click', Topbar.onClickMenu);
                document.querySelectorAll('#topbar button[data-menu]').forEach((e) => e.addEventListener('mouseenter', Topbar.onMouseEnterMenu));
                document.body.addEventListener('keydown', Topbar.onKeyPressedMenu);
            });
        }
    },

    getMenuItems: (name)=>{
        if(name == 'file'){
            return [
                {type: 'item', text: 'Quit', callback: ()=>{remote.app.quit();}}
            ];
        } else if(name == 'dev'){
            return [
                {type: 'item', text: 'Reload', callback: ()=>{remote.getCurrentWebContents().reloadIgnoringCache();}},
                {type: 'item', text: 'Dev tools', callback: ()=>{remote.getCurrentWebContents().openDevTools();}}
            ];
        } else if(name == 'help'){
            return [
                {type: 'item', text: 'Support', callback: ()=>{require('electron').shell.openExternal('https://twitter.com/willongshow');}},
            ];
        }
        return [];
    },

    onClickMenu: (e)=>{
        // Find menu and sub-menu
        let inMenu = false, sub = null;
        for(let i = 0; i < e.path.length; ++i){
            if(e.path[i].getAttribute && e.path[i].getAttribute('data-menu') !== null) sub = e.path[i];
            if(e.path[i].id == "menu"){
                inMenu = true;
                break;
            }
        }

        // If not in menu
        if(!inMenu){
            Topbar.destroyMenu();
            return;
        }

        // If in sub menu
        if(sub !== null && !sub.classList.contains('menu-disable')){
            let i = parseInt(sub.getAttribute('data-menu'));
            if(isNaN(i)) return;
            if(Topbar.content.length > i) Topbar.content[i].callback();
            Topbar.destroyMenu();
        }
    },

    onMouseEnterMenu: (e)=>{
        let m = e.target.getAttribute('data-menu');
        if(m !== null){
            Topbar.showMenu(m);
        }
    },

    onKeyPressedMenu: (e)=>{
        if(Topbar.visible && (e.key == 'Escape' || e.key == 'Esc' || e.keyCode == 27))
            Topbar.destroyMenu();
    },

    destroyMenu: ()=>{
        document.body.removeEventListener('click', Topbar.onClickMenu);
        document.querySelectorAll('#topbar button[data-menu]').forEach((e) => e.removeEventListener('mouseenter', Topbar.onMouseEnterMenu));
        document.body.removeEventListener('keydown', Topbar.onKeyPressedMenu);
        document.getElementById('menu').remove();
        document.querySelectorAll('#topbar button').forEach(e => e.classList.remove('selected'));
        Topbar.visible = false;
    }
};

module.exports = Topbar;