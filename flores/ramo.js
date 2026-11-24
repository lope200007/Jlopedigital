// Dibuja ramos de flores de limpiapipas en SVG.
// ramo(opciones) devuelve el código SVG; las opciones eligen flor, color, envoltorio y adornos.
(function () {
    var COLORES = {
        rosa:     { p: '#F6AFC4', d: '#E3708F', e: '#FFF4F7' },
        lila:     { p: '#CDA8EE', d: '#9468CC', e: '#F8F0FF' },
        blanco:   { p: '#FFFFFF', d: '#EBDCE2', e: '#FFFFFF' },
        rojo:     { p: '#EE5C66', d: '#B92A39', e: '#FFE6E6' },
        amarillo: { p: '#FFD873', d: '#EFA92C', e: '#FFF9E2' },
        azul:     { p: '#96CBF2', d: '#4E90D3', e: '#F0F8FF' },
        melocoton:{ p: '#FFC3A0', d: '#F08A5D', e: '#FFF4EC' }
    };
    var PAPEL = {
        rosa:    ['#F8CAD7', '#F3B3C5', '#FCE3EA'],
        blanco:  ['#FFFFFF', '#F1ECE9', '#FAF7F5'],
        crema:   ['#F3E6D4', '#E8D5BC', '#FAF2E7'],
        lila:    ['#E6D5F5', '#D4BDEC', '#F3EAFB'],
        negro:   ['#3A3233', '#2A2324', '#4A4142'],
        periodico: ['url(#news)', 'url(#news)', '#F4EFE6']
    };

    function rnd(seed) { var s = seed >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
    function f(n) { return Math.round(n * 10) / 10; }

    function defs(id) {
        return '<defs>' +
            '<filter id="fz' + id + '" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G"/></filter>' +
            '<filter id="sh' + id + '" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>' +
            '<pattern id="news" width="60" height="44" patternUnits="userSpaceOnUse"><rect width="60" height="44" fill="#F4EFE6"/><g opacity=".45">' +
            '<rect x="4" y="5" width="52" height="5" fill="#2E2A26" opacity=".75"/>' +
            '<rect x="4" y="15" width="24" height="2" fill="#7A736B"/><rect x="32" y="15" width="24" height="2" fill="#7A736B"/>' +
            '<rect x="4" y="20" width="24" height="2" fill="#7A736B"/><rect x="32" y="20" width="22" height="2" fill="#7A736B"/>' +
            '<rect x="4" y="25" width="20" height="2" fill="#7A736B"/><rect x="32" y="25" width="24" height="2" fill="#7A736B"/>' +
            '<rect x="4" y="30" width="24" height="2" fill="#7A736B"/><rect x="32" y="30" width="18" height="2" fill="#7A736B"/>' +
            '<rect x="4" y="35" width="22" height="2" fill="#7A736B"/><rect x="32" y="35" width="24" height="2" fill="#7A736B"/></g></pattern>' +
            '</defs>';
    }

    // Pétalo alargado apuntando hacia arriba, con nervios de limpiapipas
    function petaloLirio(s, c) {
        var p = 'M0,0 C' + f(s * .30) + ',' + f(-s * .22) + ' ' + f(s * .24) + ',' + f(-s * .82) + ' 0,' + f(-s) + ' C' + f(-s * .24) + ',' + f(-s * .82) + ' ' + f(-s * .30) + ',' + f(-s * .22) + ' 0,0Z';
        var nervios = '';
        for (var k = -2; k <= 2; k++) nervios += '<path d="M0,' + f(-s * .08) + ' Q' + f(k * s * .07) + ',' + f(-s * .5) + ' ' + f(k * s * .03) + ',' + f(-s * .9) + '" stroke="' + c.d + '" stroke-opacity=".28" stroke-width="2.2" fill="none"/>';
        return '<path d="' + p + '" fill="' + c.e + '" transform="scale(1.13)"/>' +
            '<path d="' + p + '" fill="' + c.p + '"/>' + nervios +
            '<path d="M0,0 C' + f(s * .12) + ',' + f(-s * .12) + ' ' + f(s * .10) + ',' + f(-s * .4) + ' 0,' + f(-s * .5) + ' C' + f(-s * .10) + ',' + f(-s * .4) + ' ' + f(-s * .12) + ',' + f(-s * .12) + ' 0,0Z" fill="' + c.d + '" opacity=".55"/>';
    }
    function lirio(x, y, s, rot, c, id) {
        var g = '<g transform="translate(' + f(x) + ',' + f(y) + ') rotate(' + f(rot) + ')"><g filter="url(#fz' + id + ')">';
        for (var i = 0; i < 6; i++) g += '<g transform="rotate(' + (i * 60 + (i % 2 ? 6 : 0)) + ') scale(' + (i % 2 ? .92 : 1) + ')">' + petaloLirio(s, c) + '</g>';
        g += '</g>';
        for (var j = 0; j < 6; j++) { var a = (j * 60 + 20) * Math.PI / 180, r = s * .32; g += '<line x1="0" y1="0" x2="' + f(Math.cos(a) * r) + '" y2="' + f(Math.sin(a) * r) + '" stroke="#F7F1D9" stroke-width="1.6"/><circle cx="' + f(Math.cos(a) * r) + '" cy="' + f(Math.sin(a) * r) + '" r="2.6" fill="#E9C46A"/>'; }
        return g + '</g>';
    }
    function tulipan(x, y, s, rot, c, id) {
        var w = s * .5;
        return '<g transform="translate(' + f(x) + ',' + f(y) + ') rotate(' + f(rot) + ')" filter="url(#fz' + id + ')">' +
            '<path d="M' + f(-w) + ',' + f(-s * .2) + ' Q' + f(-w * 1.1) + ',' + f(s * .55) + ' 0,' + f(s * .6) + ' Q' + f(w * 1.1) + ',' + f(s * .55) + ' ' + f(w) + ',' + f(-s * .2) + ' L' + f(w * .5) + ',' + f(-s * .55) + ' L0,' + f(-s * .15) + ' L' + f(-w * .5) + ',' + f(-s * .55) + 'Z" fill="' + c.d + '"/>' +
            '<path d="M' + f(-w * .62) + ',' + f(-s * .3) + ' Q' + f(-w * .75) + ',' + f(s * .45) + ' 0,' + f(s * .52) + ' Q' + f(w * .75) + ',' + f(s * .45) + ' ' + f(w * .62) + ',' + f(-s * .3) + ' Q' + f(w * .2) + ',' + f(-s * .62) + ' 0,' + f(-s * .66) + ' Q' + f(-w * .2) + ',' + f(-s * .62) + ' ' + f(-w * .62) + ',' + f(-s * .3) + 'Z" fill="' + c.p + '"/>' +
            '<path d="M0,' + f(-s * .6) + ' L0,' + f(s * .45) + '" stroke="' + c.d + '" stroke-opacity=".3" stroke-width="2.4"/>' +
            '<path d="M' + f(-w * .3) + ',' + f(-s * .45) + ' Q' + f(-w * .4) + ',' + f(s * .1) + ' ' + f(-w * .15) + ',' + f(s * .45) + '" stroke="' + c.d + '" stroke-opacity=".22" stroke-width="2" fill="none"/>' +
            '<path d="M' + f(w * .3) + ',' + f(-s * .45) + ' Q' + f(w * .4) + ',' + f(s * .1) + ' ' + f(w * .15) + ',' + f(s * .45) + '" stroke="' + c.d + '" stroke-opacity=".22" stroke-width="2" fill="none"/>' +
            '</g>';
    }
    function florecita(x, y, s, c, id, perla) {
        var g = '<g transform="translate(' + f(x) + ',' + f(y) + ')"><g filter="url(#fz' + id + ')">';
        for (var i = 0; i < 5; i++) { var a = (i * 72 - 90) * Math.PI / 180; g += '<circle cx="' + f(Math.cos(a) * s * .55) + '" cy="' + f(Math.sin(a) * s * .55) + '" r="' + f(s * .52) + '" fill="' + c.e + '"/><circle cx="' + f(Math.cos(a) * s * .55) + '" cy="' + f(Math.sin(a) * s * .55) + '" r="' + f(s * .38) + '" fill="' + c.p + '"/>'; }
        g += '</g>';
        g += perla ? '<circle r="' + f(s * .26) + '" fill="#FFFDF8"/><circle cx="' + f(-s * .08) + '" cy="' + f(-s * .08) + '" r="' + f(s * .09) + '" fill="#fff"/>' : '<circle r="' + f(s * .22) + '" fill="#F0C44C"/>';
        return g + '</g>';
    }
    function hoja(x, y, s, rot, id) {
        return '<g transform="translate(' + f(x) + ',' + f(y) + ') rotate(' + f(rot) + ')" filter="url(#fz' + id + ')"><ellipse rx="' + f(s * .22) + '" ry="' + f(s * .62) + '" fill="#5E8A4E"/><path d="M0,' + f(s * .55) + ' L0,' + f(-s * .5) + '" stroke="#4A7340" stroke-width="2"/></g>';
    }
    function helecho(x, y, s, rot, id) {
        var g = '<g transform="translate(' + f(x) + ',' + f(y) + ') rotate(' + f(rot) + ')" filter="url(#fz' + id + ')"><path d="M0,0 L0,' + f(-s * 1.2) + '" stroke="#5E8A4E" stroke-width="3"/>';
        for (var i = 1; i < 6; i++) { var yy = -i * s * .2, r = s * (.2 - i * .02); g += '<ellipse cx="' + f(-r * .9) + '" cy="' + f(yy) + '" rx="' + f(r) + '" ry="' + f(r * .45) + '" transform="rotate(-30 ' + f(-r * .9) + ' ' + f(yy) + ')" fill="#6E9A55"/><ellipse cx="' + f(r * .9) + '" cy="' + f(yy) + '" rx="' + f(r) + '" ry="' + f(r * .45) + '" transform="rotate(30 ' + f(r * .9) + ' ' + f(yy) + ')" fill="#6E9A55"/>'; }
        return g + '</g>';
    }
    function espiga(x, y, s, rot, c, id) {
        var g = '<g transform="translate(' + f(x) + ',' + f(y) + ') rotate(' + f(rot) + ')" filter="url(#fz' + id + ')">';
        for (var i = 0; i < 7; i++) g += '<ellipse cx="' + (i % 2 ? 4 : -4) + '" cy="' + f(-i * s * .16) + '" rx="' + f(s * .13) + '" ry="' + f(s * .1) + '" fill="' + (i % 2 ? c.d : c.p) + '"/>';
        return g + '</g>';
    }

    window.ramo = function (o) {
        o = o || {};
        var id = (o.id || 'r') + '', c = COLORES[o.color] || COLORES.rosa, c2 = COLORES[o.color2 || 'blanco'] || COLORES.blanco;
        var pap = PAPEL[o.papel] || PAPEL.rosa, R = rnd(o.semilla || 7), tipo = o.flor || 'mezcla', n = o.tam === 'grande' ? 9 : o.tam === 'pequeno' ? 5 : 7;
        var W = 400, H = 520, gx = 200, gy = 392;
        var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + (o.alt || 'Ramo de flores de limpiapipas') + '">' + defs(id);
        s += '<ellipse cx="200" cy="505" rx="120" ry="12" fill="#5B2A3A" opacity=".18" filter="url(#sh' + id + ')"/>';
        // papel de atrás en abanico
        var back = '';
        for (var i = 0; i < 9; i++) {
            var a = -30 + i * 7.5, col = pap[i % 2], hgt = 250 + (i % 3) * 18;
            back += '<g transform="translate(' + gx + ',' + (gy + 40) + ') rotate(' + a + ')"><path d="M-30,0 L-62,' + (-hgt) + ' Q0,' + (-hgt - 22) + ' 62,' + (-hgt) + ' L30,0Z" fill="' + col + '" stroke="rgba(0,0,0,.06)"/><path d="M-62,' + (-hgt) + ' Q0,' + (-hgt - 22) + ' 62,' + (-hgt) + ' L56,' + (-hgt + 12) + ' Q0,' + (-hgt - 8) + ' -56,' + (-hgt + 12) + 'Z" fill="#fff" opacity=".35"/></g>';
        }
        s += back;
        // posiciones de las flores en una cúpula
        var pos = [];
        var huecos = [[200, 196], [140, 230], [262, 226], [172, 150], [236, 148], [112, 290], [290, 286], [200, 268], [150, 186], [252, 190], [200, 120]];
        for (var k = 0; k < Math.min(n + 2, huecos.length); k++) pos.push([huecos[k][0] + (R() - .5) * 14, huecos[k][1] + (R() - .5) * 14]);
        // tallos
        var tallos = '';
        pos.forEach(function (p) { tallos += '<path d="M' + f(p[0]) + ',' + f(p[1]) + ' Q' + f((p[0] + gx) / 2) + ',' + f(p[1] + 90) + ' ' + f(gx + (R() - .5) * 16) + ',' + gy + '" stroke="#5E8A4E" stroke-width="5" fill="none" filter="url(#fz' + id + ')"/>'; });
        s += tallos;
        // verdes
        s += hoja(118, 250, 70, -38, id) + hoja(284, 246, 70, 40, id) + hoja(176, 304, 54, -18, id) + hoja(228, 308, 54, 22, id);
        s += helecho(300, 210, 70, 18, id) + helecho(98, 214, 60, -20, id);
        if (o.espigas) s += espiga(86, 176, 80, -24, c2, id) + espiga(318, 170, 80, 26, c2, id);
        // flores (las de atrás primero)
        var orden = pos.map(function (p, i) { return [p, i]; }).sort(function (a, b) { return a[0][1] - b[0][1]; });
        orden.forEach(function (it, j) {
            var p = it[0], i = it[1], big = i < 3, sz = big ? 74 : 58, rot = (R() - .5) * 50;
            var col = (o.color2 && i % 3 === 2) ? c2 : c;
            var t = tipo === 'mezcla' ? (i % 3 === 0 ? 'lirio' : i % 3 === 1 ? 'tulipan' : 'lirio') : tipo === 'lirios' ? 'lirio' : 'tulipan';
            if (i >= n) t = 'flor';
            if (t === 'lirio') s += lirio(p[0], p[1], sz, rot, col, id);
            else if (t === 'tulipan') s += tulipan(p[0], p[1] + 6, sz * .78, rot * .4, col, id);
            else s += florecita(p[0], p[1], 20, c2.p === '#FFFFFF' ? c : c2, id, o.perlas);
        });
        if (o.perlas) {
            [[146, 132], [258, 122], [94, 252], [306, 246], [196, 92]].forEach(function (p) { s += florecita(p[0], p[1], 16, c, id, true); });
        }
        // papel delantero y lazo
        var fr = pap[2];
        var fc = o.papel === 'periodico' ? 'url(#news)' : pap[0];
        s += '<path d="M98,318 Q200,356 302,318 L232,506 Q200,516 168,506Z" fill="' + fc + '" stroke="rgba(0,0,0,.08)"/>';
        s += '<path d="M98,318 Q200,356 302,318 L292,344 Q200,380 108,344Z" fill="#000" opacity=".07"/>';
        s += '<path d="M128,330 Q150,420 176,504" stroke="#fff" stroke-opacity=".35" stroke-width="6" fill="none"/>';
        var lazo = o.lazo || (o.papel === 'negro' ? '#E9C46A' : o.papel === 'blanco' ? '#F3B3C5' : '#FFFFFF');
        s += '<g transform="translate(200,404)"><path d="M0,0 C-36,-30 -70,-8 -58,14 C-48,30 -18,14 0,0Z" fill="' + lazo + '" opacity=".92" stroke="rgba(0,0,0,.08)"/>' +
            '<path d="M0,0 C36,-30 70,-8 58,14 C48,30 18,14 0,0Z" fill="' + lazo + '" opacity=".92" stroke="rgba(0,0,0,.08)"/>' +
            '<path d="M-4,4 C-14,40 -24,64 -34,84" stroke="' + lazo + '" stroke-width="7" fill="none" opacity=".9"/><path d="M4,4 C12,42 22,66 34,86" stroke="' + lazo + '" stroke-width="7" fill="none" opacity=".9"/>' +
            '<circle r="8" fill="' + lazo + '" stroke="rgba(0,0,0,.1)"/></g>';
        if (o.tarjeta) s += '<g transform="translate(250,300) rotate(10)"><rect x="0" y="0" width="70" height="46" rx="4" fill="#FFFDF8" stroke="rgba(0,0,0,.12)"/><path d="M12,16 H58 M12,25 H50 M12,34 H44" stroke="#C9A99A" stroke-width="2"/><path d="M35,-22 V0" stroke="#5E8A4E" stroke-width="2"/></g>';
        return s + '</svg>';
    };
})();
