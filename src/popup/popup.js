"use strict";
const libraryBaseURL = "https://my.saskatoonlibrary.ca/";
const librarySearchURL = "sm/search/results?terms=";
let libSearchDynamicURL = "";
const $frame = $(".frame");

chrome.tabs.executeScript(
  {
    code: "window.getSelection().toString();",
  },
  function (selection) {
    var query = getQuery(selection);
    if (!query) {
      showNoSelection();
    }
    libSearchDynamicURL = librarySearchURL + query;
    fetchHTMLForQuery(processResults);
  }
);

function getQuery(selection) {
  return encodeURIComponent(selection[0] || "");
}

function fetchHTMLForQuery(successCB) {
  jQuery.ajax({
    url: libraryBaseURL + libSearchDynamicURL,
    type: "GET",
    success: function (res) {
      successCB(res);
    },
    error: function () {
      $frame.append("Error connecting to library");
    },
  });
}

function showNoSelection() {
  $(".no-selection").show();
}

function processResults(res) {
  populateTotal(res);
  const results = $(res).find(".SearchResult");
  if (results.length > 0) {
    populateResults(results);
  } else {
    populateNotFound();
  }
}

function populateNotFound() {
  $frame.html("Not found in search");
}

function populateResults(results) {
  const count = Math.min(results.length, 20);
  $(".static-text").append(`First ${count} Results:`);
  results.toArray().forEach((element) => {
    $frame.append(element);
  });
  refreshLinks();
}

function populateTotal(res) {
  const total = $(res).find(".SearchFilters__total").first();
  console.log(libSearchDynamicURL);
  $(".result-count").html(
    $(`<a  href="${libSearchDynamicURL}"></a>`).append(total)
  );
}

function refreshLinks() {
  $("a").on("click", function (e) {
    e.preventDefault();
    var url = $(this).attr("href");
    window.open(libraryBaseURL + url, "_blank");
  });
}
