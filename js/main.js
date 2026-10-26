document.addEventListener('DOMContentLoaded', function(){
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* mobile nav toggle */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links){
    toggle.addEventListener('click', function(){ links.classList.toggle('open'); });
    document.querySelectorAll('.navgroup > button').forEach(function(b){
      b.addEventListener('click', function(){
        if (window.innerWidth <= 980){ b.parentElement.classList.toggle('open'); }
      });
    });
  }

  /* contact form */
  var form = document.getElementById('contactForm');
  if (form){
    var note = document.getElementById('formNote');
    form.addEventListener('submit', function(e){ e.preventDefault(); note.classList.add('show'); form.reset(); });
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* scroll reveal */
  if (!reduceMotion && 'IntersectionObserver' in window){
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){ if (entry.isIntersecting){ entry.target.classList.add('in'); } });
    }, {threshold:0.12});
    document.querySelectorAll('.reveal').forEach(function(el){ observer.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
  }

  /* starfield (home hero only) */
  var canvas = document.getElementById('stars');
  if (canvas && !reduceMotion){
    var ctx = canvas.getContext('2d');
    var stars = [];
    function resize(){
      var rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width; canvas.height = rect.height;
      var count = Math.floor((rect.width * rect.height) / 11000);
      stars = [];
      for (var i=0; i<count; i++){
        stars.push({ x: Math.random()*rect.width, y: Math.random()*rect.height, r: Math.random()*1.3+0.3, phase: Math.random()*Math.PI*2, speed: Math.random()*0.015+0.004 });
      }
    }
    var styleColor = getComputedStyle(document.documentElement).getPropertyValue('--star').trim() || '#161328';
    function draw(t){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = styleColor;
      stars.forEach(function(s){
        var alpha = 0.25 + 0.55 * Math.abs(Math.sin(s.phase + t*s.speed));
        ctx.globalAlpha = alpha;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }
    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(draw);
  } else if (canvas) { canvas.style.display = 'none'; }

  /* lightbox: works off any button with data-gallery (JSON array of src) and data-index */
  var lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  var lbImg = document.getElementById('lightboxImg');
  var lbTitle = document.getElementById('lightboxTitle');
  var lbThumbs = document.getElementById('lightboxThumbs');
  var lbClose = document.getElementById('lightboxClose');
  var lbPrev = document.getElementById('lightboxPrev');
  var lbNext = document.getElementById('lightboxNext');
  var currentImages = [], currentIndex = 0;

  function renderLightbox(){
    lbImg.src = currentImages[currentIndex];
    lbThumbs.querySelectorAll('button').forEach(function(b,i){ b.classList.toggle('active', i===currentIndex); });
    var active = lbThumbs.querySelector('button.active');
    if (active) active.scrollIntoView({block:'nearest', inline:'center'});
  }
  function openLightbox(images, title, startIndex){
    currentImages = images; currentIndex = startIndex || 0;
    lbTitle.textContent = title;
    lbThumbs.innerHTML = '';
    images.forEach(function(src, i){
      var b = document.createElement('button');
      b.innerHTML = '<img src="'+src+'" alt="">';
      b.addEventListener('click', function(){ currentIndex = i; renderLightbox(); });
      lbThumbs.appendChild(b);
    });
    renderLightbox();
    lightbox.classList.add('open');
  }
  function closeLightbox(){ lightbox.classList.remove('open'); }
  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(e){ if (e.target === lightbox) closeLightbox(); });
  lbPrev.addEventListener('click', function(){ currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length; renderLightbox(); });
  lbNext.addEventListener('click', function(){ currentIndex = (currentIndex + 1) % currentImages.length; renderLightbox(); });
  document.addEventListener('keydown', function(e){
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lbPrev.click();
    if (e.key === 'ArrowRight') lbNext.click();
  });

  document.querySelectorAll('[data-gallery]').forEach(function(el){
    el.addEventListener('click', function(){
      var images = JSON.parse(el.getAttribute('data-gallery'));
      var title = el.getAttribute('data-gallery-title') || 'Gallery';
      var idx = parseInt(el.getAttribute('data-index') || '0', 10);
      openLightbox(images, title, idx);
    });
  });
});
