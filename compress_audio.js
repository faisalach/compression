let context 		= new (window.AudioContext || window.webkitAudioContext)();
let input_audio 	= document.getElementById("audio");
let button_download	= document.getElementById("download");

let audioProccesing 	= () => {
	let files 	= input_audio.files;
	if(files.length > 0){
		audio_file 	= files[0];
		let reader 	= new FileReader;
		reader.readAsDataURL(audio_file);
		reader.onload = (e2) => {
			let audio_url 	= e2.target.result;

			loadAudioFile(audio_url, function(buffer) {
			    var threshold = -500; // Threshold dalam dB
			    var ratio = 12; // Ratio kompresi

			    var compressedBuffer = compressAudio(buffer, threshold, ratio);
			    // console.log(URL.createObjectURL(compressedBuffer));

			    convertBase64(compressedBuffer,function(base64){
			    	let new_audio_url 		= "data:audio/mp3;base64,"+base64;
					// console.log(audio_url);
					// console.log(new_audio_url);

			    	let audio 	= document.createElement("audio");
					let source 	= document.createElement("source");
					source.src 	= new_audio_url;
					audio.controls 	= "controls";
					audio.appendChild(source);

					let wrapper 	= document.getElementById("wrapper");
					wrapper.innerHTML = "";
					wrapper.appendChild(audio);

				    /*let split_extension 	= input_audio.files[0].name.split(".");
					let extension 			= split_extension[split_extension.length - 1];*/
					let extension 			= "mp3";
					button_download.href	= new_audio_url;
					button_download.download 	= "audio."+extension;
			    });

			    // compressedBuffer.start(0);
			});
/*
			let audio 	= document.createElement("audio");
			let source 	= document.createElement("source");
			source.src 	= audio_url;
			audio.controls 	= "controls";
			audio.appendChild(source);

			let wrapper 	= document.getElementById("wrapper");
			wrapper.innerHTML = "";
			wrapper.appendChild(audio);*/


			// Penamaan File
			/*let split_extension 	= input_audio.files[0].name.split(".");
			let extension 			= split_extension[split_extension.length - 1];
			button_download.href	= new_audio_url;
			button_download.download 	= "audio."+extension;*/
		}
	}
}



audio.addEventListener("change",(e) => {
	audioProccesing();
})



// Fungsi untuk memuat file audio
function loadAudioFile(url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

	request.onload = function() {
		context.decodeAudioData(request.response, function(buffer) {
			callback(buffer);
        });
	};

	request.send();
}

// Fungsi untuk melakukan kompresi audio
function compressAudio(inputBuffer, threshold, ratio) {
	var attackTime = 0.1;
	var releaseTime = 0.1;

	var audioContext = new (window.AudioContext || window.webkitAudioContext)();
	var input = audioContext.createBufferSource();
	input.buffer = inputBuffer;

	var compressor = audioContext.createDynamicsCompressor();
	compressor.threshold.value = threshold; // Threshold dalam dB
	compressor.knee.value = 40;
	compressor.ratio.value = ratio;
	compressor.attack.value = attackTime;
	compressor.release.value = releaseTime;

	input.connect(compressor);
	compressor.connect(audioContext.destination);

	return input;
}

function convertBase64(audioBufferSourceNode,callback) {
	// Mendapatkan audioBuffer dari AudioBufferSourceNode
	const audioBuffer = audioBufferSourceNode.buffer;

	// Mendapatkan data audio mentah
	const rawData = audioBuffer.getChannelData(0); // Ambil data dari saluran pertama

	// Konversi data mentah menjadi data yang dapat diolah
	const convertedData = new Float32Array(rawData.length);
	for (let i = 0; i < rawData.length; i++) {
	    convertedData[i] = rawData[i];
	}

	// Konversi data menjadi Uint8Array
	const byteArray = new Uint8Array(convertedData.buffer);

	// Membuat Blob dari Uint8Array
	const blob = new Blob([byteArray], { type: 'audio/wav' }); // Ganti 'audio/wav' dengan tipe MIME yang sesuai

	// Membuat objek URL dari Blob
	const blobURL = URL.createObjectURL(blob);

	// Membuat XMLHttpRequest untuk membaca blob sebagai data URL
	const xhr = new XMLHttpRequest();
	xhr.open('GET', blobURL, true);
	xhr.responseType = 'blob';

	xhr.onload = function(event) {
	    const blob = xhr.response;
	    const reader = new FileReader();
	    
	    reader.onloadend = function() {
	        const base64String = reader.result.split(',')[1];
	        callback(base64String);
	    };
	    
	    reader.readAsDataURL(blob);
	};

	xhr.send();

}