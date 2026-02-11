// Dynamic Ad Insertion Script
(function() {
  'use strict';
  
  const AD_HEIGHT = 280;
  const MIN_ADS = 1;
  const HEADER_OFFSET = 64;
  
  function createAdUnit() {
    const adDiv = document.createElement('div');
    adDiv.className = 'ad-unit';
    
    const ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.setAttribute('data-ad-client', window.adsenseClient || 'ca-pub-9130496180044651');
    ins.setAttribute('data-ad-format', 'auto');
    ins.setAttribute('data-full-width-responsive', 'true');
    
    adDiv.appendChild(ins);
    return adDiv;
  }
  
  function calculateAdCount() {
    const contentWrapper = document.querySelector('.content-wrapper');
    if (!contentWrapper) return MIN_ADS;
    
    const contentHeight = contentWrapper.scrollHeight || contentWrapper.offsetHeight;
    const availableHeight = contentHeight - HEADER_OFFSET;
    const calculatedAds = Math.floor(availableHeight / AD_HEIGHT);
    
    return Math.max(MIN_ADS, calculatedAds);
  }
  
  function insertAds() {
    const leftSidebar = document.querySelector('.sidebar-ad.left');
    const rightSidebar = document.querySelector('.sidebar-ad.right');
    
    if (!leftSidebar || !rightSidebar) return;
    
    const adCount = calculateAdCount();
    console.log('Inserting ' + adCount + ' ads per sidebar');
    
    leftSidebar.innerHTML = '';
    rightSidebar.innerHTML = '';
    
    for (let i = 0; i < adCount; i++) {
      leftSidebar.appendChild(createAdUnit());
      rightSidebar.appendChild(createAdUnit());
    }
    
    setTimeout(function() {
      if (window.adsbygoogle) {
        const ads = document.querySelectorAll('.adsbygoogle');
        ads.forEach(function(ad) {
          try {
            (adsbygoogle = window.adsbygoogle || []).push({});
          } catch (e) {
            console.error('AdSense error:', e);
          }
        });
      }
    }, 100);
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertAds);
  } else {
    insertAds();
  }
  
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(insertAds, 500);
  });
  
})();

// Made with Bob
