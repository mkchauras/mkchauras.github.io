// Dynamically show/hide dropdown based on whether menu fits
(function() {
  function checkMenuFit() {
    const header = document.querySelector('.site-header');
    const title = document.querySelector('.site-title');
    const menuList = document.querySelector('.menu-list');
    const dropdown = document.querySelector('.dropdown');
    
    if (!header || !title || !menuList || !dropdown) return;
    
    // Get the available space
    const headerWidth = header.offsetWidth;
    const titleWidth = title.offsetWidth;
    const dropdownWidth = 60; // Approximate width of dropdown button
    const padding = 40; // Extra padding for safety
    
    // Calculate if menu fits
    const availableSpace = headerWidth - titleWidth - padding;
    const menuWidth = menuList.scrollWidth;
    
    if (menuWidth > availableSpace) {
      // Menu doesn't fit - show dropdown
      menuList.style.display = 'none';
      dropdown.style.display = 'inline-block';
    } else {
      // Menu fits - show regular menu
      menuList.style.display = 'flex';
      dropdown.style.display = 'none';
    }
  }
  
  // Check on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkMenuFit);
  } else {
    checkMenuFit();
  }
  
  // Check on resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(checkMenuFit, 100);
  });
})();

// Made with Bob
