// Renders the timeline from projects.json. Add a project there, not here.
const fmt = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' });
const toDate = (iso) => new Date(iso + 'T00:00:00');

function renderHeader(data) {
  const projects = data.modules.flatMap((m) => m.projects);
  const dates = projects.map((p) => p.date).sort();

  document.getElementById('course').textContent = `${data.course} · ${data.school}`;
  document.getElementById('who').textContent =
    `${data.student} · ${data.section} · Instructor: ${data.instructor}`;
  document.getElementById('repo-link').href = data.repo;

  const stats = [
    [projects.length, 'activities'],
    [data.modules.length, 'modules'],
    [new Set(dates).size, 'days of work'],
    [`${fmt.format(toDate(dates[0]))} – ${fmt.format(toDate(dates.at(-1)))}`, 'timeline'],
  ];
  document.getElementById('stats').innerHTML = stats
    .map(([value, label]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`)
    .join('');

  document.getElementById('jump').innerHTML = data.modules
    .map((m) => `<a href="#${m.id}">${m.title}</a>`)
    .join('');
}

function renderCard(project, repo) {
  const card = document.getElementById('project-card').content.cloneNode(true);
  const demo = `demos/${project.slug}/`;
  const thumb = card.querySelector('.thumb');

  thumb.href = demo;
  if (project.thumb) {
    thumb.innerHTML = `<img src="thumbs/${project.slug}.png" alt="" loading="lazy">`;
  } else {
    thumb.classList.add('placeholder');
    thumb.textContent = project.code;
  }

  card.querySelector('.code').textContent = project.code;
  const time = card.querySelector('time');
  time.dateTime = project.date;
  time.textContent = fmt.format(toDate(project.date));
  card.querySelector('h3').textContent = project.title;
  card.querySelector('.summary').textContent = project.summary;
  card.querySelector('.tags').innerHTML = project.tags.map((t) => `<li>${t}</li>`).join('');
  card.querySelector('.demo').href = demo;
  card.querySelector('.src').href = `${repo}/tree/main/${encodeURI(project.source)}`;
  return card;
}

function renderModules(data) {
  const main = document.getElementById('timeline');
  data.modules.forEach((m, i) => {
    const section = document.createElement('section');
    section.className = 'module';
    section.id = m.id;
    section.innerHTML = `
      <div class="module-head">
        <span class="step">${String(i + 1).padStart(2, '0')}</span>
        <div><h2>${m.title}</h2><p>${m.summary}</p></div>
      </div>
      <div class="grid"></div>`;
    const grid = section.querySelector('.grid');
    m.projects.forEach((p) => grid.appendChild(renderCard(p, data.repo)));
    main.appendChild(section);
  });
}

fetch('projects.json')
  .then((r) => r.json())
  .then((data) => {
    renderHeader(data);
    renderModules(data);
  });
