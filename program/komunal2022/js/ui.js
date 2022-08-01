var votedPoints = [];
const API_URL = "https://komunal2022api.pir-test.eu/";

document.addEventListener(
	"DOMContentLoaded",
	function(event) {
		const rawVotedPoints = Cookies.get("voted-points");
		
		if (rawVotedPoints !== undefined) {
			votedPoints = JSON.parse(rawVotedPoints);
		}
		
		const modalScript = document.createElement("script");
		modalScript.src = "./js/jquery.modal.js";
		document.head.append(modalScript);
		
		$(".topic").on(
			"click",
			function(event) {
				$(".topic").removeClass("topic-selected");
				$(".topic-content").css("display", "none");
				
				const element = $(event.currentTarget);
				
				if (element.hasClass("topic-selected")) {
					element.removeClass("topic-selected");
				} else {
					element.addClass("topic-selected");
					
					$(`#${element[0].id}-content`).css("display", "block");
				}
			}
		);
		
		$(".program-point").prepend(
			"<div class=\"program-point-button-wrapper\">"
			+ "	<svg class=\"program-point-like\" title=\"Líbí se mi\">"
			+ "		<use xlink:href=\"./svg/heart.svg#icon\"></use>"
			+ "	</svg>"
			+ "	<svg class=\"program-point-share\" title=\"Sdílet\">"
			+ "		<use xlink:href=\"./svg/share.svg#icon\"></use>"
			+ "	</svg>"
			+ "</div>"
		);
		
		$(".program-point-like").on(
			"click",
			function(event) {
				const element = event.currentTarget;
				const pointName = element.parentNode.parentNode.id;
				
				if ($(element).hasClass("program-point-like-used")) {
					$(element).removeClass("program-point-like-used");
					
					fetch(
						API_URL,
						{
							method: "DELETE",
							headers: {
								"Content-Type": "application/json"
							},
							body: JSON.stringify({
								point: pointName
							})
						}
					).then(
						function(response) {
							if (!response.ok) {
								$(element).addClass("program-point-like-used");
								
								alert("Zrušení hlasu se nezdařilo. Zkus to prosím znovu za krátkou chvíli, nebo nás kontaktuj.");
								return;
							}
							
							
							// https://stackoverflow.com/a/20827100
							// Thanks to TuralAsgar and C B!
							votedPoints = votedPoints.filter(e => e !== pointName.replace(":", "\\:"));
							Cookies.set(
								"voted-points",
								JSON.stringify(votedPoints),
								{sameSite: "strict"}
							);
						}
					);
					
					return;
				}
				
				$(element).addClass("program-point-like-used");
				
				fetch(
					API_URL,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							point: pointName
						})
					}
				).then(
					function(response) {
						if (!response.ok) {
							$(element).removeClass("program-point-like-used");
							
							alert("Hlasování se nezdařilo. Zkus to prosím znovu za krátkou chvíli, nebo nás kontaktuj.");
							return;
						}
						
						votedPoints.push(pointName.replace(":", "\\:"));
						Cookies.set(
							"voted-points",
							JSON.stringify(votedPoints),
							{sameSite: "strict"}
						);
					}
				);
			}
		);
		
		$(".program-point-share").on(
			"click",
			function(event) {
				$("#share-form").modal();
				
				const topicParent = event.currentTarget.parentNode.parentNode;
				const url = `https://pirati.cz/program/komunal2022/body/${topicParent.id}.html`;
				
				const shareTextElement = $("#share-text");
				const renderedSharedText = (
					"„"
					// Remove padding tabs and newlines, replace tabs with newlines and only allow one consecutive line break
					+ topicParent.textContent.trim().replace(/\t+/g, "\n").replace(/\n\s*\n/g, "\n")
					+ "“\n\n"
					+ "https://pirati.cz/program/komunal2022/"
				);
				
				shareTextElement.html(renderedSharedText);
				shareTextElement.select();
				
				$("#share-facebook").attr(
					"href",
					"https://facebook.com/sharer/sharer.php?u="
					+ encodeURIComponent(url)
				);
				$("#share-twitter").attr(
					"href",
					`https://twitter.com/share?text=${encodeURIComponent(renderedSharedText)}`
				);
				$("#share-diaspora")[0].onclick = function(event) {
					window.open(
						(
							"https://sharetodiaspora.github.io/?url="
							+ encodeURIComponent(url)
							+ "&title="
							+ encodeURIComponent(document.title)
						),
						"das",
						"location=no,links=no,scrollbars=no,toolbar=no,width=620,height=550"
					);
				}
			}
		);
		
		for (const point of votedPoints) {
			$(`#${point}`).
			children("div.program-point-button-wrapper").
			children("svg.program-point-like").
			addClass("program-point-like-used");
		}
		
		fetch(API_URL).
		then(
			async function(response) {
				if (!response.ok) {
					throw new Error(
						`Failed to get point votes. The response was: `,
						response
					)
				}
				
				const points = await response.json();
				
				let usedTopicNames = [];
				
				for (const point in points) {
					const splitTopic = point.split(":");
					const topicName = splitTopic[0];
					
					if (points[point] !== 0) {
						// Can't directly alter ::after
						
						$(
							"<style>"
							+ `#${point.replace(":", "\\:")} `
							+ `.program-point-button-wrapper::after{content:'${points[point]}'}`
							+ "</style>"
						).appendTo("head");
					}
					
					if (usedTopicNames.includes(topicName)) {
						continue;
					}
					
					usedTopicNames.push(topicName);
					
					// Sort basic elements
					const sortableElementParent = $(`#${topicName}-content`).children(".program-content");
					
					sortableElementParent.children(".program-point").sort(
						function (a, b) {
							return (points[a.id] || 0) < (points[b.id] || 0);
						}
					).appendTo(sortableElementParent);
				}
				
				const wrapperElementPoints = $(".program-point-wrapper").children("ul").children(".program-point");
				
				
			}
		);
	}
);
