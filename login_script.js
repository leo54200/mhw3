function sign_in_form_handler() {
  const sign_in_form = document.querySelector("#sign_in_form");
  const blur = document.querySelector("#blur");
  sign_in_form.classList.remove("hidden");
  blur.classList.add("blur");
}

function close_form_handler() {
  const sign_in_form = document.querySelector("#sign_in_form");
  const blur = document.querySelector("#blur");
  sign_in_form.classList.add("hidden");
  blur.classList.remove("blur");
}

//Bottone accedi per far apparire il form di accesso
const sign_in = document.querySelector(".sign_in");
sign_in.addEventListener("click", sign_in_form_handler);

//Bottone x per far scomparire il form di accesso
const close_form = document.querySelector("#close_form");
close_form.addEventListener("click", close_form_handler);
