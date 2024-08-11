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
        const submitButton1 = block.querySelector('#submit-button-1');
        const submitButton2 = block.querySelector('#submit-button-2');

        // 첫 번째 블록은 초기 상태에서 보이도록 설정
        if (index === 0) {
            content.style.display = 'block';
        }

        // 첫 번째 폼 (이름과 성별 입력) 처리
        if (index === 0 && form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault(); // 기본 폼 제출 동작을 막음
        
                // 폼에서 이름과 성별을 추출하여 전역 변수에 저장
                userName = form.querySelector('input[name="name"]').value;
                userGender = form.querySelector('input[name="gender"]:checked').value;
                
                if (submitButton1) {
                    submitButton1.disabled = true;
                }

                // 다음 블록으로 이동
                showNextBlock(index);
            });
        }
        
        // 마지막 폼 (카카오톡 아이디 입력) 처리
        if (index === 6 && form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault(); // 기본 폼 제출 동작을 막음
        
                const userKakaoId = form.querySelector('input[name="kakaoId"]').value;
        
                // 새로운 FormData 객체 생성
                const formData = new FormData();
                formData.append('name', userName);
                formData.append('gender', userGender);
                formData.append('kakaoId', userKakaoId);
        
                fetch('welcome.html', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData).toString()
                }).then(response => {
                    if (response.ok) {
                        // 제출 성공 후 처리
                        if (submitButton2) {
                            submitButton2.disabled = true;
                        }
                        alert('데이터가 성공적으로 전송되었습니다.\n즐겁고 안전한 풋살되시기 바랍니다!');
                    } else {
                        // 제출 실패 시 처리
                        alert('데이터 전송에 실패했습니다. 다시 시도해 주세요.');
                    }
                }).catch(error => {
                    alert('데이터 전송 중 오류가 발생했습니다: ' + error.message);
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
