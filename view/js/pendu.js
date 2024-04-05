let mot;
let mot_cache;
const motp = document.getElementById("mot");
let erreur = 0;


function potence(err) {
    switch (err) {
        case (1):
            document.getElementById('head').style.visibility = 'visible';
            break;
        case (2):
            document.getElementById('head').style.visibility = 'visible';
            document.getElementById('body').style.visibility = 'visible';
            break;
        case (3):
            document.getElementById('head').style.visibility = 'visible';
            document.getElementById('body').style.visibility = 'visible';
            document.getElementById('left-arm').style.visibility = 'visible';
            break;
        case (4):
            document.getElementById('head').style.visibility = 'visible';
            document.getElementById('body').style.visibility = 'visible';
            document.getElementById('left-arm').style.visibility = 'visible';
            document.getElementById('right-arm').style.visibility = 'visible';
            break;
        case (5):
            document.getElementById('head').style.visibility = 'visible';
            document.getElementById('body').style.visibility = 'visible';
            document.getElementById('left-arm').style.visibility = 'visible';
            document.getElementById('right-arm').style.visibility = 'visible';
            document.getElementById('left-leg').style.visibility = 'visible';
            break;
        case (6):
            document.getElementById('head').style.visibility = 'visible';
            document.getElementById('body').style.visibility = 'visible';
            document.getElementById('left-arm').style.visibility = 'visible';
            document.getElementById('right-arm').style.visibility = 'visible';
            document.getElementById('left-leg').style.visibility = 'visible';
            document.getElementById('right-leg').style.visibility = 'visible';
            break;
    }
}

window.electronAPI.OnGame();

window.electronAPI.OnGameReply((result) => {
    if (result[0].length == 0) {
        window.electronAPI.mot_selection();
    
        window.electronAPI.onMot_selectionReply((result) => {
            mot = result;
            mot_cache = mot.replace(/[^\s-]/g, '_');
            motp.innerText = mot_cache;
        });
    } else {
        mot = result[0]
        mot_cache = result[0];
        trouve = result[2];
        lettres = result[3];
        erreur = result[4];

        for (let i = 0; i < mot_cache.length; i++) {
            let lettreCourante = mot_cache[i];

            if (lettreCourante === ' ') {
                // Si la lettre est un espace, on la laisse telle quelle
                continue;
            } else if (lettreCourante === '-') {
                // Si la lettre est un tiret, on la laisse telle quelle
                continue;
            } else if (trouve.includes(lettreCourante)) {
                // Si la lettre actuelle est trouvée dans la variable trouve, on la laisse telle quelle
                continue;
            } else {
                // Sinon, on remplace la lettre par "_"
                mot_cache = mot_cache.substring(0, i) + "_" + mot_cache.substring(i + 1);
            }
        }
        motp.innerText = mot_cache;

        for (lettre in lettres) {
            const lettre_supr = document.getElementById(`${lettres[lettre]}`)
            lettre_supr.style.pointerEvents = "none"
            lettre_supr.classList.add('keyused')
            lettre_supr.classList.remove('key')
        }

        potence(erreur)
    }
})

const touches = document.querySelectorAll('#keyboard li');
const touche = document.getElementById('touche')

touches.forEach(touche => {
    touche.addEventListener("click", (event) => {
        event.target.style.pointerEvents = "none";
        event.target.classList.add('keyused')
        event.target.classList.remove('key')
        let lettre = event.target.textContent;

        if (mot.includes(lettre)) { //affiche la lettre
            // Récupérer les indices où la lettre apparaît dans le mot
            window.electronAPI.OnLettre(lettre, true);
            let indices = [];
            for (let i = 0; i < mot.length; i++) {
                if (mot[i] === lettre) {
                    indices.push(i);
                }
            }
            // Mettre à jour mot_cache avec la lettre aux bons indices
            indices.forEach(index => {
                mot_cache = mot_cache.substring(0, index) + lettre + mot_cache.substring(index + 1);
            });
            // Mettre à jour l'affichage du mot_cache
            motp.innerText = mot_cache;
        } else { //perd une vie
            if ((erreur + 1) == 6) {
                const perdu = document.getElementById('perdu');
                const mot_perdu = document.getElementById('perdu_mot');
                potence(erreur + 1);
                perdu.style.display = "block";
                mot_perdu.innerText = mot;
            }

            window.electronAPI.OnLettre(lettre, false);
            erreur += 1
            potence(erreur);

        }

        if(mot == mot_cache) {
            const gagne = document.getElementById('gagne');
            gagne.style.display = "block";

        }
    });
});

const relance = document.getElementById('relance');
const exit = document.getElementById('exit');

relance.addEventListener("click", (event) => {
    window.electronAPI.Relance();
})

exit.addEventListener("click", (event) => {
    window.electronAPI.Exit();
})

const relance_two = document.getElementById('relance_two');
const exit_two = document.getElementById('exit_two');

relance_two.addEventListener("click", (event) => {
    window.electronAPI.Relance();
})

exit_two.addEventListener("click", (event) => {
    window.electronAPI.Exit();
})

const croix = document.getElementById('croix');

croix.addEventListener("click", (event) => {
    window.electronAPI.Exit();
})