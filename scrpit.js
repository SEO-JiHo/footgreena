document.addEventListener('DOMContentLoaded', function () {
    const blocks = document.querySelectorAll('.block');
    blocks.forEach((block, index) => {
        const checkbox = block.querySelector('input[type="checkbox"]');
        const content = block.querySelector('.content');
        const lockedIcon = block.querySelector('.locked');
        const unlockedIcon = block.querySelector('.unlocked');
        const form = block.querySelector('form');
        const numberInput = block.querySelector('input[type="text"]');
        const numberButton = block.querySelector('button[type="button"]');
        const linkButtons = block.querySelectorAll('.link-button');

        // 첫 번째 블록은 초기 상태에서 보이도록 설정
        if (index === 0) {
            content.style.display = 'block';
        }

        // 폼 제출 후 처리
        if (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault(); // 기본 폼 제출 동작을 막음

                const submitButton = form.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.disabled = true; // 제출 버튼 비활성화
                }

                fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(new FormData(event.target)).toString()
                }).then(() => {
                    // 체크박스 상태를 체크된 상태로 변경
                    if (checkbox) {
                        checkbox.checked = true;
                        checkbox.dispatchEvent(new Event('change'));
                    }
                    
                    // 다음 블록의 콘텐츠를 표시
                    showNextBlock(index);
                }).catch((error) => {
                    alert(error);
                    if (submitButton) {
                        submitButton.disabled = false; // 에러가 발생하면 제출 버튼을 다시 활성화
                    }
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

                    // 체크 박스를 비활성화
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

                // 다음 블록의 잠금 아이콘을 숨기고 잠금 해제 아이콘을 보여줌
                if (nextLockedIcon && nextUnlockedIcon) {
                    nextLockedIcon.style.display = 'none';
                    nextUnlockedIcon.style.display = 'block';

                    // 1초 후 잠금 해제 아이콘을 숨기고 콘텐츠를 표시
                    setTimeout(() => {
                        nextUnlockedIcon.style.display = 'none';
                        nextContent.style.display = 'block';
                    }, 800);
                } else {
                    // 다음 블록의 콘텐츠를 보이게 함 (잠금 아이콘이 없는 경우)
                    nextContent.style.display = 'block';
                }
            }
        }
    });
});
