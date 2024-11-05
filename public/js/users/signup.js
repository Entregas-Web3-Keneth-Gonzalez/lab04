// JavaScript Document
			// create local database firestore variable
			var db = firebase.apps[0].firestore();
			var auth = firebase.apps[0].auth();

			// create local from webpage inputs
			const txtNombre = document.querySelector('#txtNombre');
			const txtEmail = document.querySelector('#txtEmail');
			const txtContra = document.querySelector('#txtContra');

			// create local insert button
			const btnInsUser = document.querySelector('#btnInsUser');

			// assign button listener
			btnInsUser.addEventListener('click', function () {
				auth.createUserWithEmailAndPassword(txtEmail.value, txtContra.value)
					.then((userCredential) => {
						const user = userCredential.user;
						db.collection("datosUsuarios").add({
							"idemp": user.uid,
							"usuario": txtNombre.value,
							"email": user.email
						}).then(function (docRef) {
							alert("Usuario agregado satisfactoriamente");
							limpiar();
						}).catch(function (FirebaseError) {
							alert("Error al registrar datos del usuario." + FirebaseError);
						});
					})
					.catch((error) => {
						alert("Error al agregar el nuevo usuario: " + error.message);
					});
			});
			
			function limpiar(){
				txtNombre.value = '';
				txtEmail.value = '';
				txtContra.value = '';
				txtNombre.focus();
			}
