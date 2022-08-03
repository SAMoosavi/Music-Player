import anime from "animejs/lib/anime.es.js";

export function svgCreat(el: any): void {
  anime({
    targets: el,
    strokeDashoffset: [0, anime.setDashoffset],
    easing: "easeInOutSine",
    duration: 1500,
    direction: "alternate",
    loop: true,
  });
}
