(function () {
	var root = document.documentElement;

	// ---------- Theme ----------
	function isDark() {
		var t = root.getAttribute('data-theme');
		if (t) return t === 'dark';
		return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	}
	var themeBtn = document.getElementById('themeToggle');
	if (themeBtn) {
		themeBtn.addEventListener('click', function () {
			var next = isDark() ? 'light' : 'dark';
			root.setAttribute('data-theme', next);
			try { localStorage.setItem('theme', next); } catch (e) {}
			window.dispatchEvent(new Event('themechange'));
		});
	}

	// ---------- Home: "Show N more" in category blocks ----------
	document.querySelectorAll('.show-more').forEach(function (btn) {
		btn.addEventListener('click', function () {
			var block = btn.closest('.cat-block');
			var grid = block.querySelector('.res-grid');
			var open = grid.classList.toggle('show-all');
			var total = btn.getAttribute('data-total'), shown = btn.getAttribute('data-shown');
			btn.textContent = open ? 'Show fewer' : 'Show ' + (total - shown) + ' more';
			var label = block.querySelector('.displaying');
			if (label) label.textContent = 'Displaying 1-' + (open ? total : shown) + ' (' + total + ')';
			if (!open) block.scrollIntoView({ behavior: 'smooth', block: 'start' });
		});
	});

	// ---------- Sub-navigation dropdown: close on outside click / Escape ----------
	var menu = document.querySelector('.subnav-menu');
	if (menu) {
		document.addEventListener('click', function (e) { if (!menu.contains(e.target)) menu.removeAttribute('open'); });
		document.addEventListener('keydown', function (e) { if (e.key === 'Escape') menu.removeAttribute('open'); });
	}

	// ---------- Post: TOC, progress, code tools ----------
	var prose = document.getElementById('prose');
	if (!prose) return;

	var tocList = document.getElementById('tocList');
	var heads = Array.prototype.slice.call(prose.querySelectorAll('h2[id], h3[id]'));
	if (tocList) {
		heads.forEach(function (h) {
			var li = document.createElement('li');
			if (h.tagName === 'H3') li.className = 'sub';
			var a = document.createElement('a');
			a.href = '#' + h.id;
			a.textContent = h.textContent;
			li.appendChild(a);
			tocList.appendChild(li);
		});
		if (!heads.length) document.querySelector('.toc').hidden = true;
		if ('IntersectionObserver' in window) {
			var links = tocList.querySelectorAll('a');
			var obs = new IntersectionObserver(function (entries) {
				entries.forEach(function (en) {
					if (en.isIntersecting) {
						links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id); });
					}
				});
			}, { rootMargin: '-80px 0px -70% 0px' });
			heads.forEach(function (h) { obs.observe(h); });
		}
	}

	var bar = document.getElementById('readProgress');
	if (bar) {
		var onScroll = function () {
			var r = prose.getBoundingClientRect();
			var total = r.height - window.innerHeight * 0.6;
			var p = Math.min(1, Math.max(0, -r.top / (total || 1)));
			bar.style.width = (p * 100) + '%';
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();
	}

	// Language label + copy button on code blocks
	prose.querySelectorAll('div.highlighter-rouge').forEach(function (block) {
		var m = block.className.match(/language-(\w+)/);
		if (!m || m[1] === 'mermaid') return;
		var lang = document.createElement('span');
		lang.className = 'code-lang';
		lang.textContent = m[1] === 'plaintext' ? 'text' : m[1];
		block.appendChild(lang);
		var btn = document.createElement('button');
		btn.className = 'copy-btn';
		btn.type = 'button';
		btn.textContent = 'Copy';
		btn.addEventListener('click', function () {
			var code = block.querySelector('code');
			var text = code ? code.innerText : '';
			var done = function () { btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = 'Copy'; }, 1500); };
			if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
		});
		block.appendChild(btn);
	});

	// Callout styling: blockquotes that open with **Tip** / **Warning**
	prose.querySelectorAll('blockquote').forEach(function (bq) {
		var first = bq.querySelector('p > strong:first-child');
		if (!first) return;
		var label = first.textContent.toLowerCase();
		if (/^(tip|rule of thumb|in practice)/.test(label)) bq.classList.add('callout-tip');
		if (/^(warning|pitfall|caution|watch out)/.test(label)) bq.classList.add('callout-warn');
	});
})();
