// Ramos de flores de limpiapipas dibujados en SVG.
// ramo({ receta }) dibuja uno de los ramos del catálogo; ramo({ flor, color, papel… }) dibuja uno a medida.
// flor(tipo, color, id) dibuja una pieza suelta (hebras, pétalo, lirio) para ilustrar el proceso.
(function () {
    var COL = {
        rosa:      { p: '#F5A3BB', d: '#DB5A7C', l: '#FDD3DE', e: '#FFF6F8' },
        rosaclaro: { p: '#FBC4D3', d: '#EC8DA8', l: '#FFE4EC', e: '#FFFFFF' },
        blanco:    { p: '#FFFFFF', d: '#F0AFC2', l: '#FFFFFF', e: '#FFFFFF' },
        lila:      { p: '#C7A1EB', d: '#8758C4', l: '#E8D9F8', e: '#FBF7FF' },
        morado:    { p: '#9A69D2', d: '#5C3394', l: '#C5A6EA', e: '#F3EAFF' },
        rojo:      { p: '#EC5867', d: '#B02638', l: '#F7A1A9', e: '#FFE9EA' },
        amarillo:  { p: '#FFD46C', d: '#E79F25', l: '#FFEBAE', e: '#FFFBEA' },
        azul:      { p: '#92C7F1', d: '#4787CE', l: '#CFE6FA', e: '#F3F9FF' },
        melocoton: { p: '#FFBF9A', d: '#EC8253', l: '#FFE0CB', e: '#FFF6F0' }
    };
    var NIEVE = { p: '#FFFFFF', d: '#EDE4E8', l: '#FFFFFF', e: '#FFFFFF' };
    var GY = 424;

    function f(n) { return Math.round(n * 10) / 10; }
    function T(x, y, r, sy) { return 'translate(' + f(x) + ',' + f(y) + ')' + (r ? ' rotate(' + f(r) + ')' : '') + (sy && sy !== 1 ? ' scale(1,' + sy + ')' : ''); }
    function col(c) { return typeof c === 'string' ? (COL[c] || COL.rosa) : (c || COL.rosa); }

    // Definiciones (degradados, tramas) de cada dibujo, sin repetir
    function Ctx(id) { this.id = id; this.defs = []; this.keys = {}; this.n = 0; this.perlas = []; }
    Ctx.prototype.add = function (key, make) { if (this.keys[key]) return this.keys[key]; var g = this.id + '-' + (this.n++); this.defs.push(make(g)); return (this.keys[key] = 'url(#' + g + ')'); };
    Ctx.prototype.v = function (a, b, c) { return this.add('v' + a + b + c, function (g) { return '<linearGradient id="' + g + '" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="' + a + '"/><stop offset=".55" stop-color="' + b + '"/><stop offset="1" stop-color="' + (c || b) + '"/></linearGradient>'; }); };
    Ctx.prototype.h = function (a, b) { return this.add('h' + a + b, function (g) { return '<linearGradient id="' + g + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient>'; }); };
    Ctx.prototype.r = function (a, b) { return this.add('r' + a + b, function (g) { return '<radialGradient id="' + g + '" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></radialGradient>'; }); };
    Ctx.prototype.perla = function () { return this.add('perla', function (g) { return '<radialGradient id="' + g + '" cx=".36" cy=".32" r=".78"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#F3ECE3"/><stop offset="1" stop-color="#C9BBAA"/></radialGradient>'; }); };
    Ctx.prototype.panal = function (base, hueco) { return this.add('pn' + base + hueco, function (g) { return '<pattern id="' + g + '" width="14" height="9" patternUnits="userSpaceOnUse"><rect width="14" height="9" fill="' + base + '"/><path d="M2.2,4.5 L4.6,1.3 L9.4,1.3 L11.8,4.5 L9.4,7.7 L4.6,7.7Z" fill="' + hueco + '"/></pattern>'; }); };
    Ctx.prototype.diario = function () {
        return this.add('diario', function (g) {
            var s = '<pattern id="' + g + '" width="150" height="196" patternUnits="userSpaceOnUse"><rect width="150" height="196" fill="#F4EFE6"/>' +
                '<text x="7" y="38" font-family="Georgia, \'Times New Roman\', serif" font-size="37" font-weight="700" fill="#2B2723" letter-spacing="1">PAPER</text><rect x="7" y="46" width="136" height="1.4" fill="#2B2723"/>';
            for (var c = 0; c < 3; c++) for (var r = 0; r < 16; r++) { if (c === 2 && r > 6 && r < 13) continue; s += '<rect x="' + (7 + c * 47) + '" y="' + f(54 + r * 8.4) + '" width="' + (r % 5 === 4 ? 26 : 41) + '" height="2.4" fill="#8F877C"/>'; }
            return s + '<rect x="101" y="112" width="42" height="46" fill="#CFC6B9"/><circle cx="122" cy="128" r="9" fill="#B5AC9F"/><path d="M104,156 Q122,138 140,156Z" fill="#B5AC9F"/></pattern>';
        });
    };
    function filtros(id) {
        return '<filter id="' + id + '-felpa" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB">' +
            '<feTurbulence type="fractalNoise" baseFrequency="1.15" numOctaves="2" seed="4" result="n"/>' +
            '<feDisplacementMap in="SourceGraphic" in2="n" scale="2.8" xChannelSelector="R" yChannelSelector="G" result="d"/>' +
            '<feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="1" seed="9" result="g"/>' +
            '<feColorMatrix in="g" type="matrix" values=".33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0 0 0 0 1" result="gg"/>' +
            '<feComposite in="d" in2="gg" operator="arithmetic" k1=".5" k2=".8" k3="0" k4="0" result="t"/>' +
            '<feComposite in="t" in2="d" operator="in"/></filter>' +
            '<filter id="' + id + '-sombra" x="-30%" y="-200%" width="160%" height="500%"><feGaussianBlur stdDeviation="7"/></filter>';
    }

    // ---------- Flores ----------
    function petalo(cx, s, c, oscuro) {
        var w = s * .27, P = 'M0,0 C' + f(w * 1.15) + ',' + f(-s * .16) + ' ' + f(w * 1.05) + ',' + f(-s * .64) + ' 0,' + f(-s) + ' C' + f(-w * 1.05) + ',' + f(-s * .64) + ' ' + f(-w * 1.15) + ',' + f(-s * .16) + ' 0,0Z';
        var g = '<path d="' + P + '" fill="' + c.e + '" stroke="' + c.e + '" stroke-width="' + f(s * .12) + '" stroke-linejoin="round"/>' +
            '<path d="' + P + '" fill="' + cx.v(c.d, c.p, c.l) + '"/>';
        for (var k = -2; k <= 2; k++) {
            g += '<path d="M' + f(k * w * .14) + ',' + f(-s * .06) + ' Q' + f(k * w * .62) + ',' + f(-s * .48) + ' ' + f(k * w * .1) + ',' + f(-s * .9) + '" fill="none" stroke="' + c.d + '" stroke-opacity=".2" stroke-width="' + f(s * .042) + '"/>' +
                '<path d="M' + f(k * w * .14 + s * .022) + ',' + f(-s * .06) + ' Q' + f(k * w * .62 + s * .022) + ',' + f(-s * .48) + ' ' + f(k * w * .1 + s * .012) + ',' + f(-s * .9) + '" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="' + f(s * .02) + '"/>';
        }
        if (oscuro) g += '<path d="' + P + '" fill="#3A1320" opacity=".07"/>';
        return g;
    }
    function lirio(cx, x, y, s, r, k, c) {
        var g = '<g transform="' + T(x, y, r, k) + '">';
        for (var i = 0; i < 3; i++) g += '<g transform="rotate(' + (i * 120 + 12) + ')">' + petalo(cx, s, c, true) + '</g>';
        for (var j = 0; j < 3; j++) g += '<g transform="rotate(' + (j * 120 + 72) + ') scale(.93)">' + petalo(cx, s, c, false) + '</g>';
        g += '<circle r="' + f(s * .1) + '" fill="' + c.d + '" opacity=".55"/>';
        for (var m = 0; m < 6; m++) {
            var a = (m * 60 + 40) * Math.PI / 180, rr = s * (.42 + (m % 2) * .07), ex = Math.cos(a) * rr, ey = Math.sin(a) * rr;
            g += '<path d="M0,0 Q' + f(ex * .5 + ey * .16) + ',' + f(ey * .5 - ex * .16) + ' ' + f(ex) + ',' + f(ey) + '" stroke="#F4EFD6" stroke-width="' + f(s * .026) + '" fill="none"/>' +
                '<ellipse cx="' + f(ex) + '" cy="' + f(ey) + '" rx="' + f(s * .05) + '" ry="' + f(s * .024) + '" transform="rotate(' + (m * 60 + 40) + ' ' + f(ex) + ' ' + f(ey) + ')" fill="#D38F3A"/>';
        }
        return g + '<path d="M0,0 L' + f(s * .06) + ',' + f(-s * .38) + '" stroke="#E6EDC4" stroke-width="' + f(s * .032) + '"/><circle cx="' + f(s * .06) + '" cy="' + f(-s * .39) + '" r="' + f(s * .038) + '" fill="#C9DC96"/></g>';
    }
    function tulipan(cx, x, y, s, r, c) {
        function P(w, h) { return 'M0,0 C' + f(w) + ',' + f(-h * .08) + ' ' + f(w * .95) + ',' + f(-h * .78) + ' 0,' + f(-h) + ' C' + f(-w * .95) + ',' + f(-h * .78) + ' ' + f(-w) + ',' + f(-h * .08) + ' 0,0Z'; }
        var gd = cx.v(c.d, c.p, c.l), gl = cx.v(c.d, c.p, c.e);
        function pet(tx, a, w, h, fill, op) {
            var g = '<g transform="translate(' + f(tx) + ',0) rotate(' + a + ')"><path d="' + P(w, h) + '" fill="' + fill + '"/>';
            for (var k = -1; k <= 1; k++) g += '<path d="M' + f(k * w * .25) + ',' + f(-h * .08) + ' Q' + f(k * w * .55) + ',' + f(-h * .5) + ' ' + f(k * w * .15) + ',' + f(-h * .92) + '" stroke="' + c.d + '" stroke-opacity=".2" stroke-width="' + f(s * .045) + '" fill="none"/>';
            return g + (op ? '<path d="' + P(w, h) + '" fill="#3A1320" opacity="' + op + '"/>' : '') + '</g>';
        }
        return '<g transform="' + T(x, y, r) + '">' + pet(0, 0, s * .34, s, gd, .12) + pet(-s * .12, -12, s * .3, s * .9, gd, .05) + pet(s * .12, 12, s * .3, s * .9, gd, .05) + pet(0, 0, s * .27, s * .84, gl, 0) +
            '<path d="M' + f(-s * .06) + ',' + f(-s * .8) + ' Q0,' + f(-s * .5) + ' ' + f(-s * .02) + ',' + f(-s * .1) + '" stroke="#fff" stroke-opacity=".35" stroke-width="' + f(s * .03) + '" fill="none"/></g>';
    }
    function florecita(cx, x, y, s, c, perla) {
        var g = '<g transform="' + T(x, y) + '">', i, a;
        for (i = 0; i < 5; i++) { a = (i * 72 - 90) * Math.PI / 180; g += '<circle cx="' + f(Math.cos(a) * s * .5) + '" cy="' + f(Math.sin(a) * s * .5) + '" r="' + f(s * .5) + '" fill="' + c.e + '"/>'; }
        for (i = 0; i < 5; i++) { a = (i * 72 - 90) * Math.PI / 180; var px = Math.cos(a) * s * .5, py = Math.sin(a) * s * .5; g += '<circle cx="' + f(px) + '" cy="' + f(py) + '" r="' + f(s * .36) + '" fill="' + c.p + '"/><circle cx="' + f(px * .78) + '" cy="' + f(py * .78) + '" r="' + f(s * .17) + '" fill="' + c.d + '" opacity=".3"/>'; }
        if (perla) cx.perlas.push([x, y, s * .24]); else g += '<circle r="' + f(s * .2) + '" fill="#F0C14A"/>';
        return g + '</g>';
    }
    function margarita(cx, x, y, s, r, k) {
        var g = '<g transform="' + T(x, y, r, k) + '">';
        for (var i = 0; i < 14; i++) g += '<ellipse cy="' + f(-s * .55) + '" rx="' + f(s * .13) + '" ry="' + f(s * .42) + '" transform="rotate(' + f(i * 360 / 14) + ')" fill="#FFFFFF" stroke="#E6DFD8" stroke-width="1"/>';
        g += '<circle r="' + f(s * .3) + '" fill="' + cx.r('#F8D35A', '#D7940F') + '"/>';
        for (var m = 0; m < 8; m++) { var a = m * Math.PI / 4; g += '<circle cx="' + f(Math.cos(a) * s * .15) + '" cy="' + f(Math.sin(a) * s * .15) + '" r="' + f(s * .04) + '" fill="#A86C08" opacity=".55"/>'; }
        return g + '</g>';
    }
    function gerbera(cx, x, y, s, r, k, c) {
        var g = '<g transform="' + T(x, y, r, k) + '">', i;
        for (i = 0; i < 18; i++) g += '<ellipse cy="' + f(-s * .55) + '" rx="' + f(s * .1) + '" ry="' + f(s * .38) + '" transform="rotate(' + (i * 20) + ')" fill="' + (i % 2 ? c.p : c.l) + '" stroke="' + c.e + '" stroke-width="1.5"/>';
        for (i = 0; i < 12; i++) g += '<ellipse cy="' + f(-s * .34) + '" rx="' + f(s * .07) + '" ry="' + f(s * .22) + '" transform="rotate(' + (i * 30 + 15) + ')" fill="' + c.d + '"/>';
        return g + '<circle r="' + f(s * .2) + '" fill="#3A2238"/><circle r="' + f(s * .11) + '" fill="#F2C94C" opacity=".85"/></g>';
    }
    // ---------- Verdes y rellenos ----------
    function muguet(cx, x, y, s, r) {
        var g = '<g transform="' + T(x, y, r) + '"><path d="M0,0 C0,' + f(-s * .6) + ' ' + f(-s * .15) + ',' + f(-s * .95) + ' ' + f(-s * .5) + ',' + f(-s) + '" stroke="#6E9A55" stroke-width="' + f(s * .035) + '" fill="none"/>';
        [[-.04, -.55], [-.12, -.75], [-.26, -.9], [-.42, -.97]].forEach(function (p, i) {
            var bx = p[0] * s, by = p[1] * s, q = s * (.1 - i * .012);
            g += '<path d="M' + f(bx) + ',' + f(by) + ' l0,' + f(q * .6) + '" stroke="#6E9A55" stroke-width="1.5"/>' +
                '<path d="M' + f(bx - q) + ',' + f(by + q * 1.9) + ' Q' + f(bx - q * 1.1) + ',' + f(by + q * .5) + ' ' + f(bx) + ',' + f(by + q * .5) + ' Q' + f(bx + q * 1.1) + ',' + f(by + q * .5) + ' ' + f(bx + q) + ',' + f(by + q * 1.9) + ' Q' + f(bx + q * .5) + ',' + f(by + q * 1.5) + ' ' + f(bx) + ',' + f(by + q * 1.9) + ' Q' + f(bx - q * .5) + ',' + f(by + q * 1.5) + ' ' + f(bx - q) + ',' + f(by + q * 1.9) + 'Z" fill="#FFFFFF" stroke="#E2DBD4" stroke-width="1"/>';
        });
        return g + '</g>';
    }
    function lavanda(cx, x, y, s, r, c) {
        var g = '<g transform="' + T(x, y, r) + '"><path d="M0,0 L0,' + f(-s) + '" stroke="#6E9A55" stroke-width="' + f(s * .025) + '"/>';
        for (var i = 0; i < 9; i++) { var yy = -s * .45 - i * s * .065, q = s * (.07 - i * .004); g += '<ellipse cx="' + f(-q * .8) + '" cy="' + f(yy) + '" rx="' + f(q) + '" ry="' + f(q * 1.25) + '" fill="' + (i % 2 ? c.d : c.p) + '"/><ellipse cx="' + f(q * .8) + '" cy="' + f(yy - q * .4) + '" rx="' + f(q) + '" ry="' + f(q * 1.25) + '" fill="' + (i % 2 ? c.p : c.d) + '"/>'; }
        return g + '</g>';
    }
    function helecho(cx, x, y, s, r) {
        var g = '<g transform="' + T(x, y, r) + '"><path d="M0,0 C' + f(s * .06) + ',' + f(-s * .4) + ' ' + f(-s * .04) + ',' + f(-s * .7) + ' 0,' + f(-s * .86) + '" stroke="#5E8A4E" stroke-width="' + f(s * .035) + '" fill="none"/>';
        for (var i = 0; i < 6; i++) { var yy = -s * .28 - i * s * .1, q = s * (.072 - i * .005); g += '<circle cx="' + f((i % 2 ? 1 : -1) * q * .7) + '" cy="' + f(yy) + '" r="' + f(q) + '" fill="#6B9A4F"/>'; }
        var R = s * .11, cy = -s * .95;
        return g + '<circle cy="' + f(cy) + '" r="' + f(R) + '" fill="#6B9A4F"/><path d="M' + f(R * .62) + ',' + f(cy) + ' A' + f(R * .62) + ',' + f(R * .62) + ' 0 1 1 0,' + f(cy - R * .62) + ' A' + f(R * .32) + ',' + f(R * .32) + ' 0 1 1 ' + f(R * .2) + ',' + f(cy) + '" stroke="#477539" stroke-width="' + f(s * .024) + '" fill="none"/></g>';
    }
    function eucalipto(cx, x, y, s, r) {
        var gl = cx.h('#3E6044', '#5F8763'), g = '<g transform="' + T(x, y, r) + '"><path d="M0,0 C' + f(s * .05) + ',' + f(-s * .4) + ' ' + f(-s * .05) + ',' + f(-s * .7) + ' 0,' + f(-s) + '" stroke="#4E6B4A" stroke-width="' + f(s * .025) + '" fill="none"/>';
        for (var i = 0; i < 6; i++) {
            var yy = -s * .2 - i * s * .15, q = s * (.1 - i * .008), sd = i % 2 ? 1 : -1, ax = sd * q * 1.05, bx = -ax, by = yy - q * .6;
            g += '<ellipse cx="' + f(ax) + '" cy="' + f(yy) + '" rx="' + f(q) + '" ry="' + f(q * 1.45) + '" transform="rotate(' + (sd * 40) + ' ' + f(ax) + ' ' + f(yy) + ')" fill="' + gl + '"/>' +
                '<ellipse cx="' + f(bx) + '" cy="' + f(by) + '" rx="' + f(q) + '" ry="' + f(q * 1.45) + '" transform="rotate(' + (-sd * 40) + ' ' + f(bx) + ' ' + f(by) + ')" fill="' + gl + '"/>';
        }
        return g + '</g>';
    }
    function espiga(cx, x, y, s, r) { return '<g transform="' + T(x, y, r) + '"><path d="M0,0 L0,' + f(-s * .8) + '" stroke="#B5A584" stroke-width="' + f(s * .02) + '"/><ellipse cy="' + f(-s * .92) + '" rx="' + f(s * .075) + '" ry="' + f(s * .16) + '" fill="#F0E4CB"/></g>'; }
    function hoja(cx, x, y, s, r) { return '<g transform="' + T(x, y, r) + '"><path d="M0,0 C' + f(s * .2) + ',' + f(-s * .3) + ' ' + f(s * .14) + ',' + f(-s * .75) + ' 0,' + f(-s) + ' C' + f(-s * .14) + ',' + f(-s * .75) + ' ' + f(-s * .2) + ',' + f(-s * .3) + ' 0,0Z" fill="' + cx.v('#4C7A40', '#6E9F57') + '"/><path d="M0,0 Q' + f(s * .02) + ',' + f(-s * .5) + ' 0,' + f(-s * .95) + '" stroke="#3E6934" stroke-width="1.6" fill="none"/></g>'; }

    var FLORES = { lirio: 1, tulipan: 1, flor: 1, margarita: 1, gerbera: 1 };
    function pieza(cx, it) {
        var c = col(it.c);
        switch (it.t) {
            case 'lirio': return lirio(cx, it.x, it.y, it.s, it.r || 0, it.k || 1, c);
            case 'tulipan': return tulipan(cx, it.x, it.y, it.s, it.r || 0, c);
            case 'flor': return florecita(cx, it.x, it.y, it.s, it.c === 'nieve' ? NIEVE : c, it.perla);
            case 'margarita': return margarita(cx, it.x, it.y, it.s, it.r || 0, it.k || 1);
            case 'gerbera': return gerbera(cx, it.x, it.y, it.s, it.r || 0, it.k || 1, c);
            case 'muguet': return muguet(cx, it.x, it.y, it.s, it.r || 0);
            case 'lavanda': return lavanda(cx, it.x, it.y, it.s, it.r || 0, c);
            case 'helecho': return helecho(cx, it.x, it.y, it.s, it.r || 0);
            case 'eucalipto': return eucalipto(cx, it.x, it.y, it.s, it.r || 0);
            case 'espiga': return espiga(cx, it.x, it.y, it.s, it.r || 0);
            case 'hoja': return hoja(cx, it.x, it.y, it.s, it.r || 0);
        }
        return '';
    }

    // ---------- Envoltorio ----------
    function lamina(h) {
        var wt = h.wt || 64, wb = h.wb || 22, H = (h.H || 300) * .93, g = '<g transform="translate(200,' + GY + ') rotate(' + f(h.a * .8) + ')">';
        if (h.k === 'cono') {
            g += '<path d="M' + f(-wb * .6) + ',0 L' + f(-wt) + ',' + f(-H) + ' L' + f(wt) + ',' + f(-H) + ' L' + f(wb * .6) + ',0Z" fill="' + h.fill + '"/>' +
                '<path d="M0,0 L' + f(wt * .2) + ',' + f(-H) + ' L' + f(wt) + ',' + f(-H) + ' L' + f(wb * .6) + ',0Z" fill="#3A1320" opacity=".07"/>' +
                '<ellipse cy="' + f(-H) + '" rx="' + f(wt) + '" ry="' + f(wt * .3) + '" fill="' + (h.borde || '#fff') + '"/>' +
                '<ellipse cy="' + f(-H + wt * .05) + '" rx="' + f(wt * .7) + '" ry="' + f(wt * .17) + '" fill="#3A1320" opacity=".14"/>';
        } else {
            var P = 'M' + f(-wb) + ',0 L' + f(-wt) + ',' + f(-H) + ' Q0,' + f(-H - 16) + ' ' + f(wt) + ',' + f(-H) + ' L' + f(wb) + ',0Z';
            g += '<path d="' + P + '" fill="' + h.fill + '"/>' +
                '<path d="M0,0 L0,' + f(-H - 8) + ' Q' + f(wt * .5) + ',' + f(-H - 8) + ' ' + f(wt) + ',' + f(-H) + ' L' + f(wb) + ',0Z" fill="#3A1320" opacity=".07"/>' +
                '<path d="M' + f(-wt) + ',' + f(-H) + ' Q0,' + f(-H - 16) + ' ' + f(wt) + ',' + f(-H) + '" stroke="#fff" stroke-opacity=".6" stroke-width="2" fill="none"/>';
        }
        return g + '</g>';
    }
    function funda(fill) {
        return '<path d="M92,352 Q200,392 308,352 L246,548 Q200,560 154,548Z" fill="' + fill + '" stroke="rgba(58,19,32,.08)"/>' +
            '<path d="M200,380 L200,556" stroke="#3A1320" stroke-opacity=".05" stroke-width="2"/>' +
            '<path d="M200,380 L308,352 L246,548 Q222,556 200,556Z" fill="#3A1320" opacity=".05"/>' +
            '<path d="M92,352 Q200,392 308,352 L300,374 Q200,412 100,374Z" fill="#3A1320" opacity=".07"/>' +
            '<path d="M146,372 Q166,460 176,548" stroke="#fff" stroke-opacity=".4" stroke-width="7" fill="none" stroke-linecap="round"/>';
    }
    function perla(cx, x, y, r) { return '<circle cx="' + f(x) + '" cy="' + f(y + r * .25) + '" r="' + f(r) + '" fill="#3A1320" opacity=".12"/><circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(r) + '" fill="' + cx.perla() + '"/><circle cx="' + f(x - r * .32) + '" cy="' + f(y - r * .34) + '" r="' + f(r * .26) + '" fill="#fff"/>'; }
    function collar(cx) {
        var s = '';
        for (var i = 0; i <= 28; i++) { var t = i / 28, x = (1 - t) * (1 - t) * 96 + 2 * (1 - t) * t * 200 + t * t * 304, y = (1 - t) * (1 - t) * 360 + 2 * (1 - t) * t * 402 + t * t * 360; s += perla(cx, x, y, 2.9); }
        return s;
    }
    function lazo(cx, L) {
        var c = L.c, b = L.b || c, raso = L.tipo === 'raso', fo = raso ? 1 : .45, fill = raso ? cx.v(b, c, c) : c;
        function bucle(sx) {
            return '<path d="M0,0 C' + f(sx * 30) + ',-46 ' + f(sx * 96) + ',-34 ' + f(sx * 88) + ',6 C' + f(sx * 82) + ',34 ' + f(sx * 34) + ',24 0,0Z" fill="' + fill + '" fill-opacity="' + fo + '" stroke="' + b + '" stroke-width="1.8"/>' +
                '<path d="M0,0 C' + f(sx * 22) + ',-28 ' + f(sx * 62) + ',-22 ' + f(sx * 58) + ',4 C' + f(sx * 52) + ',20 ' + f(sx * 22) + ',14 0,0Z" fill="' + (raso ? '#3A1320' : c) + '" fill-opacity="' + (raso ? .12 : .35) + '" stroke="' + b + '" stroke-opacity=".8" stroke-width="1.3"/>';
        }
        return '<g transform="translate(200,440)">' + bucle(-1) + bucle(1) +
            '<path d="M-4,4 C-26,40 8,70 -18,118 L-4,122 C20,76 -12,44 6,8Z" fill="' + fill + '" fill-opacity="' + fo + '" stroke="' + b + '" stroke-width="1.5"/>' +
            '<path d="M4,4 C24,44 -4,78 22,116 L34,110 C10,74 34,42 10,6Z" fill="' + fill + '" fill-opacity="' + fo + '" stroke="' + b + '" stroke-width="1.5"/>' +
            '<ellipse rx="11" ry="9" fill="' + fill + '" fill-opacity="' + (raso ? 1 : .85) + '" stroke="' + b + '"/></g>';
    }
    function tarjeta() {
        return '<g transform="translate(262,300) rotate(9)"><path d="M38,-26 V0" stroke="#5E8A4E" stroke-width="2"/><rect width="78" height="50" rx="3" fill="#FFFDF9" stroke="rgba(58,19,32,.18)"/>' +
            '<g transform="translate(39,15)" fill="#F5A3BB"><ellipse cy="-4" rx="2.6" ry="4"/><ellipse cy="-4" rx="2.6" ry="4" transform="rotate(72)"/><ellipse cy="-4" rx="2.6" ry="4" transform="rotate(144)"/><ellipse cy="-4" rx="2.6" ry="4" transform="rotate(216)"/><ellipse cy="-4" rx="2.6" ry="4" transform="rotate(288)"/><circle r="2" fill="#D7A74C"/></g>' +
            '<text x="39" y="34" text-anchor="middle" font-family="Georgia, serif" font-size="8.5" font-style="italic" fill="#3A2229">P&#233;talo Eterno</text><path d="M20,41 H58" stroke="#E2C9CF" stroke-width="1"/></g>';
    }

    // ---------- Ramos del catálogo ----------
    function abanico(lista) { return lista.map(function (x) { return { k: x[0], fill: x[1], a: x[2], H: x[3], wt: x[4], wb: x[5], borde: x[6] }; }); }
    var RECETAS = {
        perla: function (cx) {
            var pR = cx.panal('#F7C6D3', '#E7A3B7'), pW = cx.panal('#FFFFFF', '#E9E0E3');
            return {
                hojas: abanico([['', pR, -38, 262], ['', '#FBF8F7', -28, 284], ['', '#F6D1DB', -19, 298], ['', pR, -9, 312], ['', pW, 3, 306], ['', pR, 14, 300], ['', '#EBD2C7', 24, 290], ['', '#FBF8F7', 33, 272], ['', '#F6D1DB', 41, 250]]),
                funda: cx.v('#EFE0E3', '#FFFFFF', '#FFFFFF'), lazo: { tipo: 'organza', c: '#FFFFFF', b: '#DCCDD2' }, perlas: true, tarjeta: true,
                items: [
                    { t: 'helecho', x: 296, y: 310, s: 132, r: 14 }, { t: 'helecho', x: 314, y: 336, s: 108, r: 26 }, { t: 'espiga', x: 150, y: 300, s: 150, r: -18 },
                    { t: 'hoja', x: 158, y: 342, s: 92, r: -32 }, { t: 'hoja', x: 252, y: 346, s: 82, r: 28 }, { t: 'hoja', x: 206, y: 352, s: 70, r: 4 },
                    { t: 'tulipan', x: 164, y: 216, s: 62, r: -10, c: 'rosa' }, { t: 'tulipan', x: 302, y: 264, s: 58, r: 16, c: 'rosa' }, { t: 'tulipan', x: 233, y: 190, s: 52, r: 6, c: 'rosa' },
                    { t: 'flor', x: 118, y: 190, s: 22, c: 'rosaclaro', perla: 1 }, { t: 'flor', x: 150, y: 148, s: 19, c: 'rosaclaro', perla: 1 }, { t: 'flor', x: 205, y: 126, s: 18, c: 'rosaclaro', perla: 1 }, { t: 'flor', x: 262, y: 162, s: 20, c: 'rosaclaro', perla: 1 },
                    { t: 'flor', x: 108, y: 252, s: 18, c: 'rosaclaro', perla: 1 }, { t: 'flor', x: 292, y: 306, s: 19, c: 'rosaclaro', perla: 1 }, { t: 'flor', x: 256, y: 254, s: 17, c: 'rosaclaro', perla: 1 }, { t: 'flor', x: 322, y: 214, s: 16, c: 'rosaclaro', perla: 1 },
                    { t: 'lirio', x: 150, y: 292, s: 68, r: -18, k: .88, c: 'rosa' }, { t: 'lirio', x: 236, y: 318, s: 70, r: 12, k: .86, c: 'rosa' }, { t: 'lirio', x: 214, y: 236, s: 58, r: 26, k: .92, c: 'rosa' }
                ]
            };
        },
        blush: function () {
            var L = [];
            for (var i = 0; i < 9; i++) L.push(['cono', i % 2 ? '#F3B3C4' : '#F7C4D1', -38 + i * 9.5, 280 + (i % 3) * 14, 34, 16, '#FCDDE5']);
            return {
                hojas: abanico(L), funda: '#F5BFCD', lazo: { tipo: 'organza', c: '#FFFFFF', b: '#E3B9C5' }, perlas: false, tarjeta: false,
                items: [
                    { t: 'eucalipto', x: 120, y: 300, s: 172, r: -28 }, { t: 'eucalipto', x: 290, y: 298, s: 172, r: 26 }, { t: 'eucalipto', x: 146, y: 300, s: 126, r: -8 }, { t: 'eucalipto', x: 268, y: 300, s: 126, r: 10 },
                    { t: 'hoja', x: 180, y: 346, s: 72, r: -20 }, { t: 'hoja', x: 226, y: 346, s: 72, r: 20 },
                    { t: 'tulipan', x: 184, y: 214, s: 46, r: -8, c: 'rosa' }, { t: 'tulipan', x: 205, y: 204, s: 48, r: 0, c: 'rosa' }, { t: 'tulipan', x: 226, y: 214, s: 46, r: 9, c: 'rosa' },
                    { t: 'lirio', x: 160, y: 248, s: 66, r: -14, k: .9, c: 'blanco' }, { t: 'lirio', x: 246, y: 246, s: 66, r: 16, k: .9, c: 'blanco' }, { t: 'lirio', x: 204, y: 302, s: 70, r: 4, k: .86, c: 'rosa' }
                ]
            };
        },
        periodico: function (cx) {
            var d = cx.diario();
            return {
                hojas: abanico([['', d, -32, 278, 82, 28], ['', d, -16, 300, 82, 28], ['', d, 0, 306, 84, 28], ['', d, 16, 300, 82, 28], ['', d, 32, 278, 82, 28]]),
                funda: d, lazo: { tipo: 'organza', c: '#F9D7DF', b: '#E8AEBF' }, perlas: false, tarjeta: false,
                items: [
                    { t: 'muguet', x: 182, y: 300, s: 158, r: -4 }, { t: 'helecho', x: 270, y: 304, s: 142, r: 10 }, { t: 'hoja', x: 190, y: 352, s: 82, r: -12 }, { t: 'hoja', x: 158, y: 350, s: 72, r: -30 }, { t: 'hoja', x: 244, y: 352, s: 72, r: 24 },
                    { t: 'tulipan', x: 144, y: 266, s: 56, r: -20, c: 'rosa' }, { t: 'tulipan', x: 182, y: 196, s: 52, r: -6, c: 'rosaclaro' }, { t: 'tulipan', x: 252, y: 250, s: 50, r: 14, c: 'rosa' },
                    { t: 'margarita', x: 158, y: 216, s: 22 }, { t: 'margarita', x: 262, y: 206, s: 20, k: .9 }, { t: 'margarita', x: 128, y: 300, s: 18, k: .9 },
                    { t: 'lirio', x: 206, y: 292, s: 80, r: -6, k: .82, c: 'rosa' }, { t: 'lirio', x: 260, y: 290, s: 56, r: 24, k: .88, c: 'rosaclaro' }
                ]
            };
        },
        lavanda: function () {
            var L = [], cs = ['#E8D6F7', '#F6CEE0', '#D9C2EF'];
            for (var i = 0; i < 11; i++) L.push(['', cs[i % 3], -42 + i * 8.4, 268 + (i % 3) * 16, 60, 22]);
            return {
                hojas: abanico(L), funda: '#E4D0F5', lazo: { tipo: 'raso', c: '#D8BBF2', b: '#B28BDA' }, perlas: false, tarjeta: false,
                items: [
                    { t: 'lavanda', x: 118, y: 302, s: 172, r: -26, c: 'lila' }, { t: 'lavanda', x: 140, y: 294, s: 184, r: -14, c: 'morado' }, { t: 'lavanda', x: 286, y: 298, s: 176, r: 22, c: 'lila' }, { t: 'lavanda', x: 262, y: 292, s: 166, r: 11, c: 'morado' },
                    { t: 'hoja', x: 170, y: 350, s: 78, r: -24 }, { t: 'hoja', x: 236, y: 350, s: 78, r: 22 },
                    { t: 'tulipan', x: 176, y: 200, s: 50, r: -8, c: 'lila' }, { t: 'tulipan', x: 240, y: 204, s: 50, r: 9, c: 'lila' }, { t: 'tulipan', x: 160, y: 304, s: 46, r: -16, c: 'lila' },
                    { t: 'margarita', x: 130, y: 236, s: 20 }, { t: 'margarita', x: 296, y: 240, s: 20 }, { t: 'margarita', x: 208, y: 172, s: 18 }, { t: 'margarita', x: 262, y: 314, s: 17, k: .9 },
                    { t: 'flor', x: 304, y: 294, s: 14, c: 'nieve' }, { t: 'flor', x: 122, y: 204, s: 14, c: 'nieve' },
                    { t: 'gerbera', x: 206, y: 254, s: 34, k: .9, c: 'morado' }, { t: 'gerbera', x: 276, y: 266, s: 30, r: 10, k: .9, c: 'morado' },
                    { t: 'lirio', x: 160, y: 268, s: 60, r: -16, k: .88, c: 'lila' }, { t: 'lirio', x: 232, y: 312, s: 64, r: 14, k: .86, c: 'lila' }
                ]
            };
        }
    };

    // ---------- Ramo a medida ----------
    var PAPELES = { rosa: ['#F8CAD7', '#F3B3C5'], blanco: ['#FFFFFF', '#F1ECE9'], crema: ['#F3E6D4', '#E8D5BC'], lila: ['#E6D5F5', '#D4BDEC'], negro: ['#3A3233', '#2A2324'] };
    function personal(cx, o) {
        var c1 = o.color || 'rosa', c2 = (!o.color2 || o.color2 === 'ninguno') ? c1 : o.color2, flor = o.flor || 'mezcla', tam = o.tam || 'mediano', hojas, funda_, lazo_;
        var angs = [-38, -28, -19, -9, 3, 14, 24, 33, 41], H = [262, 284, 298, 312, 306, 300, 290, 272, 250];
        if (o.papel === 'periodico') { var d = cx.diario(); hojas = abanico([['', d, -32, 278, 82, 28], ['', d, -16, 300, 82, 28], ['', d, 0, 306, 84, 28], ['', d, 16, 300, 82, 28], ['', d, 32, 278, 82, 28]]); funda_ = d; }
        else if (o.papel === 'panal') { var pR = cx.panal('#F7C6D3', '#E7A3B7'), pW = cx.panal('#FFFFFF', '#E9E0E3'); hojas = angs.map(function (a, i) { return { fill: i % 2 ? pW : pR, a: a, H: H[i] }; }); funda_ = cx.v('#EFE0E3', '#FFFFFF', '#FFFFFF'); }
        else { var P = PAPELES[o.papel] || PAPELES.rosa; hojas = angs.map(function (a, i) { return { fill: P[i % 2], a: a, H: H[i] }; }); funda_ = o.papel === 'negro' ? '#2E2728' : P[0]; }
        lazo_ = o.papel === 'negro' ? { tipo: 'raso', c: '#E5BE66', b: '#BE9339' } : o.papel === 'blanco' ? { tipo: 'organza', c: '#F7C9D6', b: '#E3A3B6' } : { tipo: 'organza', c: '#FFFFFF', b: '#DCCDD2' };

        var grandes = [[150, 292, 68, -18, .88], [236, 318, 70, 12, .86], [214, 236, 58, 26, .92], [128, 220, 56, -26, .92]];
        var medianos = [[164, 216, 62, -10], [302, 264, 58, 16], [233, 190, 52, 6], [112, 270, 50, -24]];
        var nG = tam === 'grande' ? 4 : tam === 'pequeno' ? 2 : 3, nM = nG;
        var it = [{ t: 'helecho', x: 296, y: 310, s: 132, r: 14 }, { t: 'helecho', x: 106, y: 318, s: 116, r: -18 }, { t: 'hoja', x: 158, y: 342, s: 92, r: -32 }, { t: 'hoja', x: 252, y: 346, s: 82, r: 28 }, { t: 'hoja', x: 206, y: 352, s: 70, r: 4 }];
        if (o.lavanda) it.push({ t: 'lavanda', x: 112, y: 300, s: 176, r: -24, c: 'lila' }, { t: 'lavanda', x: 290, y: 298, s: 172, r: 22, c: 'morado' }, { t: 'lavanda', x: 266, y: 292, s: 160, r: 10, c: 'lila' });
        if (o.gerbera) it.push({ t: 'gerbera', x: 200, y: 168, s: 44, k: .92, c: c1 === 'blanco' ? 'rosa' : c1 });
        if (o.espigas) it.push({ t: 'espiga', x: 150, y: 300, s: 150, r: -18 }, { t: 'espiga', x: 270, y: 300, s: 146, r: 20 }, { t: 'espiga', x: 196, y: 300, s: 168, r: -2 });
        medianos.slice(0, nM).forEach(function (m) {
            if (flor === 'lirios') it.push({ t: 'lirio', x: m[0], y: m[1] - 22, s: m[2] * .82, r: m[3] * 2, k: .9, c: c2 });
            else it.push({ t: 'tulipan', x: m[0], y: m[1], s: m[2], r: m[3], c: flor === 'tulipanes' ? c1 : c2 });
        });
        var peq = [[118, 190, 22], [150, 148, 19], [205, 126, 18], [262, 162, 20], [108, 252, 18], [292, 306, 19], [322, 214, 16]];
        peq.slice(0, tam === 'pequeno' ? 4 : tam === 'grande' ? 7 : 6).forEach(function (p) { it.push({ t: 'flor', x: p[0], y: p[1], s: p[2], c: c2 === c1 ? 'rosaclaro' : c2, perla: o.perlas }); });
        grandes.slice(0, nG).forEach(function (g) {
            if (flor === 'tulipanes') it.push({ t: 'tulipan', x: g[0], y: g[1] + 26, s: g[2] * .95, r: g[3] * .4, c: g[0] > 200 ? c2 : c1 });
            else it.push({ t: 'lirio', x: g[0], y: g[1], s: g[2], r: g[3], k: g[4], c: c1 });
        });
        return { hojas: hojas, funda: funda_, lazo: lazo_, perlas: o.perlas, tarjeta: o.tarjeta, items: it };
    }

    window.ramo = function (o) {
        o = o || {};
        var cx = new Ctx('rm' + (o.id || Math.floor(Math.random() * 1e6)));
        var R = o.receta && RECETAS[o.receta] ? RECETAS[o.receta](cx) : personal(cx, o);
        var body = '<ellipse cx="200" cy="550" rx="112" ry="10" fill="#4A2330" opacity=".2" filter="url(#' + cx.id + '-sombra)"/>';
        R.hojas.forEach(function (h) { body += lamina(h); });
        var tallos = '', verdes = '', flores = [];
        R.items.forEach(function (it) {
            var gx = 200 + (it.x - 200) * .1;
            if (FLORES[it.t]) {
                tallos += '<path d="M' + f(it.x) + ',' + f(it.y) + ' Q' + f((it.x + gx) / 2) + ',' + f(it.y + 70) + ' ' + f(gx) + ',' + (GY - 26) + '" stroke="#5E8A4E" stroke-width="4.5" fill="none" stroke-linecap="round"/>';
                flores.push([it.t === 'tulipan' ? it.y - it.s * .5 : it.y, pieza(cx, it)]);
            } else {
                tallos += '<path d="M' + f(it.x) + ',' + f(it.y) + ' L' + f(gx) + ',' + (GY - 26) + '" stroke="#5E8A4E" stroke-width="4" fill="none" stroke-linecap="round"/>';
                verdes += pieza(cx, it);
            }
        });
        flores.sort(function (a, b) { return a[0] - b[0]; });
        body += '<g filter="url(#' + cx.id + '-felpa)"><g transform="translate(200,300) scale(1.15) translate(-200,-300)">' + tallos + verdes + flores.map(function (x) { return x[1]; }).join('') + '</g></g>';
        cx.perlas.forEach(function (p) { body += perla(cx, 200 + (p[0] - 200) * 1.15, 300 + (p[1] - 300) * 1.15, p[2] * 1.15); });
        body += funda(R.funda);
        if (R.perlas) body += collar(cx);
        body += lazo(cx, R.lazo);
        if (R.tarjeta) body += tarjeta();
        return '<svg viewBox="-22 -16 444 584" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + (o.alt || 'Ramo de flores de limpiapipas') + '"><defs>' + filtros(cx.id) + cx.defs.join('') + '</defs>' + body + '</svg>';
    };

    window.flor = function (tipo, color, id) {
        var cx = new Ctx('fl' + id), c = col(color), b = '';
        if (tipo === 'hebras') {
            [COL.rosa.p, '#FFFFFF', '#6B9A4F', COL.lila.p, COL.rosaclaro.p].forEach(function (k, i) {
                var y = 24 + i * 18, d = 'M10,' + y + ' C36,' + (y - 16) + ' 56,' + (y + 18) + ' 82,' + (y - 4) + ' S104,' + (y + 8) + ' 112,' + (y - 2);
                b += '<path d="' + d + '" stroke="' + k + '" stroke-width="9" fill="none" stroke-linecap="round"/><path d="' + d + '" stroke="#3A1320" stroke-opacity=".12" stroke-width="1.2" fill="none" stroke-dasharray="2 3"/>';
            });
            b = '<g filter="url(#' + cx.id + '-felpa)">' + b + '</g>';
        } else if (tipo === 'petalo') {
            b = '<g filter="url(#' + cx.id + '-felpa)"><g transform="translate(60,108) rotate(8)">' + petalo(cx, 92, c, false) + '</g></g>';
        } else {
            b = '<g filter="url(#' + cx.id + '-felpa)">' + lirio(cx, 60, 62, 48, 10, 1, c) + '</g>';
        }
        return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>' + filtros(cx.id) + cx.defs.join('') + '</defs>' + b + '</svg>';
    };
})();
