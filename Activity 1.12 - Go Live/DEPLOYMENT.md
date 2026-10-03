# Activity 1.12 - Go Live: Deployment

**Student:** Nimrod P. Pala, ITE 18-FNHX1
**Course:** ITE-18 Applications Development and Emerging Technologies, Caraga State University
**Instructor:** James Earl D. Cubillas

Live URL: <https://pala-nimrod-threejs-go-live.vercel.app>

---

This project is the finished 3D Text scene from Activity 1.11, deployed to [Vercel](https://vercel.com)
using the Vercel CLI, as described in the "Go Live" handout.

## What has already been set up

1. **Vercel CLI installed** as a project dependency:
   ```bash
   npm install vercel
   ```
2. **Deploy script** added to `package.json`:
   ```json
   "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview",
       "deploy": "vercel --prod"
   }
   ```
3. **Build output goes to `dist/`** (see `vite.config.js`: `build.outDir: '../dist'`).
4. `.vercel/` (created by the CLI when the project is linked) is listed in `.gitignore`.

## Steps to deploy

1. Install the dependencies and check that the production build works:
   ```bash
   npm install
   npm run build
   ```
2. Run the deploy script:
   ```bash
   npm run deploy
   ```
3. **First time only:** the CLI asks you to log in. Choose a login method (GitHub, email, ...)
   and confirm in the browser.
4. Answer the setup questions:
   | Question | Answer |
   | --- | --- |
   | Set up and deploy? | **Yes** |
   | Which scope? | your personal account |
   | Link to existing project? | **No** |
   | Project name | e.g. `pala-nimrod-threejs-3d-text` (lowercase, no spaces) |
   | In which directory is your code located? | `./` |
   | Want to modify these settings? | **Yes**, then set **Output Directory** to `dist` |

   Vercel usually detects **Vite** and suggests `dist` by itself. Make sure the
   output directory says `dist`.
5. Wait for the build to finish. The CLI prints the production URL
   (`https://<project-name>.vercel.app`). Copy it into the **Live URL** line at the top of this file.
6. Later deployments only need `npm run deploy`. The project is already linked through `.vercel/`.

## Notes

- To get a preview URL instead of production, run `npx vercel` without `--prod`.
- The deployment, its domain and its settings can be managed at <https://vercel.com/dashboard>.
