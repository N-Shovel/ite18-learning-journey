# ITE 18 Learning Journey

**Nimrod P. Pala** · ITE 18-FNHX1 · Caraga State University
**Instructor:** James Earl D. Cubillas

Every ITE 18 activity in one place, from JavaScript basics to Three.js physics and imported models.

**Live showcase: https://n-shovel.github.io/ite18-learning-journey/**

## Layout

```
javascript/   Topic 1, 2 and 4 submissions, Odin JavaScript basics, landing page
threejs/      Activities 1.1 to 3.5, one Vite project per activity
site/         showcase page (projects.json drives it) and build.sh
```

The older repos (`activity1-1.7`, `Pala_Nimrod_ITE18-FNHX1_ThreeJS_Activities`, `ite18-activity-*`,
`odin-javascript-basics`, `Landing_Page`) were merged in with their full commit history.

## Add an activity

1. Put the project folder under `javascript/` or `threejs/`.
2. Add an entry to [site/projects.json](site/projects.json) (`type: "vite"` or `"static"`).
3. Push to `main`. GitHub Actions builds every demo and publishes the site.

Build locally: `bash site/build.sh`, then serve `_site/`.
