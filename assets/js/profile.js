(function () {
	var root = document.documentElement;
	root.classList.add('js');

	// Theme toggle
	var themeBtn = document.getElementById('themeToggle');
	function isDark() {
		var t = root.getAttribute('data-theme');
		if (t) return t === 'dark';
		return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	}
	themeBtn.addEventListener('click', function () {
		var next = isDark() ? 'light' : 'dark';
		root.setAttribute('data-theme', next);
		try { localStorage.setItem('theme', next); } catch (e) {}
	});

	// Nav background on scroll
	var nav = document.getElementById('nav');
	function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 24); }
	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();

	// Mobile menu
	var menuBtn = document.getElementById('menuBtn');
	var links = document.getElementById('navLinks');
	function setMenu(open) {
		links.classList.toggle('open', open);
		menuBtn.setAttribute('aria-expanded', String(open));
		if (open) nav.classList.add('scrolled'); else onScroll();
	}
	menuBtn.addEventListener('click', function () { setMenu(!links.classList.contains('open')); });
	links.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
	document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

	if (!('IntersectionObserver' in window)) {
		document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
		return;
	}

	// Reveal on scroll
	var revealObs = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (entry.isIntersecting) {
				entry.target.classList.add('in');
				revealObs.unobserve(entry.target);
			}
		});
	}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
	document.querySelectorAll('.reveal').forEach(function (el) { revealObs.observe(el); });

	// Active nav link
	var navMap = {};
	links.querySelectorAll('a[href^="#"]').forEach(function (a) { navMap[a.getAttribute('href').slice(1)] = a; });
	var sectionObs = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			var a = navMap[entry.target.id];
			if (!a) return;
			if (entry.isIntersecting) {
				Object.keys(navMap).forEach(function (k) { navMap[k].classList.remove('active'); });
				a.classList.add('active');
			}
		});
	}, { rootMargin: '-45% 0px -50% 0px' });
	document.querySelectorAll('main section[id]').forEach(function (s) { sectionObs.observe(s); });

	document.getElementById('year').textContent = new Date().getFullYear();
})();
