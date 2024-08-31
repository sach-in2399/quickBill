function toggleSidebar() {
  var sidebar = document.getElementById('sidebar');
  var container = document.getElementById('container');
  if (sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      container.classList.remove('sidebar-open');
  } else {
      sidebar.classList.add('open');
      container.classList.add('sidebar-open');
  }
}

function closeSidebar() {
  var sidebar = document.getElementById('sidebar');
  var container = document.getElementById('container');
  if (sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      container.classList.remove('sidebar-open');
  }
}

document.addEventListener('click', function(event) {
  var sidebar = document.getElementById('sidebar');
  var menu = document.querySelector('.navbar .menu');
  if (!sidebar.contains(event.target) && !menu.contains(event.target) && sidebar.classList.contains('open')) {
      closeSidebar();
  }
});