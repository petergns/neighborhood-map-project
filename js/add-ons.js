// Reload Map Function
function reloadMap() {
    location.reload();
}

// Open Help [Optional Extra]
// Sourced From: https://sabe.io/tutorials/how-to-create-modal-popup-box
var modal = document.querySelector(".modal");
  var trigger = document.querySelector(".trigger");
  var closeButton = document.querySelector(".close-button");

  function toggleModal() {
      modal.classList.toggle("show-modal");
  }

  function windowOnClick(event) {
      if (event.target === modal) {
          toggleModal();
      }
  }

  trigger.addEventListener("click", toggleModal);
  closeButton.addEventListener("click", toggleModal);
  window.addEventListener("click", windowOnClick);
