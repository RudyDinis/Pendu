const button = document.getElementById('play')

button.addEventListener("click", (event) => {
    const cb1 = document.getElementById('option1');
    const cb2 = document.getElementById('option2');
    const cb3 = document.getElementById('option3');

    if((cb1.checked == true) & (cb2.checked == true) || (cb1.checked == true) & (cb3.checked == true) || (cb2.checked == true) & (cb3.checked == true)) {
        alert("Merci de choisir une seule difficulté");
    } else if((cb1.checked == false) & (cb2.checked == false) & (cb3.checked == false)){
        alert("Merci de choisir une difficulté");
    } else if(cb1.checked == true){
        window.electronAPI.difficulty("facile");
        console.log("1")
    } else if(cb2.checked == true){
        window.electronAPI.difficulty("moyen");
        console.log("2")
    } else if(cb3.checked == true){
        window.electronAPI.difficulty("difficile");
        console.log("3")
    }
})

const croix = document.getElementById('croix');

croix.addEventListener("click", (event) => {
    window.electronAPI.Exit();
})