function updateProjects()
{
    //loops through all the "project" divs in the html and updates the links to the latest github release
    $("div.project")
	.each(function()
	      { 
		  updateLinks($(this));
	      });
}
	
//takes in a jquery div element and updates the download links inside
//note -- function will do stupid stuff if there is no url attribute in the div
function updateLinks(div) {
    var url=div.attr("url");
    var releaseUrl=url+"releases/latest/";
    //first, set all links to project URL, so we have something in case the API request fails
    div.find("a#mac").attr("href", releaseUrl);
    div.find("a#win").attr("href", releaseUrl);
    div.find("a#src").attr("href", url);
    
    //next, build the API URL for this github project
    var apiUrl=url.replace("https://github.com/", "https://api.github.com/repos/");
    apiUrl+="releases/latest";

    //the API call and callback function, only called on a successful completion
    $.getJSON(apiUrl).done(function (release) {
	    var macUrl=null;
	    var winUrl=null;
	    var sourceUrl=null;
	    for(var i=0;i<release.assets.length;i++)
		{
		    if(release.assets[i].name.match(/mac/i))
			macUrl=release.assets[i].browser_download_url;
		    if(release.assets[i].name.match(/win/i))
			winUrl=release.assets[i].browser_download_url;
		}
	    sourceUrl=release.zipball_url;

	    //if we didn't find a suitable URL in the releases, just link to the latest release page
	    if(!macUrl)
		macUrl=release.html_url;
	    if(!winUrl)
		winUrl=release.html_url;

	    //finally, update the links in the div
	    div.find("a#mac").attr("href", macUrl);
	    div.find("a#win").attr("href", winUrl);
	    div.find("a#src").attr("href", sourceUrl);
        });
}
