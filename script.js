//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

$("#alert_resp_box").hide()

Array.from(document.getElementsByClassName("next")).forEach(elem => elem.addEventListener("click", function () {
	if (animating) return false;
	animating = true;

	current_fs = $(this).parent();

	let id = this.parentNode.id

	console.log(id, "is the id of the current parent node")

	let validation_elements = Array.from(document.getElementsByClassName(id))

	let to_execute = true

	for (var elem of validation_elements) {
		console.log(elem.value, "is the value of the element")
		if (elem.value == "" || elem.value=="None") {
			// if(document.getElementById("exampleFormControlSelect1").value == "o")
			swal("Oops", `Please fill all Inputs`, "error");
			console.log(this.enabled, "is the state of the button")
			to_execute = false
			animating = false
		}
		
		if(elem.name == "email"){
			let response = validateEmail(elem.value)
			if(response == false){
				swal("Oops", `Please Enter a valid email`, "error");
			console.log(this.enabled, "is the state of the button")
			to_execute = false
			animating = false
			}
		}
	}

	if(document.getElementById("exampleFormControlSelect1").value == "None" ||document.getElementById("exampleFormControlSelect1").value=="" ){
		swal("Enter domain input")
		to_execute = false
		animating = false
	}

	if (to_execute) {

		console.log("im here")
		next_fs = $(this).parent().next();

		//activate next step on progressbar using the index of next_fs
		$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

		//show the next fieldset
		next_fs.show();
		//hide the current fieldset with style
		current_fs.animate({
			opacity: 0
		}, {
			step: function (now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				//1. scale current_fs down to 80%
				scale = 1 - (1 - now) * 0.2;
				//2. bring next_fs from the right(50%)
				left = (now * 50) + "%";
				//3. increase opacity of next_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({
					'transform': 'scale(' + scale + ')',
					'position': 'absolute'
				});
				next_fs.css({
					'left': left,
					'opacity': opacity
				});
			},
			duration: 800,
			complete: function () {
				current_fs.hide();
				animating = false;
			},
			//this comes from the custom easing plugin
			easing: 'easeInOutBack'
		});
	}
}))

$(".previous").click(function () {
	if (animating) return false;
	animating = true;

	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();

	//de-activate current step on progressbar
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

	//show the previous fieldset
	previous_fs.show();
	//hide the current fieldset with style
	current_fs.animate({
		opacity: 0
	}, {
		step: function (now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale previous_fs from 80% to 100%
			scale = 0.8 + (1 - now) * 0.2;
			//2. take current_fs to the right(50%) - from 0%
			left = ((1 - now) * 50) + "%";
			//3. increase opacity of previous_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({
				'left': left
			});
			previous_fs.css({
				'transform': 'scale(' + scale + ')',
				'opacity': opacity
			});
		},
		duration: 800,
		complete: function () {
			current_fs.hide();
			animating = false;
		},
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});

$("#msform").submit(function (e) {
	e.preventDefault()

	// document.getElementById("submit_btn").disabled = true
	// document.getElementById("submit_btn").classList.add("disabled")
	$("#submit_btn").hide()
	$("#alert_resp_box").show()
	let form_data = new FormData(document.querySelector("#msform"))

	fetch("https://script.google.com/macros/s/AKfycbyL--4R8Dv3650Ljxqy-fgtnJenoc6fT_UJWzsRM1pF4_ykYumgZa8IWi5Jotg_pb6-pw/exec",{
		method:"POST",
		body:form_data
	}).then(response=>{
		return response.json()
	}).then(json_response=>{
		if(json_response.result == "success"){
			swal("Good Job !","We will reach you shortly.","success").then(val=>{
				window.location.reload()
			})
		}
		else{
			swal("Oops","Please try again after some time.","error")
		}
	})


})
	


function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
