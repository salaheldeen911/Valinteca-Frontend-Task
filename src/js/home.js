const SUB_HEADER = document.getElementById("sub-header");
const USER = JSON.parse(localStorage.getItem("user"));

if (USER) {
  SUB_HEADER.innerText = USER.email;
}
