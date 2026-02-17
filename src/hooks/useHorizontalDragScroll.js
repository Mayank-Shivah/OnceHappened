import { useEffect } from "react";

export default function useHorizontalDragScroll(selector = ".category-list") {
  useEffect(() => {
    const sliders = document.querySelectorAll(selector);
    if (!sliders.length) return;

    sliders.forEach((slider) => {
      let isDown = false;
      let startX;
      let scrollLeft;

      const mouseDown = (e) => {
        isDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        slider.style.cursor = "grabbing";
      };

      const mouseLeave = () => {
        isDown = false;
        slider.style.cursor = "grab";
      };

      const mouseUp = () => {
        isDown = false;
        slider.style.cursor = "grab";
      };

      const mouseMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.2; // speed
        slider.scrollLeft = scrollLeft - walk;
      };

      slider.addEventListener("mousedown", mouseDown);
      slider.addEventListener("mouseleave", mouseLeave);
      slider.addEventListener("mouseup", mouseUp);
      slider.addEventListener("mousemove", mouseMove);

      // cleanup
      return () => {
        slider.removeEventListener("mousedown", mouseDown);
        slider.removeEventListener("mouseleave", mouseLeave);
        slider.removeEventListener("mouseup", mouseUp);
        slider.removeEventListener("mousemove", mouseMove);
      };
    });
  }, [selector]);
}
