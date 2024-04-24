function menu_handler() {
  const dropdown_menu = document.querySelector("#dropdown_menu");
  if (dropdown_menu.classList.contains("hidden"))
    dropdown_menu.classList.remove("hidden");
  else dropdown_menu.classList.add("hidden");
}

//menu a tendina
const menu = document.querySelector("#menu");
menu.addEventListener("click", menu_handler);
