/*
  content-loader.js
  功能：從 `content/data.json` 讀取結構化內容，動態產生 HTML 並注入到頁面中。
  設計原則：保持樣式與 HTML 結構外殼不變，只由此檔案建立內部內容（避免在 index.html 中放大量文字）。
  注意：此檔需在 HTTP(s) 伺服器下使用（fetch 在 file:// 下會失敗）。
*/
(function(){
  // 小工具：用 CSS 選擇器取得單一元素
  function el(sel){ return document.querySelector(sel); }

  // 小工具：建立一個元素並可選擇性設定 class
  function create(tag, cls){ var e = document.createElement(tag); if(cls) e.className = cls; return e; }

  // 渲染頁首（姓名、標語、聯絡資訊）
  function renderHeader(data){
    var row = create('div','row align-items-center');
    var titleCol = create('div','resume-title col-12 col-md-6 col-lg-8 col-xl-9');
    var h2 = create('h2','resume-name mb-0 text-uppercase'); h2.innerText = data.name;
    titleCol.appendChild(h2);
    data.taglines.forEach(function(t){ var d = create('div','resume-tagline mb-3 mb-md-0'); d.innerText = t; titleCol.appendChild(d); });

    var contactCol = create('div','resume-contact col-12 col-md-6 col-lg-4 col-xl-3');
    var ul = create('ul','list-unstyled mb-0');
    var li1 = create('li','mb-2'); li1.innerHTML = "<i class='fab fa-github-square fa-2x me-2' data-fa-transform='down-4'></i> <a class='resume-link' href='"+ (data.contacts.github||'#') +"' target='_blank'>"+ (data.contacts.github||'') +"</a>";
    var li2 = create('li','mb-2'); li2.innerHTML = "<i class='fas fa-envelope-square fa-fw fa-lg me-2'></i> <a class='resume-link' href='mailto:"+ (data.contacts.email||'') +"'>"+ (data.contacts.email||'') +"</a>";
    var li3 = create('li','mb-0'); li3.innerHTML = "<i class='fas fa-map-marker-alt fa-fw fa-lg me-2'></i>" + (data.contacts.location||'');
    ul.appendChild(li1); ul.appendChild(li2); ul.appendChild(li3);
    contactCol.appendChild(ul);

    row.appendChild(titleCol); row.appendChild(contactCol);
    return row.outerHTML;
  }

  // 渲染個人簡介（照片、標題與段落）
  function renderIntro(data){
    var row = create('div','row align-items-center');
    var imgCol = create('div','col-12 col-md-3 col-xl-2 text-center');
    var p5 = create('div','p-5'); p5.innerHTML = "<img class='img-fluid rounded-circle' src='"+(data.image||'')+"' alt='Profile Image' />";
    imgCol.appendChild(p5);
    var textCol = create('div','col text-start');
    var h2 = create('h2'); h2.style.fontSize='24px'; h2.style.fontWeight='bold'; h2.style.marginBottom='10px'; h2.innerText = data.heading || '';
    textCol.appendChild(h2);
    var p = create('p','mb-0');
    data.paragraphs.forEach(function(par, idx){
      var span = document.createElement('span'); span.innerHTML = par;
      p.appendChild(span);
      if(idx < data.paragraphs.length-1) p.appendChild(document.createElement('br'));
    });
    textCol.appendChild(p);

    row.appendChild(imgCol); row.appendChild(textCol);
    return row.outerHTML;
  }

  // 渲染學歷區塊，list 為學歷項目陣列
  function renderEducation(list){
    var sec = create('section','project-section py-3');
    sec.innerHTML = "<h3 class='text-uppercase resume-section-heading mb-4'>Education</h3>";
    list.forEach(function(it){
      var item = create('div','item mb-3');
      item.innerHTML = "<div class='item-heading row align-items-center mb-2'>\n        <h4 class='item-title col-12 col-md-6 col-lg-8 mb-2 mb-md-0'>"+it.title+"</h4>\n        <div class='item-meta col-12 col-md-6 col-lg-4 text-muted text-start text-md-end'>"+it.meta+"</div>\n      </div>\n      <div class='item-content'><p>"+it.content+"</p></div>";
      sec.appendChild(item);
    });
    return sec.outerHTML;
  }

  // 渲染論文或研究成果清單
  function renderPapers(list){
    if(!list || !list.length) return '';
    var sec = create('section','paper-section py-3');
    sec.innerHTML = "<h3 class='text-uppercase resume-section-heading mb-4'>Paper</h3>";
    list.forEach(function(p){
      var item = create('div','item mb-3');
      var heading = create('div','item-heading row align-items-center mb-2');
      heading.innerHTML = "<h4 class='item-title col-12 col-md-6 col-lg-8 mb-2 mb-md-0'><nobr>"+p.title+"</nobr></h4>";
      var content = create('div','item-content');
      var ul = create('ul','resume-list');
      p.bullets.forEach(function(b){ var li = create('li'); li.innerHTML = b; ul.appendChild(li); });
      content.appendChild(ul);
      item.appendChild(heading); item.appendChild(content); sec.appendChild(item);
    });
    return sec.outerHTML;
  }

  // 渲染專案清單（含選擇性連結）
  function renderProjects(list){
    if(!list || !list.length) return '';
    var sec = create('section','paper-section py-3');
    sec.innerHTML = "<h3 class='text-uppercase resume-section-heading mb-4'>Projects</h3>";
    list.forEach(function(p){
      var item = create('div','item mb-3');
      var heading = create('div','item-heading row align-items-center mb-2');
      heading.innerHTML = "<h4 class='item-title col-12 col-md-6 col-lg-8 mb-2 mb-md-0'><nobr>"+p.title+"</nobr></h4>";
      var content = create('div','item-content');
      var ul = create('ul','resume-list');
      p.bullets.forEach(function(b){ var li = create('li'); li.innerHTML = b; ul.appendChild(li); });
      if(p.link){ var liLink = create('li','mb-2'); liLink.innerHTML = "<strong>Github Page:</strong> <a class='resume-link' href='"+p.link+"'>"+p.link+"</a>"; ul.appendChild(liLink); }
      content.appendChild(ul);
      item.appendChild(heading); item.appendChild(content); sec.appendChild(item);
    });
    return sec.outerHTML;
  }

  // 渲染工作經歷（標題、時間、重點）
  function renderWork(list){
    if(!list || !list.length) return '';
    var sec = create('section','work-section py-3'); sec.innerHTML = "<h3 class='text-uppercase resume-section-heading mb-4'>Work Experiences</h3>";
    list.forEach(function(w){
      var item = create('div','item mb-3');
      item.innerHTML = "<div class='item-heading row align-items-center mb-2'>\n        <h4 class='item-title col-12 col-md-6 col-lg-8 mb-2 mb-md-0'>"+w.title+"</h4>\n        <div class='item-meta col-12 col-md-6 col-lg-4 text-muted text-start text-md-end'>"+w.meta+"</div>\n      </div>\n      <div class='item-content'><ul class='resume-list'></ul></div>";
      var ul = item.querySelector('ul.resume-list');
      w.bullets.forEach(function(b){ var li = create('li'); li.innerHTML = b; ul.appendChild(li); });
      sec.appendChild(item);
    });
    return sec.outerHTML;
  }

  // 渲染認證/證照清單
  function renderCerts(list){
    if(!list || !list.length) return '';
    var sec = create('section','project-section py-3'); sec.innerHTML = "<h3 class='text-uppercase resume-section-heading mb-4'>Certifications</h3>";
    list.forEach(function(c){
      var item = create('div','item mb-3');
      item.innerHTML = "<div class='item-heading row align-items-center mb-2'>\n        <h4 class='item-title col-12 col-md-6 col-lg-8 mb-2 mb-md-0'>"+c.title+"</h4>\n        <div class='item-meta col-12 col-md-6 col-lg-4 text-muted text-start text-md-end'>"+c.meta+"</div>\n      </div>";
      sec.appendChild(item);
    });
    return sec.outerHTML;
  }

  // 渲染側欄：技能
  function renderAside(data){
    var out = '';
    out += "<section class='skills-section py-3'>\n  <h3 class='text-uppercase resume-section-heading mb-4'>Skills</h3>\n  <div class='item'>\n    <h4 class='item-title'>Technical</h4>\n    <ul class='list-unstyled resume-skills-list'>";
    out += data.technical.map(function(s){ return "<li class='mb-2'>"+s+"</li>"; }).join('');
    out += "</ul>\n  </div>\n  <div class='item'>\n    <h4 class='item-title'>Design</h4>\n    <ul class='list-unstyled resume-skills-list'>";
    out += data.design.map(function(s){ return "<li class='mb-2'>"+s+"</li>"; }).join('');
    out += "</ul>\n  </div>\n</section>\n";
    return out;
  }

  // main loader
  document.addEventListener('DOMContentLoaded', function(){
    fetch('content/data.json').then(function(res){ if(!res.ok) throw new Error(res.statusText); return res.json(); })
    .then(function(data){
      if(data.pageTitle) try{ document.title = data.pageTitle; }catch(e){}
      var h = document.querySelector('[data-content-id="header"]'); if(h) h.innerHTML = renderHeader(data.header);
      var i = document.querySelector('[data-content-id="intro"]'); if(i) i.innerHTML = renderIntro(data.intro);
      var m = document.querySelector('[data-content-id="main"]'); if(m) {
        var html = '';
        html += renderWork(data.work);
        html += renderEducation(data.education);
        html += renderPapers(data.papers);
        html += renderProjects(data.projects);
        html += renderCerts(data.certifications);
        m.innerHTML = html;
      }
      var a = document.querySelector('[data-content-id="aside"]'); if(a) a.innerHTML = renderAside({ technical: data.skills.technical, design: data.skills.design });
      var f = document.querySelector('.footer .copyright'); if(f && data.footer) f.innerText = data.footer;
    }).catch(function(err){ console.error('content load failed', err); });
  });
})();
