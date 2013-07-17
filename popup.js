var naverToonUrl = "http://comic.naver.com/webtoon/detail.nhn";
var webToonId;
var webToonUrl;
var currentTitle;
var toon = {};


// alert 함수는 제대로 작동하지 않음. 왜 그런지는 모르겠다.

$(document).ready(function() {
	
	getToonAlert = $("#getToonAlert");
	dummy = $("dummy");
	dummy.text("default");
	
	// jQuery object 가 document.ready 안에 있을 때는 작동함.
	$("#getToonBtn").on("click", getToonUrlId);
	
	// content-script 로 선언하지 않으니 전역변수를 사용할 수 있음.
	// content-script는 다른 웹페이지에 코드를 심을 때 쓰임.
	// getToonUrlId();
});

function getToonUrlId() {
	// 현재 활성화 되어 있는 탭 URL 을 가져옴.
	chrome.windows.getCurrent(getWindow);
}

function getWindow(win) {
	chrome.tabs.query({ 'windowId': win.id, 'active': true}, getTabUrl);
}

function getTabUrl(tabs) {
	if(tabs.length != 'undefined' && tabs.length == 1)   
	var currentURL = tabs[0].url;
	extractToonData(currentURL);
}

// handler 로 등록되는 함수는 return 값을 가지면 안됨.
// 리스트 형태일 때도 만들어야 함.
function extractToonData(toonUrl) {
	var resultId
	if (toonUrl.search(naverToonUrl)==0) {
		resultId = toonUrl.split("?")[1].split("&")[0].split("=")[1];
		if (resultId!=null) {
			webToonId = resultId;
			webToonUrl = toonUrl;
		}	
	} else if (toonUrl.search(naverToonUrl)!=0) {
		getToonAlert.css("color","rgb(201,0,1)")
		getToonAlert.text("추가하고 싶은 네이버 웹툰 페이지에 가서 눌러주세요.");
	}
	getToonData(resultId, toonUrl);
}

function getToonData(toonId, toonUrl) {
	if (toonId!=null) {
		// $.get("http://comic.naver.com/webtoon/detail.nhn?", { titleId : toonId, no : 0 }, getData, String)
		$.get(naverToonUrl+"?titleId="+toonId+"&no=0",getData);
		function getData(data, status, jqXHR) {
			if (status=="success") {
				var toonPage = $.parseHTML(data);
				var toonTitle = $(".comicinfo .dsc h2",toonPage).text();
				var toonImgSrc = $(".comicinfo .thmb img",toonPage).attr("src");
				var toonImg = "<img src=\"" + toonImgSrc + "\">";
				var currentToonTitle = $(".tit_area .view h3",toonPage).text();
				// var kk = $(".tit_area .view h3",toonPage).text();
				// var titleTitle = toonTitle + "";
				// var nowToonTitle = currentToonTitle + "";
				getToonAlert.html(toonTitle+"<br>"+toonImg+"<br>"+currentToonTitle);
				createBookmark(toonId,toonUrl,toonTitle +"/ "+currentToonTitle);
			} else {
				getToonAlert.css("color","rgb(201,0,1)")
				getToonAlert.text("네트워크 장애 입니다. 인터넷에 연결되어 있는 지 확인하시고, 다시 시도하세요!");
			}
		}	
			
	} 
	// getToonAlert.text(toon);
	// else (toonId==null) {
		// getToonAlert.css("color","rgb(201,0,1)")
		// getToonAlert.text("네트워크 장애 입니다. 인터넷에 연결되어 있는 지 확인하시고, 다시 시도하세요!");
	// }
	// return parsedToonPage;
	// getToonAlert.text(parsedToonPage[2]);
}

function createBookmarkFolder() {
	// var toonFolder = 'toonFolder';
	chrome.bookmarks.search("FancyNotifier", getBookmarkFolder);
	function getBookmarkFolder(folder) {
		if (folder.id==null) {
			chrome.bookmarks.create({'parentId': bookmarkBar.id ,'title' : 'FancyNotifier'}); 
		}
	}
}

function createBookmark(toonid, toonurl, title) {
	// id *= 1;
	// url += "";
	// title += "";
	chrome.bookmarks.search("FancyNotifier", getBookmarkFolder);
	function getBookmarkFolder(folder) {
		// if (folder.id==null) {
		// if (!folder[0].id) {
			// chrome.bookmarks.create({'title' : 'FancyNotifier'}); 
		// }
		if (toonid!=null) {
			// index 가 들어가면 북마크 생성이 안됨. 
			chrome.bookmarks.create({'parentId': folder[0].id , 'title' : title,'url' : toonurl});
		} else if (toonid==null) {
			getToonAlert.css("color","rgb(201,0,1)")
			getToonAlert.text(" 웹툰을 추가하는 데 문제가 있습니다. 네이버 웹툰 페이지에서 <웹툰 Get!> 버튼을 다시 눌러주세요.");
		}	
	}	 	
}





