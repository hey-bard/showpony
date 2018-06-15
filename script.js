document.getElementById("show-comic").addEventListener("click",function(){
	chooseStory('comic');
});

document.getElementById("show-video").addEventListener("click",function(){
	chooseStory('video');
});

document.getElementById("show-text").addEventListener("click",function(){
	chooseStory('text');
});

document.getElementById("show-kn").addEventListener("click",function(){
	chooseStory('kn');
});

document.getElementById("show-audio").addEventListener("click",function(){
	chooseStory('audio');
});

console.log("HEEEEEEEEEEEEY");

function chooseStory(id){
	var stories=document.getElementsByClassName("story");
	
	if(document.querySelector(".show-selected")) document.querySelector(".show-selected").classList.remove("show-selected");
	document.getElementById("show-"+id).classList.add("show-selected");
	
	for(var i=0;i<stories.length;i++){
		if(stories.item(i).id==id){
			if(stories.item(i).classList.contains("hidden")){
				stories.item(i).classList.remove("hidden");
				
				if(stories.item(i).dataset.wasPaused){
					if(showponies[stories.item(i).id].currentFile>-1) showponies[stories.item(i).id].menu(null,stories.item(i).dataset.wasPaused=="true" ? "pause" : "play");
				}
			}
			
			//Update URL and history
			history.replaceState(null,null,location.href.replace(/#[^$?]+/,'')+"#"+id);
		}else{
			if(!stories.item(i).classList.contains("hidden")){
				stories.item(i).dataset.wasPaused=stories.item(i).classList.contains("showpony-paused");
				stories.item(i).classList.add("hidden");
				
				if(showponies[stories.item(i).id].currentFile>-1) showponies[stories.item(i).id].menu(null,"pause");
			}
		}
	}
	
	document.getElementById("current-medium").innerHTML={
		"comic":"comic"
		,"text":"serial novel"
		,"kn":"kinetic novel"
		,"audio":"dramatized audiobook"
		,"video":"video series"
	}[id];
	
	var container=document.createElement("span");
	
	var objects=Object.keys(showponyInputs[id]);
	
	for(var i=0;i<objects.length;i++){
		var line=document.createElement("span");
		
		line.innerHTML+='\t<span class="obj-name">'+objects[i]+'</span>: ';
		var value=showponyInputs[id][objects[i]];
		
		var print='';
		var valuePrint=document.createElement("span");
		
		switch(typeof value){
			case 'number':
				print+=value;
				break;
			case 'boolean':
				print+=value ? 'true' : 'false';
				break;
			case 'string':
				print+='"'+value+'"';
				break;
			case 'object':
				if(value && value.id) print+='document.getElementById("'+value.id+'")';
				else print+=JSON.stringify(value,null,'\t');
				break;
			default:
				//
				break;
		}
		
		valuePrint.innerText=print;

		line.appendChild(valuePrint);
		container.appendChild(line);
		
		if(i<objects.length-1){
			container.innerHTML+=',<br>';
		}
	}
	document.getElementById("code").innerHTML=container.innerHTML;
	document.getElementById("propertyExplanation").innerHTML='Hover over a property to get info on it!';
	
	var properties=document.querySelectorAll(".obj-name");
	for(var i=0;i<properties.length;i++){
		properties[i].addEventListener("mouseover",function(){
			if(document.querySelector('.obj-name-study')) document.querySelector('.obj-name-study').classList.remove('obj-name-study');
			
			this.classList.add('obj-name-study');
			
			document.getElementById("propertyExplanation").innerHTML="<strong>"+this.innerHTML+"</strong>: "+(propertyInfo[this.innerHTML]);
		});
	}
	
}

var propertyInfo={
	window:"The element to put Showpony into. Ideally a div. If unset or null, will create an element."
	,start:"What file to start at if one isn't set in the querystring or bookmark. Can be a number or the value 'last'. Defaults to 'last'"
	,get:"If set to a folder, will automatically get all files in that folder (unless they're not ready to be released yet, more info in the Wiki). If an array of paths to files, will just get those files. Defaults to 'files/'"
	,language:"Currently unused. Defaults to ''"
	,scrubLoad:"If false, don't load files while scrubbing. If true, load files while scrubbing. Defaults to false"
	,info:"The text displayed at the top of Showpony. Defaults to '[Current File] | [Files Left]"
	,credits:"The text displayed at the bottom-right of Showpony. Can write CompanyName.logo to automatically load in a logo from simpleicons.org. If null, no credits are shown. Defaults to null."
	,data:"An object that can be used to save user data. Defaults to {}"
	,defaultDuration:"The assumed length for files with a duration in their filename. Defaults to 10"
	,title:"Info to show in the website title that shows up in the tab. If null, won't impact the website title. Defaults to null"
	,dateFormat:"How to format dates. Defaults to {year:'numeric',month:'numeric',day:'numeric'}"
	,admin:"Whether or not to allow use of the admin panel, set up in the PHP file. Defaults to false"
	,query:"The text in the search bar that tracks where you're at in the story. If false, no query is used. Defaults to 'part'"
	,shortcuts:"Allows keyboard shortcuts for Showpony. 'always' means always use shortcut keys. 'focus' means only when the element is focused on. 'fullscreen' means only when Showpony is fullscreened. false means don't allow shortcut keys. Defaults to 'focus'"
	,HeyBardID:"The id to pass to Hey Bard for automatically saving bookmarks to users with accounts. If null, don't use Hey Bard. Defaults to location.hostname.substring(0,20)"
	,bookmark:"'file' means queries and bookmarks are saved based on the current file. 'time' means it's based on the total time we are into the story. Defaults to 'file'"
	,preloadNext:"Preload upcoming files. Can set to any positive integer you like! Defaults to 1"
};

var type=/#[^$?]+/.exec(location.href);

chooseStory(type ? type[0].replace('#','') : "comic");