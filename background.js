const SEARCH_URL = `https://api.github.com/search/repositories`;

browser.omnibox.setDefaultSuggestion({
  description: `Search github for Julia packages
      (e.g. "flux" )`
});

browser.omnibox.onInputEntered.addListener((text, disposition) => {
  let headers = new Headers({ "Accept": "application/json" });
  let init = { method: 'GET', headers };
  let url = `${SEARCH_URL}?q=${text}+language:julia`;
  let request = new Request(url, init);

  fetch(request)
    .then((response) => {
      response.json().then(json => {
        console.log(json.items)
        let url = json.items[0].html_url
        switch (disposition) {
          case "currentTab":
            browser.tabs.update({ url });
            break;
          case "newForegroundTab":
            browser.tabs.create({ url });
            break;
          case "newBackgroundTab":
            browser.tabs.create({ url, active: false });
            break;
        }
      })
    })
});
