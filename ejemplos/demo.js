// Diseños de ejemplo: los botones no contactan con ningún negocio real.
// Enseñan qué pasaría en la web de un cliente y ofrecen pedir una igual.
(function () {
    var tipo = document.body.dataset.demo || 'ejemplo';
    var pedir = 'https://wa.me/34644694667?text=' + encodeURIComponent('Hola, he visto el ejemplo de ' + tipo + ' y quiero una web así para mi negocio.');
    document.querySelectorAll('[data-pedir]').forEach(function (a) { a.href = pedir; });

    var m = document.createElement('div');
    m.className = 'demo-modal';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.innerHTML = '<div class="demo-card"><small>Esto es un diseño de ejemplo</small><h3></h3><p></p><div class="demo-bubble"></div>' +
        '<div class="demo-actions"><a target="_blank" rel="noopener">Quiero una web así</a><button type="button">Seguir mirando</button></div></div>';
    document.body.appendChild(m);
    m.querySelector('a').href = pedir;
    var h = m.querySelector('h3'), p = m.querySelector('p'), b = m.querySelector('.demo-bubble');
    function cerrar() { m.classList.remove('on'); }
    m.querySelector('button').addEventListener('click', cerrar);
    m.addEventListener('click', function (e) { if (e.target === m) cerrar(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(); });

    window.demoAbrir = function (titulo, texto, mensaje) {
        h.textContent = titulo; p.textContent = texto; b.textContent = mensaje || '';
        m.classList.add('on');
    };

    document.addEventListener('click', function (e) {
        var el = e.target.closest('[data-wa], [data-tel], [data-mapa]');
        if (!el) return;
        e.preventDefault();
        if (el.hasAttribute('data-wa')) {
            window.demoAbrir('En tu web, este botón abre tu WhatsApp', 'El cliente no escribe nada: el mensaje le sale ya hecho y solo tiene que enviarlo.', el.getAttribute('data-wa'));
        } else if (el.hasAttribute('data-tel')) {
            window.demoAbrir('En tu web, este botón llama a tu negocio', 'Un toque desde el móvil y el cliente ya está llamando, sin copiar el número.');
        } else {
            window.demoAbrir('En tu web, este botón abre el mapa', 'El cliente toca y Google Maps le lleva hasta tu puerta.');
        }
    });

    // Bloques que aparecen al llegar a ellos
    var rv = document.querySelectorAll('.rv');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        rv.forEach(function (x) { x.classList.add('in'); });
    } else {
        var io = new IntersectionObserver(function (es) {
            es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
        }, { threshold: 0.12 });
        rv.forEach(function (x) { io.observe(x); });
    }
})();
