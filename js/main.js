
let tgtower1 = document.querySelector('.tower-1'),
tgtower2 = document.querySelector('.tower-2'),
tgtower3 = document.querySelector('.tower-3'),
audio = document.querySelector('#audio'),
mute = document.querySelector('.mute'),
thanks = document.querySelector('.thanks'),
losestart = document.querySelector('.lose-start'),
holding = null,
tgblockCount = 7,
moves = 0;

const towerGame = {
    init: (e) => {
        tgtower1.innerHTML = "";
        tgtower2.innerHTML = "";
        tgtower3.innerHTML = "";
        holding = null;
        towerGame.countMove(0);
        document.querySelector('#form').classList.add('hide');
        tgtower1.classList.add('first-init');
        setTimeout(() => {
            tgtower1.classList.remove('first-init');
        }, 1600);
        for (let i = 1; i <= tgblockCount; i++) {
            const li = document.createElement('li');
            li.setAttribute('class', `disk disk-${i}`);
            li.setAttribute('data-value', i);
            tgtower1.prepend(li);
        }
        if(e !== 'reset') {
            towerGame.controls();
        }
    },
    controls: () => {
        let tower = document.querySelectorAll('.tower');
        Array.from(tower).forEach(function(e) {
            e.addEventListener('click', () => towerGame.blockMove(e));
        });
    },
    countMove: (e) => {
        e == 0 ? moves= 0 : moves++;
        document.querySelector('.moves').innerHTML = moves;
        document.querySelector('#inputMove').value = moves;
        document.querySelector('#divMove').innerHTML = moves;

        let stars1 = document.querySelector('.star-1'),
        stars2 = document.querySelector('.star-2'),
        stars3 = document.querySelector('.star-3');
        if(moves > 150) {
            losestart.innerHTML = 'You lose the 1 Star';
            stars3.classList.add('none');
        }
        if(moves > 200) {
            losestart.innerHTML = 'You lose the 2 Stars';
            stars2.classList.add('none');
        }
        if(moves > 250) {
            losestart.innerHTML = 'You lose the All Stars';
            stars1.classList.add('none');
        }
        if(e == 0 ) {
            stars1.classList.remove('none');
            stars2.classList.remove('none');
            stars3.classList.remove('none');
            losestart.innerHTML = '';
        }
    },
    mute: (e) => {
        if(audio.muted) {
            audio.muted = false
            e.currentTarget.classList.remove('yes');
        } else {
            audio.muted = true
            e.currentTarget.classList.add('yes');
        }
    },
    gameAudio: (e) => {
        if(!audio.muted) {
            audio.currentTime = 0;
            audio.pause();
            if(e == true) {
                audio.currentTime = 0.12;
                audio.play();
                setTimeout(() => {
                    audio.pause();
                    audio.currentTime = 0;
                }, 1000);
            } else if(e == false) {
                audio.currentTime = 1.2;
                audio.play();
            } else {
                audio.currentTime = 0;
                audio.pause();
            }
        }
    },
    blockMove: (e) => {
        let topBLock = e.lastElementChild,
        topBLockValue = topBLock && topBLock.getAttribute('data-value'),
        holdingBlock = document.querySelector('.hold');
        towerGame.gameAudio();
        e.classList.remove('next-move');
        if(holdingBlock !== null) {
            if(topBLockValue === holding) {
                topBLock.classList.remove('hold');
            } else if(topBLockValue == null ||topBLockValue > holding) {
                holdingBlock.remove();
                e.setAttribute('data-count', e.childElementCount+1);
                const createli = document.createElement('li');
                createli.setAttribute('class', `disk disk-${holding}`);
                createli.setAttribute('data-value', holding);
                e.appendChild(createli);
                e.classList.add('next-move');
                towerGame.countMove();
                if((e.classList.contains('tower-2') || e.classList.contains('tower-3')) && e.childElementCount == tgblockCount) {
                   towerGame.winner();
                } else {
                    towerGame.gameAudio(true)
                }
            } else {
                towerGame.gameAudio(false)
                holdingBlock.classList.add('shake');
                setTimeout(() => {
                    holdingBlock.classList.remove('shake');
                }, 300);
            }
        } else if(topBLock !== null) {
            e.setAttribute('data-count', e.childElementCount);
            topBLock.classList.add('hold');
            holding = topBLockValue;
        }
    },
    reset: () => {
        towerGame.init('reset');
        document.querySelector('.tower-wrap').classList.remove('disabled');
        document.querySelector('.you-win').classList.remove('show');
    },
    winner: () => {
        if(moves < 130) {
            losestart.innerHTML = 'Congratulations! You Won!';
        }
        document.querySelector('.tower-wrap').classList.add('disabled');
        document.querySelector('.you-win').classList.add('show');
        document.querySelector('#form').classList.remove('hide');
    },
    form: (e) => {
        e.preventDefault()
       const formData = new FormData();
       formData.append(
           'name',
           document.querySelector('input[name="name"]').value
       )
       formData.append(
           'location',
           document.querySelector('input[name="location"]').value
       )
       formData.append(
           'moves',
           document.querySelector('input[name="moves"]').value
       )

       fetch("https://getform.io/f/52345be0-a52d-4d05-8bf0-ce5b98ee31c0",
       {
           method: "POST",
           body: formData,
       }).then(response => {
           if(response.status == 200) {
                thanks.classList.remove('hide');
                setTimeout(() => {
                    thanks.classList.add('hide');
                    towerGame.reset();
                }, 2000);
           }
       }).catch(error => console.log(error))
    }
}

window.addEventListener('DOMContentLoaded', function(e) {
    towerGame.init(tgtower1);
    document.querySelector('.mute').addEventListener('click', (e) => towerGame.mute(e));
    document.querySelector('.reset').addEventListener('click', () => towerGame.reset());
    document.querySelector('#form').addEventListener('submit', (e) => towerGame.form(e));
});
