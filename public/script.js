document.addEventListener('DOMContentLoaded', function () {

  const tabs = document.querySelectorAll('.tabs');
  M.Tabs.init(tabs);

  const loginTab = document.querySelector("a[href='#loginForm']");
  const registerTab = document.querySelector("a[href='#registerForm']");

  loginTab.addEventListener("click", () => {
    console.log("Login tab clicked");
  });

  registerTab.addEventListener("click", () => {
    console.log("Register tab clicked");
  });


  const password = document.getElementById('reg_password');
  const confirm = document.getElementById('reg_confirm');

  if (password && confirm) {
    confirm.addEventListener('input', function () {
      if (password.value !== confirm.value) {
        confirm.setCustomValidity("Passwords do not match");
      } else {
        confirm.setCustomValidity("");
      }
    });
  }
});
