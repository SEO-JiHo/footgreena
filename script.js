document.addEventListener('DOMContentLoaded', function () {
    const blocks = document.querySelectorAll('.block');
    let userName = '';
    let userGender = '';

    function showNextBlock(currentIndex) {
        const nextBlock = blocks[currentIndex + 1];
        if (nextBlock) {
            const nextContent = nextBlock.querySelector('.content');
            const nextLockedIcon = nextBlock.querySelector('.locked');
            const nextUnlockedIcon = nextBlock.querySelector('.unlocked');

            if (nextLockedIcon && nextUnlockedIcon) {
                nextLockedIcon.style.display = 'none';
                nextUnlockedIcon.style.display = 'block';

                setTimeout(() => {
                    nextUnlockedIcon.style.display = 'none';
                    nextContent.style.display = 'block';
                }, 800);
            } else {
                nextContent.style.display = 'block';
            }
        }
    }

    blocks.forEach((block, index) => {
        const checkbox = block.querySelector('input[type="checkbox"]');
        const content = block.querySelector('.content');
        const lockedIcon = block.querySelector('.locked');
        const unlockedIcon = block.querySelector('.unlocked');
        const submitButton1 = block.querySelector('#submit-button-1');
        const submitButton2 = block.querySelector('#submit-button-2');


        if (index === 0) {
            content.style.display = 'block';
            submitButton1.addEventListener('click', function () {
                userName = block.querySelector('input[name="name"]').value;
                const genderInput = block.querySelector('input[name="gender"]:checked');
                
                if (userName && genderInput) {
                    userGender = genderInput.value;
                    submitButton1.disabled = true;
                    showNextBlock(index);
                } else {
                    showPopup("이름과 성별을 모두 입력해주세요.")
                }
            });
        }

        if (index === 1) {
            const numberInput = block.querySelector('#num-input');
            const numberButton = block.querySelector('#num-button');
            numberButton.addEventListener('click', function () {
                const value = numberInput.value;
                const expectedNumber = index === 1 ? '2' : '';
                if (value === expectedNumber) {
                    showNextBlock(index);
                    numberButton.disabled = true;
                } else {
                    showPopup('틀렸습니다. 다시 입력해주세요.');
                }
            });
        }


        if (index === 6) {
            submitButton2.addEventListener('click', function (event) {
                event.preventDefault();
        
                const userKakaoId = block.querySelector('input[name="kakaoId"]').value;

                if (!userKakaoId) {
                    showPopup("카카오톡 ID를 입력해주세요.");
                    return;
                }

                const loadingIndicator = document.getElementById('loading-indicator');
                loadingIndicator.style.display = 'block';

                fetch('/.netlify/functions/submit', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        name: userName,
                        gender: userGender,
                        kakaoId: userKakaoId
                    })
                }).then(response => {
                    if (response.ok) {
                        submitButton2.disabled = true;
                        showPopup('데이터가 성공적으로 전송되었습니다.\n\n즐겁고 안전한 풋살되시기 바랍니다!');
                    } else {
                        showPopup('데이터 전송에 실패했습니다. 다시 시도해 주세요.');
                    }
                }).catch(error => {
                    showPopup('데이터 전송 중 오류가 발생했습니다: ' + error.message);
                }).finally(() => {
                    loadingIndicator.style.display = 'none';
                });
            });
        }

        if (checkbox) {
            checkbox.addEventListener('change', function () {
                if (this.checked) {
                    if (lockedIcon) {
                        lockedIcon.style.display = 'none';
                    }
                    this.disabled = true;
                    showNextBlock(index);
                } else {
                    if (lockedIcon) {
                        lockedIcon.style.display = 'block';
                    }
                }
            });
        }
    });

    function showPopup(message = '', imageUrl = '') {
        const popup = document.getElementById('popup');
        const popupMessage = popup.querySelector('p');
        const popupImage = popup.querySelector('.popup-image');

        if (message) {
            popupMessage.textContent = message;
            popupMessage.style.display = 'block';
        } else {
            popupMessage.style.display = 'none';
        }

        if (imageUrl) {
            popupImage.src = imageUrl;
            popupImage.style.display = 'block';
        } else {
            popupImage.style.display = 'none';
        }

        popup.style.display = 'block';

        const closeButton = popup.querySelector('.close');
        closeButton.addEventListener('click', function () {
            popup.style.display = 'none';
        });
    }

    const openPopupButtons = document.querySelectorAll('[data-open-popup]');

    openPopupButtons.forEach(button => {
        button.addEventListener('click', function () {
            const popupMessage = button.dataset.popupMessage || '';
            const popupImage = button.dataset.popupImage || '';

            showPopup(popupMessage, popupImage);
        });
    });

    });
