//document.getElementById('test-button').addEventListener('click', function(){
//    const links = document.querySelectorAll('.titles a');
//    console.log('links:', links);
//  });
'use strict';
const titleClickHandler = function (event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');
  console.log(event);


  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  console.log('clickedElement: ', clickedElement);

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  console.log('article href:', articleSelector);

  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  console.log('Target article:', targetArticle);

  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');

};


/* Generate title link */

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles';

function generateTitleLinks() {

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  console.log('Title list is cleard.');

  let html = '';

  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector);
  for (let article of articles) {

    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML; //Ta linijka wykonuje 2 założenia algorytmu (znajduję oraz przypisuję).

    /* create HTML of the link */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

    /* insert link into titleList */
    html = html + linkHTML;
  }
  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();
