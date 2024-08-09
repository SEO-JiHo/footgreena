document.addEventListener('DOMContentLoaded', function () {
    const blocks = document.querySelectorAll('.block');
    let userName = '';
    let userGender = '';

    blocks.forEach((block, index) => {
        const checkbox = block.querySelector('input[type="checkbox"]');
        const content = block.querySelector('.content');
        const lockedIcon = block.querySelector('.locked');
        const unlockedIcon = block.querySelector('.unlocked');
        const form = block.querySelector('form');
        const numberInput = block.querySelector('input[type="text"]');
        const numberButton = block.querySelector('button[type="button"]');
        const submitButton = block.querySelector('#submit-button');

        // 첫 번째 블록은 초기 상태에서 보이도록 설정
        if (index === 0) {
            content.style.display = 'block';
        }

        // 첫 번째 폼 (이름과 성별 입력) 처리
        if (index === 0 && form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault(); // 기본 폼 제출 동작을 막음

                userName = form.querySelector('input[name="name"]').value;
                userGender = form.querySelector('input[name="gender"]:checked').value;

                fetch('welcome.html', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(new FormData(event.target)).toString()
                }).then(() => {
                    if (checkbox) {
                        checkbox.checked = true;
                        checkbox.dispatchEvent(new Event('change'));
                    }
                    if (submitButton) {
                        submitButton.disabled = true; // 확인 버튼 비활성화
                    }
                    showNextBlock(index);
                }).catch((error) => {
                    alert(error);
                });
            });
        }

        // 마지막 폼 (카카오톡 아이디 입력) 처리
        if (index === blocks.length - 1 && form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault(); // 기본 폼 제출 동작을 막음

                const kakaoId = form.querySelector('input[name="kakaoId"]').value;

                // 첫 번째 폼의 데이터와 함께 전송
                const data = {
                    name: userName,
                    gender: userGender,
                    kakaoId: kakaoId
                };

                fetch('welcome.html', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(data).toString()
                }).then(() => {
                    alert('데이터가 성공적으로 전송되었습니다.');
                }).catch((error) => {
                    alert(error);
                });
            });
        }

        // 체크박스 상태를 감지하여 다음 블록의 콘텐츠를 표시
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

        if (numberInput && numberButton) {
            numberButton.addEventListener('click', function () {
                const value = numberInput.value;
                const expectedNumber = index === 1 ? '2' : '';

                if (value === expectedNumber) {
                    showNextBlock(index);
                    numberButton.disabled = true;
                } else {
                    alert('틀렸습니다. 다시 입력해주세요.');
                }
            });
        }

        function showNextBlock(currentIndex) {
            const nextBlock = blocks[currentIndex + 1];
            if (nextBlock) {
                const nextCheckbox = nextBlock.querySelector('input[type="checkbox"]');
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
    });

    // 팝업 관련 코드
    const openPopup = document.getElementById('open-popup');
    const popup = document.getElementById('popup');
    const closePopup = document.getElementById('close-popup');

    if (openPopup) {
        openPopup.addEventListener('click', function () {
            popup.style.display = 'block';
        });
    }

    if (closePopup) {
        closePopup.addEventListener('click', function () {
            popup.style.display = 'none';
        });
    }

    window.addEventListener('click', function (event) {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });

});
