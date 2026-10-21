# Three.js Activities: ITE-18

**Student:** Nimrod P. Pala
**Section:** ITE 18-FNHX1
**Course:** ITE-18 Applications Development and Emerging Technologies, Caraga State University
**Instructor:** James Earl D. Cubillas

My work for the "Introduction to Three.js" activities, Parts 5 to 12. Each activity is in its own folder.

**Live site (Activity 1.12):** <https://pala-nimrod-threejs-go-live.vercel.app>

## Activities

| # | Activity | What it shows |
| --- | --- | --- |
| 1.5 | [Cameras](Activity%201.5%20-%20Cameras/) | A red cube you can rotate around with the mouse |
| 1.6 | [Fullscreen and Resizing](Activity%201.6%20-%20Fullscreen%20and%20Resizing/) | The scene fills the window; double-click for fullscreen |
| 1.7 | [Geometries](Activity%201.7%20-%20Geometries/) | Box and sphere geometries, then 50 random triangles |
| 1.8 | [Debug UI](Activity%201.8%20-%20Debug%20UI/) | A control panel to move, hide, recolor and spin the cube |
| 1.9 | [Textures](Activity%201.9%20-%20Textures/) | Images on a cube, ending with a Minecraft-style block |
| 1.10 | [Materials](Activity%201.10%20-%20Materials/) | Every material from the handout, switchable from a menu |
| 1.11 | [3D Text](Activity%201.11%20-%203D%20Text/) | "Hello Three.js" in 3D with 100 donuts around it |
| 1.12 | [Go Live](Activity%201.12%20-%20Go%20Live/) | My name and section in 3D, published online with Vercel |

## How to run an activity

You need [Node.js](https://nodejs.org) installed. Then, in a terminal:

```bash
cd "Activity 1.5 - Cameras"
npm install
npm run dev
```

Open the link it prints (for example <http://localhost:5173>).

Opening `index.html` with Live Server does not work; the activities have to run through `npm run dev`.

## Notes

- The handouts were written for an older version of Three.js. Where the code had to be different to work today, there is a short comment in the code explaining why.
- The matcap textures, the font and the environment map were downloaded from free sources (the three.js project and nidorx/matcaps). The other textures were made for this project.
