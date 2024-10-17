import "./styles.css";
import "./normalize.css";

//.container fades in after 200ms
document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".container");
  setTimeout(function () {
    container.classList.toggle("hide");
    container.classList.toggle("show");
  }, 200);
});
