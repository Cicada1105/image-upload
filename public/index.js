const SERVER_URL = "http://localhost:2020";

function init() {
	let form = document.forms['image-upload-form'];
	form.addEventListener('submit',uploadImage);

	function uploadImage(e) {
		e.preventDefault();

		let formEls = form.elements;
		let file = formEls["imageFile"].files[0];
		let fileName = removeFileExtension(file.name);
		// Convert file to array buffer to be sent and stored in request
		let myReader = new FileReader();
		myReader.readAsBinaryString(file);
		myReader.onloadend = function() {
			let imageUpload = {
				fileName,
				fileType: file.type.split("/")[1],
				fileData: btoa(myReader.result)
			}

			makeRequest( '/upload-image', 'POST', imageUpload ).then( data => {
				console.log(data);
			}).catch( data => {
				console.log(data);
			});;
		}
	}
}

function removeFileExtension( file ) {
	// Split file name by '.' to locate extension
	let fileNameComponents = file.split('.');
	// Remove only the extension (Account for names possibly with additionl periods)
	fileNameComponents.splice(-1);
	// Join remaining name of file by understcore
	let fileName = fileNameComponents.join("_");

	return fileName;
}

function makeRequest(path, method, body) {
	return new Promise((resolve,reject) => {
		fetch(`${SERVER_URL}${path}`,{
			method: method,
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(body)
		}).then(response => {
			response.json().then(data => 
				resolve({
					data,
					status: response.status
				})
			)
		}).catch(err => {
			reject({
				msg: err,
				status: err.status
			})
		})
	});
}