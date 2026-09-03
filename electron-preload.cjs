const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopWidget', {
  minimize: () => ipcRenderer.send('widget:minimize'),
  close: () => ipcRenderer.send('widget:close'),
  togglePin: () => ipcRenderer.invoke('widget:toggle-pin')
});

window.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('desktop-widget');
  const bar = document.createElement('div');
  bar.className = 'widget-bar';
  bar.innerHTML = `<span class="widget-title">POKÉMON GACHA</span><div class="widget-actions"><button type="button" data-action="pin" class="is-pinned" aria-label="항상 위 고정">●</button><button type="button" data-action="minimize" aria-label="최소화">—</button><button type="button" data-action="close" aria-label="닫기">×</button></div>`;
  document.body.append(bar);
  const style = document.createElement('style');
  style.textContent = `html.desktop-widget,html.desktop-widget body{background:transparent!important}html.desktop-widget body{padding:10px}html.desktop-widget #app{height:calc(100vh - 20px);min-height:560px;border-radius:24px;overflow:hidden;box-shadow:0 18px 55px #0005;border:1px solid #ffffff80}.widget-bar{position:fixed;z-index:100;top:10px;left:10px;right:10px;height:38px;padding:0 12px 0 17px;display:flex;align-items:center;justify-content:space-between;border-radius:24px 24px 0 0;background:linear-gradient(#ffffffd9,#ffffff80);-webkit-app-region:drag;user-select:none}.widget-title{font:800 9px/1 Arial,sans-serif;letter-spacing:.22em;color:#686d72}.widget-actions{display:flex;gap:4px;-webkit-app-region:no-drag}.widget-actions button{width:27px;height:27px;border:0;border-radius:50%;background:#ffffff9c;color:#555;font:700 15px/1 Arial;cursor:pointer}.widget-actions button:hover{background:#fff;transform:scale(1.06)}.widget-actions [data-action=pin]{font-size:9px;color:#aaa}.widget-actions [data-action=pin].is-pinned{color:#e52b36}html.desktop-widget header{top:50px}`;
  document.head.append(style);
  bar.querySelector('[data-action="minimize"]').addEventListener('click', () => ipcRenderer.send('widget:minimize'));
  bar.querySelector('[data-action="close"]').addEventListener('click', () => ipcRenderer.send('widget:close'));
  bar.querySelector('[data-action="pin"]').addEventListener('click', async event => {
    const pinned = await ipcRenderer.invoke('widget:toggle-pin');
    event.currentTarget.classList.toggle('is-pinned', pinned);
  });
});
