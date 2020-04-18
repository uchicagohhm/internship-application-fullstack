addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

class ElementHandler {
  constructor(variant){
    this.variant = variant;
  }
  
  element(element) {
    //Using HTMLRewriter to change variant 1
    if (this.variant == 0) {
      //title
      if (element.tagName == 'title') {
        element.setInnerContent('Variant 1');
      //h1#title
      } else if (element.tagName == 'h1' && element.getAttribute('id') == 'title') {
        element.setInnerContent('My Version of Variant 1');
      //p#description
      } else if (element.tagName == 'p' && element.getAttribute('id') == 'description') {
        element.setInnerContent('Variant 1 - Welcome to The University of Chicago!');
      }
      //a#url
      else if (element.tagName == 'a' && element.getAttribute('id') == 'url') {
        element.setAttribute('href', 'https://www.uchicago.edu/');
        element.setInnerContent('Here is the website of UChicago.')
      }

    //Using HTMLRewriter to change variant 2
    } else if (this.variant == 1){
      //title
      if (element.tagName == 'title') {
        element.setInnerContent('Variant 2');
      //h1#title
      } else if (element.tagName == 'h1' && element.getAttribute('id') == 'title') {
        element.setInnerContent('My Version of Variant 2');
      //p#description
      } else if (element.tagName == 'p' && element.getAttribute('id') == 'description') {
        element.setInnerContent('Variant 2 - Welcome to my LinkedIn!');
      }
      //a#url
      else if (element.tagName == 'a' && element.getAttribute('id') == 'url') {
        element.setAttribute('href', 'https://www.linkedin.com/in/huimin-huang-b71958185/');
        element.setInnerContent('Here is my website.')
      }
    }
  }
}

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  try {
      response = await fetch('https://cfw-takehome.developers.workers.dev/api/variants');
      data = await response.json();
      variants = data.variants;

      var cookie = request.headers.get('cookie');
      var index;
      var url;

      //If cookie exists, use that to load the index
      if (cookie != null) {
        cookies = cookie.split(';');
        cookies.forEach(cookie => {
          c = cookie.split('=')[0].trim();
          if (c == 'index') {
            index = cookie.split('=')[1];
          }
        })
      }

      //If the index is/still is null, get a random one
      if (index == null) {
          var rand = Math.random();
          index = (rand <= .5 ? 0 : 1);   
      }

      url = variants[index];

      response = await fetch(url);
      html = await response.text();  
      response = new Response(html, {
        headers : {'content-type': 'text/html',
        'set-cookie': 'index='+index+';'}, 
      });
      return new HTMLRewriter().on('*', new ElementHandler(index)).transform(response);
  } catch (err) {
      return new Response(err.stack || err)
  }
}