/* ============================================================
   Ziya Digital Solution — Hero Canvas Animation
   Digital-marketing themed animated background.
   Runs only when #heroCanvas exists (home page only).
   ============================================================ */
(function () {
  var canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var W, H, raf;

  /* -- Brand colour helpers -- */
  var GOLD  = 'rgba(217,162,27,';
  var CYAN  = 'rgba(56,189,248,';
  var WHITE = 'rgba(255,255,255,';
  var GREEN = 'rgba(34,197,94,';

  /* -- Resize -- */
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  /* ---- Network nodes ---- */
  var NODE_COUNT = 55;
  var nodes = [];
  for (var i = 0; i < NODE_COUNT; i++) {
    nodes.push({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  1.5 + Math.random() * 2.5,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      color: Math.random() > 0.5 ? GOLD : CYAN
    });
  }

  /* ---- Floating sparkles ---- */
  var SPARK_COUNT = 30;
  var sparks = [];
  for (var s = 0; s < SPARK_COUNT; s++) {
    sparks.push({
      x:      Math.random() * W,
      y:      Math.random() * H,
      r:      0.8 + Math.random() * 1.4,
      vy:     -(0.3 + Math.random() * 0.6),
      alpha:  Math.random(),
      dAlpha: 0.005 + Math.random() * 0.01
    });
  }

  /* ---- Data packets ---- */
  var packets = [];
  function spawnPacket() {
    var a = Math.floor(Math.random() * nodes.length);
    var b = Math.floor(Math.random() * nodes.length);
    if (a !== b) packets.push({ a: a, b: b, t: 0, speed: 0.008 + Math.random() * 0.012 });
  }
  for (var p = 0; p < 12; p++) spawnPacket();

  /* ---- Bar-chart state ---- */
  var bars       = [0.45, 0.65, 0.50, 0.80, 0.60, 0.90, 0.75];
  var barTargets = bars.slice();
  var barTimer   = 0;

  /* ---- Donut state ---- */
  var donutAngle = 0;

  /* ---- Floating icon badges ---- */
  var icons = [
    { label: 'SEO', x: 0.72, y: 0.20, t: 0.0  },
    { label: 'ADS', x: 0.78, y: 0.55, t: 1.0  },
    { label: '+ROI',x: 0.15, y: 0.15, t: 1.5  },
    { label: '⚡',  x: 0.88, y: 0.78, t: 0.8  }
  ];

  /* ---- Helpers ---- */
  function drawLine(x1, y1, x2, y2, alpha, color) {
    ctx.save();
    ctx.strokeStyle = color + alpha + ')';
    ctx.lineWidth   = 0.7;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  function drawGlowNode(x, y, r, color, alpha) {
    var g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.5);
    g.addColorStop(0, color + alpha + ')');
    g.addColorStop(1, color + '0)');
    ctx.save();
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r * 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color + alpha + ')';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawBarChart(ox, oy, w, h, values, tick) {
    var count = values.length;
    var bw    = (w / count) * 0.56;
    var gap   = (w / count) * 0.44;
    ctx.save();
    ctx.globalAlpha = 0.48;
    ctx.strokeStyle = GOLD + '0.3)';
    ctx.lineWidth   = 1;
    ctx.strokeRect(ox - 4, oy - 4, w + 8, h + 8);
    for (var i = 0; i < count; i++) {
      var bh  = values[i] * h;
      var bx  = ox + i * (bw + gap);
      var by  = oy + h - bh;
      var grd = ctx.createLinearGradient(bx, by, bx, oy + h);
      grd.addColorStop(0, GOLD + '0.95)');
      grd.addColorStop(1, GOLD + '0.20)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(bx, by, bw, bh, 3);
      } else {
        ctx.rect(bx, by, bw, bh);
      }
      ctx.fill();
    }
    /* animated scan line */
    var scanY = oy + h * (0.5 + 0.5 * Math.sin(tick * 0.04));
    ctx.strokeStyle = CYAN + '0.5)';
    ctx.lineWidth   = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(ox - 4, scanY);
    ctx.lineTo(ox + w + 4, scanY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  function drawDonut(ox, oy, r, angle) {
    ctx.save();
    ctx.globalAlpha = 0.50;
    ctx.lineWidth   = 10;
    ctx.strokeStyle = WHITE + '0.08)';
    ctx.beginPath();
    ctx.arc(ox, oy, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = GOLD + '0.9)';
    ctx.lineCap     = 'round';
    ctx.beginPath();
    ctx.arc(ox, oy, r, -Math.PI / 2, -Math.PI / 2 + angle);
    ctx.stroke();

    var dotX = ox + r * Math.cos(-Math.PI / 2 + angle);
    var dotY = oy + r * Math.sin(-Math.PI / 2 + angle);
    ctx.fillStyle = WHITE + '0.9)';
    ctx.beginPath();
    ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
    ctx.fill();

    var pct = Math.round((angle / (Math.PI * 2)) * 100);
    ctx.fillStyle       = WHITE + '0.85)';
    ctx.font            = "bold 13px 'Segoe UI', sans-serif";
    ctx.textAlign       = 'center';
    ctx.textBaseline    = 'middle';
    ctx.fillText(pct + '%', ox, oy);
    ctx.restore();
  }

  function drawIconBadge(label, cx, cy, t) {
    var bob = Math.sin(t) * 5;
    ctx.save();
    ctx.font = "bold 11px 'Segoe UI', sans-serif";
    var tw   = ctx.measureText(label).width + 22;
    ctx.globalAlpha = 0.52;
    ctx.fillStyle   = GOLD + '0.14)';
    ctx.strokeStyle = GOLD + '0.40)';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(cx - tw / 2, cy + bob - 13, tw, 26, 7);
    } else {
      ctx.rect(cx - tw / 2, cy + bob - 13, tw, 26);
    }
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle    = GOLD + '0.9)';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, cx, cy + bob);
    ctx.restore();
  }

  /* ---- Main loop ---- */
  var tick = 0;
  function draw() {
    tick++;
    ctx.clearRect(0, 0, W, H);

    /* move nodes */
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    }

    /* edges */
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx = nodes[i].x - nodes[j].x;
        var dy = nodes[i].y - nodes[j].y;
        var d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          drawLine(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y,
                   ((1 - d / 120) * 0.22).toFixed(2), nodes[i].color);
        }
      }
    }

    /* nodes */
    for (var i = 0; i < nodes.length; i++) {
      drawGlowNode(nodes[i].x, nodes[i].y, nodes[i].r, nodes[i].color, 0.85);
    }

    /* packets */
    for (var p = 0; p < packets.length; p++) {
      var pk = packets[p];
      pk.t += pk.speed;
      if (pk.t >= 1) {
        packets[p] = { a: pk.b, b: Math.floor(Math.random() * nodes.length), t: 0, speed: pk.speed };
        continue;
      }
      var na = nodes[pk.a], nb = nodes[pk.b];
      var px2 = na.x + (nb.x - na.x) * pk.t;
      var py2 = na.y + (nb.y - na.y) * pk.t;
      ctx.save();
      ctx.fillStyle   = CYAN + '0.9)';
      ctx.shadowColor = CYAN + '1)';
      ctx.shadowBlur  = 10;
      ctx.beginPath();
      ctx.arc(px2, py2, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    /* sparkles */
    for (var s = 0; s < sparks.length; s++) {
      var sp = sparks[s];
      sp.y     += sp.vy;
      sp.alpha += sp.dAlpha;
      if (sp.alpha > 1)  sp.dAlpha *= -1;
      if (sp.alpha < 0 || sp.y < 0) {
        sp.x = Math.random() * W; sp.y = H;
        sp.alpha = 0; sp.dAlpha = Math.abs(sp.dAlpha);
      }
      ctx.save();
      ctx.fillStyle = WHITE + sp.alpha.toFixed(2) + ')';
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    /* bar chart (lower-left) */
    barTimer++;
    if (barTimer % 90 === 0) {
      for (var b = 0; b < barTargets.length; b++) {
        barTargets[b] = 0.3 + Math.random() * 0.65;
      }
    }
    for (var b = 0; b < bars.length; b++) {
      bars[b] += (barTargets[b] - bars[b]) * 0.04;
    }
    drawBarChart(W * 0.04, H * 0.60, 110, 70, bars, tick);

    /* donut (upper-left) */
    donutAngle = (donutAngle + 0.007) % (Math.PI * 2);
    drawDonut(W * 0.07, H * 0.22, 38, donutAngle);

    /* floating icon badges */
    for (var ic = 0; ic < icons.length; ic++) {
      icons[ic].t += 0.015;
      drawIconBadge(icons[ic].label, W * icons[ic].x, H * icons[ic].y, icons[ic].t);
    }

    raf = requestAnimationFrame(draw);
  }

  draw();

  /* Pause when tab is hidden — saves CPU */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      draw();
    }
  });
})();
