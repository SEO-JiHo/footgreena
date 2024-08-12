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


        // 첫 번째 폼 (이름과 성별 입력) 처리
        if (index === 0) {
            content.style.display = 'block';
            submitButton1.addEventListener('click', function () {
                // 이름과 성별을 전역 변수에 저장
                userName = block.querySelector('input[name="name"]').value;
                const genderInput = block.querySelector('input[name="gender"]:checked');
                
                if (userName && genderInput) {
                    userGender = genderInput.value;
                    submitButton1.disabled = true;  // 버튼 비활성화
                    alert(`이름: ${userName}, 성별: ${userGender} 저장되었습니다.`);
                    showNextBlock(index);  // 다음 블록으로 이동
                } else {
                    alert("이름과 성별을 모두 입력해주세요.");
                }
            });
        }

        // 두 번째 폼 (숫자 입력) 처리
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
                    alert('틀렸습니다. 다시 입력해주세요.');
                }
            });
        }


        // 마지막 폼 (카카오톡 아이디 입력) 처리
        if (index === 6) {
            submitButton2.addEventListener('click', function (event) {
                event.preventDefault(); // 기본 폼 제출 동작을 막음
        
                const userKakaoId = block.querySelector('input[name="kakaoId"]').value;

                if (!userKakaoId) {
                    alert("카카오 ID를 입력해주세요.");
                    return;
                }

                // 새로운 FormData 객체 생성
                const formData = new FormData();
                formData.append('name', userName);
                formData.append('gender', userGender);
                formData.append('kakaoId', userKakaoId);

                fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData).toString()
                }).then(response => {
                    if (response.ok) {
                        submitButton2.disabled = true;
                        alert('데이터가 성공적으로 전송되었습니다.\n즐겁고 안전한 풋살되시기 바랍니다!');
                    } else {
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
