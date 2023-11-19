const SERVER_URL = "http://localhost:2020";

function init() {
	const form = document.forms['image-upload-form'];
	const imageEl = document.getElementsByTagName('img')[0];
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
			let options = {
				method: 'POST',
				body: imageUpload,
				headers: {
					'Content-Type' : 'application/json'
				}
			}
			makeRequest( '/upload-image', options ).then( response => {
				let { data, status } = response;
				imageEl.setAttribute('src', data['image']);
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

function makeRequest(path, options) {
	return new Promise((resolve,reject) => {
		let { method, headers, body } = options;
		options['method'] = method || 'GET';
		options['headers'] = headers || null;
		options['body'] = body ? JSON.stringify(body) : null;

		fetch(`${SERVER_URL}${path}`,options).then(response => {
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