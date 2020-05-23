//document.getElementById('test-button').addEventListener('click', function(){
//    const links = document.querySelectorAll('.titles a');
//    console.log('links:', links);
//  });

/* Templates */
const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
};


/* Variables as object (for options) */
const opt = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post .post-author',
  cloudClassCount: '4',
  cloudClassPrefix: 'tag-size-'
};


//const optArticleSelector = '.post',
//optTitleSelector = '.post-title',
//optTitleListSelector = '.titles',
//optArticleTagsSelector = '.post-tags .list',
//optArticleAuthorSelector = '.post .post-author',
//optCloudClassCount = '4',
//optCloudClassPrefix = 'tag-size-';

'use strict';
const titleClickHandler = function (event) {
  event.preventDefault();
  const clickedElement = this;
  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }
  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');

};


// Generate title link


function generateTitleLinks(customSelector = '') {

  /* remove contents of titleList */
  const titleList = document.querySelector(opt.titleListSelector);
  titleList.innerHTML = '';
  let html = '';
  /* for each article */
  const articles = document.querySelectorAll(opt.articleSelector + customSelector);
  for (let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(opt.titleSelector).innerHTML; //Ta linijka wykonuje 2 założenia algorytmu (znajduję oraz przypisuję).
    /* create HTML of the link */
    //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    /* Handlebars */
    const linkHtmlData = { id: articleId, title: articleTitle };
    const linkHTML = templates.articleLink(linkHtmlData);
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

// Cloud Tags

function calculateTagsParams(tags) {
  /* make constant for params with 2 keys "min"/"max" */
  const params = {
    max: '0',
    min: '999999'
  };
  /* START loop: for each tag in tags */
  for (let tag in tags) {
    //console.log(tag + ' is used ' + tags[tag] + ' times ');
    if (tags[tag] > params.max) {
      params.max = tags[tag];
    } if (tags[tag] < params.min) {
      params.min = tags[tag];
    }
    /* END loop: for each tag in tags */
  }
  /* return results */
  return params;
}

// Cloud Authors

function calculateAuthorsParams(authors) {
  /* make constant for params with 2 keys "min"/"max" */
  const params = {
    max: '0',
    min: '999999'
  };
  /* START loop: for each author in authors */
  for (let author in authors) {
    if (authors[author] > params.max) {
      params.max = authors[author];
    } if (authors[author] < params.min) {
      params.min = authors[author];
    }
    /* END loop: for each author in authors */
  }
  /* return results */
  return params;
}

// Calculate Tag class

function calculateTagClass(count, params) {
  const classNumber = Math.floor(((count - params.min) / (params.max - params.min)) * opt.cloudClassCount + 1);
  const classValue = opt.cloudClassPrefix + classNumber;
  return classValue;
}

// Calculate Author class

function calculateAuthorClass(count, params) {
  const classNumber = Math.floor(((count - params.min) / (params.max - params.min)) * opt.cloudClassCount + 1);
  const classValue = opt.cloudClassPrefix + classNumber;
  return classValue;
}

//Generate Tags

function generateTags() {
  /* [new] create a new object for "allTags" */
  let allTags = {};
  /* find all articles */
  /* START LOOP: for every article: */
  const articles = document.querySelectorAll(opt.articleSelector);
  for (let article of articles) {
    /* find tags wrapper */
    const tagWrapper = article.querySelector(opt.articleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      const tagHTMLData = { id: tag, title: tag };
      const tagHTML = templates.tagLink(tagHTMLData);
      html += tagHTML;
      /* generate HTML of the link */
      /* add generated code to html variable */
      /* [new] chek if this link is NOT already in allTags */
      if (!allTags[tag]) {
        /* [new] add tag to allTags object */
        allTags[tag] = 1;
        /* if tag is already in object  increment counter */
      } else {
        allTags[tag]++;
      }
      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagWrapper.innerHTML = html;
    /* END LOOP: for every article: */
  }
  /* [new] find list of tags in right column */
  const tagList = document.querySelector('.tags');
  const tagsParams = calculateTagsParams(allTags);
  /* [new] create variable for all links for HTML code */
  //let allTagsHTML = '';
  /* Handlebars */
  const allTagsData = { tags: [] };
  /* [new] START loop: for each tag in allTags */
  for (let tag in allTags) {
    /* Templates */
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
    /* END loop: for each tag in allTags */
  }
  /* [new] add HTML from allTagsHTML to tagList */
  /* Templates */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}

generateTags();

// Tag Handler

function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  //console.log(event);
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  //console.log('Clicked href: ', href);
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  //console.log('Clicked Tag: ', tag);
  /* find all tag links with class active */
  const activeTags = document.querySelectorAll('.a.active[href^="#tag-"]');
  //console.log('Active tag links: ', activeTags);
  /* START LOOP: for each active tag link */
  for (let activeTag of activeTags) {
    /* remove class active */
    activeTag.classList.remove('active');
    /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const equalTags = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for (let equalTag of equalTags) {
    /* add class active */
    equalTag.classList.add('active');
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* find all links to tags */
  const tagLinks = document.querySelectorAll('.post-tags .list a, .list.tags a');
  /* START LOOP: for each link */
  for (let tagLink of tagLinks) {
    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
  }
}

addClickListenersToTags();

// Author Handler

function generateAuthors() {
  /* find all authors */
  let allAuthors = {};
  /* START loop: for every article */
  const articles = document.querySelectorAll(opt.articleSelector);
  for (let article of articles) {
    /* find authors wrapper */
    const authorWrapper = article.querySelector(opt.articleAuthorSelector);
    /* make html string for author */
    let html = '';
    /* get authors from atrribute */
    const articleAuthor = article.getAttribute('data-author');
    /* generate HTML of choosen link */
    //const linkHTML = '<p><a href="#author-' + articleAuthor + '"> by ' + articleAuthor + '</a></p>';
    /* Handlebars */
    const linkHtmlData = { id: articleAuthor, title: articleAuthor };
    const linkHTML = templates.authorLink(linkHtmlData);
    /* add generated code to html variable */
    html = html + linkHTML;
    /* insert HTML of all the links into author wrapper */
    authorWrapper.insertAdjacentHTML('beforeend', html);
    /* push authors in obj */
    if (!allAuthors[articleAuthor]) {
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
    /* END loop: for every authors */
  }
  /* find list of authors in right column */
  const authorList = document.querySelector('.authors');
  const authorsParams = calculateAuthorsParams(allAuthors);
  //let allAuthorsHTML = '';
  const allAuthorsData = { authors: [] };
  for (let articleAuthor in allAuthors) {
    //const authorLinkHtml = calculateAuthorClass(allAuthors[author], authorsParams);
    //allAuthorsHTML += '<li><a class=' + authorLinkHtml + ' href="#author-' + author + '">' + author + '</a></li>';
    allAuthorsData.authors.push({
      articleAuthor: articleAuthor,
      count: allAuthors[articleAuthor],
      className: calculateAuthorClass(allAuthors[articleAuthor], authorsParams)
    });
  }
  authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
}

generateAuthors();

// Author Handler

function authorClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  console.log(event);
  /* make a new constant "href" and read atribute  "href" from clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "author" and extract author from the "href" const */
  const author = href.replace('#author-', '');
  /* find all author link with class "active" */
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  /* START loop: for each active author link */
  for (let activeAuthorLink of activeAuthorLinks) {
    /* remove class "active" */
    activeAuthorLink.classList.remove('active');
    /* END loop: for each athor */
  }
  /* find all author links with "href" atribute equal to the "href" const */
  const equalAuthorHrefs = document.querySelectorAll('a[href="' + href + '"]');
  /* START loop: for each found links */
  for (let equalAuthorHref of equalAuthorHrefs) {
    /* add class "active" */
    equalAuthorHref.classList.add('active');
    /* END loop: for each found links */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {
  /* find all links to authors */
  const authorLinks = document.querySelectorAll(opt.articleAuthorSelector + '.post-author a, .list.authors a');
  /* START loop: for each link */
  for (let authorLink of authorLinks) {
    /* add authorClickHandler as event listener for that link */
    authorLink.addEventListener('click', authorClickHandler);
    /* END loop: for each link */
  }
}

addClickListenersToAuthors();
