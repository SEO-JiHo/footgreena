document.addEventListener('DOMContentLoaded', function () {
    const blocks = document.querySelectorAll('.block');
    blocks.forEach((block, index) => {
        const checkbox = block.querySelector('input[type="checkbox"]');
        const content = block.querySelector('.content');
        const lockedIcon = block.querySelector('.locked');

        // 첫 번째 블록은 초기 상태에서 보이도록 설정
        if (index === 0) {
            content.style.display = 'block';
        }

        // 체크박스 상태를 감지하여 다음 블록의 콘텐츠를 표시
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                if (lockedIcon) {
                    lockedIcon.style.display = 'none';
                }

                // 체크 박스를 비활성화
                this.disabled = true;

                // 다음 블록의 체크박스와 콘텐츠를 표시
                const nextBlock = blocks[index + 1];
                if (nextBlock) {
                    const nextCheckbox = nextBlock.querySelector('input[type="checkbox"]');
                    const nextContent = nextBlock.querySelector('.content');
                    const nextLockedIcon = nextBlock.querySelector('.locked');

                    // 다음 블록의 잠금 아이콘을 숨김
                    if (nextLockedIcon) {
                        nextLockedIcon.style.display = 'none';
                    }
                    // 다음 블록의 콘텐츠를 보이게 함
                    nextContent.style.display = 'block';
                }
            } else {
                if (lockedIcon) {
                    lockedIcon.style.display = 'block';
                }
            }
        });
    });
});
