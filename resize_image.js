let input_image 	= document.getElementById("image");
let input_width 	= document.getElementById("width");
let input_height 	= document.getElementById("height");
let button_download	= document.getElementById("download");

let imageProccesing 	= () => {
	let files 	= input_image.files;
	if(files.length > 0){
		image_file 	= files[0];

		let reader 	= new FileReader;
		reader.readAsDataURL(image_file);
		reader.onload = (e2) => {
			let image_url 	= e2.target.result;

			let image 	= document.createElement("img");
			image.src 	= image_url;

			image.onload = (e3) => {
				if(input_width.value < 1){
					input_width.value 		= e3.target.width;
				}
				if(input_height.value < 1){
					input_height.value 		= e3.target.height;
				}

				let width 		= input_width.value;
				let height 		= input_height.value;

				let canvas  	= document.createElement("canvas");
				canvas.width 	= width;
				canvas.height 	= height;

				const context	= canvas.getContext("2d");
				context.drawImage(image, 0, 0, canvas.width, canvas.height);

				let new_image_url 	= context.canvas.toDataURL();
				let new_image 	= document.createElement("img");
				new_image.src 	= new_image_url;

				let wrapper 	= document.getElementById("wrapper");
				wrapper.innerHTML = "";
				wrapper.appendChild(new_image);

				// Penamaan File
				let split_extension 	= input_image.files[0].name.split(".");
				let extension 			= split_extension[split_extension.length - 1];
				button_download.href	= new_image_url;
				button_download.download 	= "Image."+extension;
			}
		}
	}
}

image.addEventListener("change",(e) => {
	input_width.value 	= 0;
	input_height.value 	= 0;
	imageProccesing();
})

input_width.addEventListener("change",(e) => {
	imageProccesing();
})

input_height.addEventListener("change",(e) => {
	imageProccesing();
})
